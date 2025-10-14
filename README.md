# CompanIOn 👋

A "buddy" application targeted towards children with autism. Built as a Senior Capstone Project.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Getting Started

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   > **Note:** Sometimes `npm install` doesn't install all required dependencies. If you encounter missing dependency errors after running `npx expo start`, manually install them as they appear in the error messages.

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   > **Note:** Similar to the client setup, you may need to manually install missing dependencies if errors occur.

3. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

- If you encounter missing dependency errors, check the error messages carefully and install the specific packages mentioned:
  ```bash
  npm install <missing-package-name>
  ```
- Make sure you have Node.js and npm installed on your system
- For Expo-related issues, ensure you have the Expo CLI installed globally: `npm install -g expo-cli`

## Fresh Project Setup

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web

## Join the Community

Join our community of developers creating universal apps:

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions