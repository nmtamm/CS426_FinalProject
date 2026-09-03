"""
Cloudflare R2 Image Uploader & JSON Updater for CS426 Team.

Description:
  1. Scans all JSON files in the target directory (e.g. recipes or ingredients).
  2. Extracts the `image_url` from each JSON file.
  3. Downloads each image and streams it directly to Cloudflare R2 (S3-compatible).
  4. Updates each JSON file in-place:
     - `image_url`: new public R2 CDN URL (e.g. https://.../ingredients/{hash}.jpg)
     - `original_image_url`: preserved original web URL

Usage:
  1. Make sure .env exists with R2 credentials (or set environment variables).
  2. Install dependencies: pip install boto3 requests python-dotenv
  3. Run script: python upload_images_to_r2.py
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

import boto3
import requests
from dotenv import load_dotenv

# ==============================================================================
# ⚙️ CONFIGURATION (Adjust these paths and settings as needed)
# ==============================================================================

# Path to the directory containing your JSON files
# Example: Path("data/recipes") or Path("data/ingredients")
JSON_DIR = Path(__file__).resolve().parent / "data" / "recipes"

# R2 bucket name
R2_BUCKET_NAME = "cs426"

# Target folder prefix inside the R2 bucket (no leading slash, include trailing slash if needed)
# Example: "recipes" or "ingredients" or "dishes"
R2_FOLDER_PREFIX = "recipes"

# Public R2 domain URL (used to generate the final public image URLs)
R2_PUBLIC_DOMAIN = "https://pub-9e84b49e97da4a04bba49c2e0f033ca5.r2.dev"

# Number of parallel download/upload worker threads (16-32 is recommended for speed)
DEFAULT_CONCURRENCY = 32

# Path to .env file containing credentials (fallback if not in OS environment)
ENV_PATH = Path(__file__).resolve().parent / ".env"

# ==============================================================================
# 🔐 AUTHENTICATION SETUP
# ==============================================================================

load_dotenv(ENV_PATH)

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
}


def get_r2_client():
    """Initializes and returns the boto3 S3 client configured for Cloudflare R2."""
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
        raise RuntimeError(
            "Missing R2 credentials! Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, "
            "and R2_SECRET_ACCESS_KEY are defined in your .env file or environment."
        )

    return boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        region_name="auto",
    )


# ==============================================================================
# 🛠️ HELPER FUNCTIONS
# ==============================================================================

def compute_r2_key(url: str, folder_prefix: str) -> str:
    """
    Generates a deterministic object key in R2 based on the SHA1 hash of the URL.
    This prevents duplicate uploads of the exact same image.
    """
    parsed = urlparse(url)
    ext = os.path.splitext(parsed.path)[1].lower()
    # Normalize extension to standard image types
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        ext = ".jpg"

    url_hash = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    clean_prefix = folder_prefix.strip("/")
    return f"{clean_prefix}/{url_hash}{ext}" if clean_prefix else f"{url_hash}{ext}"


def upload_image(session: requests.Session, s3_client, url: str, folder_prefix: str) -> tuple[str, str | None]:
    """
    Downloads one image and uploads it to R2.
    Returns: (original_url, r2_public_url) or (original_url, None) if failed.
    """
    if not url or not url.startswith("http"):
        return url, None

    # Skip if already uploaded to our R2 public domain
    if url.startswith(R2_PUBLIC_DOMAIN.rstrip("/")):
        return url, url

    key = compute_r2_key(url, folder_prefix)
    r2_public_url = f"{R2_PUBLIC_DOMAIN.rstrip('/')}/{key}"

    # Retry up to 3 times on transient network failures
    for attempt in range(3):
        try:
            resp = session.get(url, headers=HEADERS, timeout=20)
            if resp.status_code == 200 and len(resp.content) > 100:
                content_type = resp.headers.get("Content-Type", "image/jpeg")
                s3_client.put_object(
                    Bucket=R2_BUCKET_NAME,
                    Key=key,
                    Body=resp.content,
                    ContentType=content_type,
                )
                return url, r2_public_url
            elif resp.status_code == 404:
                # Page/image doesn't exist, no point retrying
                return url, None
        except Exception:
            time.sleep(1.0 * (attempt + 1))

    return url, None


# ==============================================================================
# 🚀 MAIN PIPELINE
# ==============================================================================

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Upload images from JSON files to Cloudflare R2")
    parser.add_argument(
        "--json-dir",
        type=Path,
        default=JSON_DIR,
        help=f"Directory containing JSON files (default: {JSON_DIR})",
    )
    parser.add_argument(
        "--folder",
        type=str,
        default=R2_FOLDER_PREFIX,
        help=f"R2 target folder prefix (default: {R2_FOLDER_PREFIX})",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=DEFAULT_CONCURRENCY,
        help=f"Parallel upload threads (default: {DEFAULT_CONCURRENCY})",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Optional: limit number of images for quick testing",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Check how many images to upload without making network calls",
    )
    args = parser.parse_args(argv)

    json_dir = args.json_dir
    folder_prefix = args.folder

    if not json_dir.exists():
        print(f"Error: Directory '{json_dir}' does not exist!", file=sys.stderr)
        return 1

    # 1. Scan JSON files and map unique external images
    recipe_files = sorted(json_dir.glob("*.json"))
    print(f"Scanning {len(recipe_files)} JSON files in '{json_dir}'...", flush=True)

    url_to_json_files: dict[str, list[Path]] = {}
    for p in recipe_files:
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            img = (data.get("image_url") or "").strip()
            # Only pick valid HTTP URLs that are not already on R2
            if img and img.startswith("http") and not img.startswith(R2_PUBLIC_DOMAIN.rstrip("/")):
                url_to_json_files.setdefault(img, []).append(p)
        except Exception:
            pass

    unique_urls = list(url_to_json_files.keys())
    if args.limit:
        unique_urls = unique_urls[: args.limit]

    print(f"Found {len(unique_urls)} unique external images to upload.", flush=True)

    if not unique_urls:
        print("No new external images to upload (all files already have R2 URLs or no images).")
        return 0

    if args.dry_run:
        sample_url = unique_urls[0]
        sample_key = compute_r2_key(sample_url, folder_prefix)
        print(f"\n[Dry Run] Sample external URL: {sample_url}")
        print(f"[Dry Run] Sample R2 key:        {sample_key}")
        print(f"[Dry Run] Sample R2 public URL: {R2_PUBLIC_DOMAIN.rstrip('/')}/{sample_key}")
        return 0

    # 2. Upload images in parallel
    s3_client = get_r2_client()
    session = requests.Session()

    success_map: dict[str, str] = {}
    failed_count = 0
    total = len(unique_urls)
    start_time = time.time()

    print(f"\nStarting upload with {args.concurrency} concurrent threads to '{R2_BUCKET_NAME}/{folder_prefix}'...\n", flush=True)

    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {
            executor.submit(upload_image, session, s3_client, url, folder_prefix): url
            for url in unique_urls
        }

        done = 0
        for future in as_completed(futures):
            done += 1
            orig_url, r2_url = future.result()
            if r2_url:
                success_map[orig_url] = r2_url
            else:
                failed_count += 1

            if done % 100 == 0 or done == total:
                elapsed = time.time() - start_time
                rate = done / elapsed if elapsed > 0 else 0
                print(
                    f"Progress: [{done}/{total}] ({done/total*100:.1f}%) | "
                    f"Success: {len(success_map)}, Failed: {failed_count} | {rate:.1f} img/s",
                    flush=True,
                )

    # 3. Update the JSON files with the new R2 public CDN URLs
    print("\nUpdating JSON files with R2 public URLs...", flush=True)
    updated_files = 0
    for orig_url, r2_url in success_map.items():
        for json_path in url_to_json_files.get(orig_url, []):
            try:
                data = json.loads(json_path.read_text(encoding="utf-8"))
                data["image_url"] = r2_url
                data["original_image_url"] = orig_url
                json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                updated_files += 1
            except Exception:
                pass

    total_time = time.time() - start_time
    print(
        f"\n🎉 Done! Uploaded {len(success_map)}/{total} images to R2. "
        f"Updated {updated_files} JSON files in {total_time:.1f}s."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
