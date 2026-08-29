# Mobile Frontend

Mobile application built with **React Native**, **JavaScript**, **Tailwind CSS (NativeWind)**, and **Material Design (React Native Paper)**.

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (Bare Workflow / Prebuild)
- **Language:** JavaScript
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) via [NativeWind v4](https://www.nativewind.dev/)
- **UI Components:** [React Native Paper](https://reactnativepaper.com/) (Material 3 Design)
- **Package Manager:** [Yarn](https://yarnpkg.com/)
- **Code Quality:** ESLint & Prettier

---

## 📁 Project Structure

```
frontend/
├── App.js                 # App entry component
├── global.css             # Tailwind base styles
├── tailwind.config.js     # Tailwind CSS configuration
├── babel.config.js        # Babel presets & plugins
├── metro.config.js        # Metro bundler config for NativeWind
├── eslint.config.mjs      # ESLint configuration
├── .prettierrc.json       # Prettier formatting rules
├── package.json           # Scripts and dependencies
├── src/                   # Source code (screens, components, services, etc.)
└── android/               # Native Android project (open in Android Studio)
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
yarn install
```

### 2. Development

#### Option A: Run via CLI

```bash
# Start Metro bundler
yarn start

# Run directly on connected Android device / emulator
yarn android

# Run on iOS simulator (macOS required)
yarn ios

# Run web preview
yarn web
```

#### Option B: Run via Android Studio

1. Open **Android Studio**.
2. Select **Open** and choose the `frontend/android` directory.
3. Wait for Gradle sync to complete.
4. In a terminal, start Metro bundler:
   ```bash
   cd frontend
   yarn start
   ```
5. Click **Run (Shift+F10)** in Android Studio.

---

## 🧹 Code Quality Scripts

```bash
# Check code style with ESLint
yarn lint

# Auto-fix linting issues & sort imports
yarn lint:fix

# Format code with Prettier
yarn format
```
