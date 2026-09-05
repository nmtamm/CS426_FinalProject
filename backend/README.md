# Backend

## Database File Remove
If you already use our application and has `backend\app\data\nutri_plan.db` in your local working directory but still want to get updated data from us, **delete your old file** before fetch. Since github does not help track db file, the remote db file will be removed if you already have one.

## Qdrant Connect
Please send me an email for link and api key to get access to Qdrant.

## Build Dockerfile
```bash
docker build -t myapp .
```

## Run with a container name:
```bash
docker run --rm -it --name mycontainer -p 8000:8000 -v path-to-your-root-folder\backend:/app myapp
```

## Copy an environment file to docker image:
```
docker cp path-to-your-root-folder\backend\.env mycontainer:/app/.env
```

For the structure of `.env` file, take a look at `backend\.env.example`