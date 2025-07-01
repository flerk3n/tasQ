#!/usr/bin/env node

/**
 * tasQ Setup Script
 * Helps users set up the project with necessary configurations
 */

const fs = require('fs');
const path = require('path');

const setupSteps = [
  {
    title: '📋 tasQ Setup Wizard',
    action: () => {
      console.log('\n🎉 Welcome to tasQ - "built for doers, not draggers"');
      console.log('\nThis setup wizard will help you configure your project.\n');
    }
  },
  {
    title: '1. Environment Variables',
    action: () => {
      console.log('🔧 Environment Setup:');
      console.log('   Create a .env file in your project root with these variables:');
      console.log('   (See the manual setup section below for all required variables)');
      console.log('');
    }
  },
  {
    title: '2. Firebase Configuration',
    action: () => {
      console.log('🔥 Firebase Setup:');
      console.log('   1. Create a new Firebase project at https://console.firebase.google.com/');
      console.log('   2. Enable Authentication with Google Sign-In');
      console.log('   3. Create a Firestore database');
      console.log('   4. Get your Firebase configuration object');
      console.log('   5. Add Firebase config to your .env file');
      console.log('');
    }
  },
  {
    title: '3. Google OAuth Setup',
    action: () => {
      console.log('🔐 Google OAuth Setup:');
      console.log('   1. In Firebase Console, go to Authentication > Sign-in method');
      console.log('   2. Enable Google Sign-In');
      console.log('   3. Get OAuth client IDs for different platforms');
      console.log('   4. Add OAuth client IDs to your .env file');
      console.log('');
    }
  },
  {
    title: '4. Gemini AI Setup',
    action: () => {
      console.log('🤖 Gemini AI Setup:');
      console.log('   1. Go to Google AI Studio: https://makersuite.google.com/app/apikey');
      console.log('   2. Create a new API key for Gemini');
      console.log('   3. Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file');
      console.log('   4. This enables intelligent task parsing and AI responses');
      console.log('');
    }
  },
  {
    title: '5. Install Dependencies',
    action: () => {
      console.log('📦 Installing dependencies...');
      console.log('   Run: npm install');
      console.log('   Or: yarn install');
      console.log('');
    }
  },
  {
    title: '6. Firestore Security Rules',
    action: () => {
      console.log('🔒 Set up Firestore security rules:');
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}`);
      console.log('');
    }
  },
  {
    title: '7. Push Notifications (Optional)',
    action: () => {
      console.log('🔔 Push Notifications Setup:');
      console.log('   1. Install EAS CLI: npm install -g @expo/eas-cli');
      console.log('   2. Run: eas build:configure');
      console.log('   3. This will generate push notification credentials');
      console.log('   4. Notifications will work automatically after building');
      console.log('');
    }
  },
  {
    title: '8. Create Assets',
    action: () => {
      console.log('🎨 Create app assets:');
      console.log('   Add the following files to the assets/ directory:');
      console.log('   - icon.png (1024x1024)');
      console.log('   - splash.png (1242x2436)');
      console.log('   - adaptive-icon.png (1024x1024)');
      console.log('   - favicon.png (32x32)');
      console.log('   - notification-icon.png (96x96, simple white icon)');
      console.log('');
    }
  },
  {
    title: '9. Run the App',
    action: () => {
      console.log('🚀 Start development:');
      console.log('   npx expo start');
      console.log('');
      console.log('   Or for specific platforms:');
      console.log('   npx expo start --ios');
      console.log('   npx expo start --android');
      console.log('   npx expo start --web');
      console.log('');
    }
  },
  {
    title: '✅ Setup Complete!',
    action: () => {
      console.log('🎉 Your tasQ app is ready to go!');
      console.log('');
      console.log('📚 Documentation: Check README.md for detailed instructions');
      console.log('🐛 Issues: Create an issue on GitHub if you need help');
      console.log('💡 Features: Explore the AI assistant by typing natural language tasks');
      console.log('');
      console.log('Happy task managing! 🚀');
      console.log('');
    }
  }
];

// Run setup
console.clear();
setupSteps.forEach((step, index) => {
  console.log(`\n${step.title}`);
  console.log('='.repeat(step.title.length));
  step.action();
  
  if (index < setupSteps.length - 1) {
    console.log('─'.repeat(50));
  }
});

// Create sample environment file if it doesn't exist
const envExamplePath = path.join(__dirname, '.env.example');
const envExample = `# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id

# Google OAuth Configuration
GOOGLE_EXPO_CLIENT_ID=your-expo-client-id
GOOGLE_IOS_CLIENT_ID=your-ios-client-id
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
GOOGLE_WEB_CLIENT_ID=your-web-client-id

# Optional: OpenAI API Key for enhanced AI features
OPENAI_API_KEY=your-openai-api-key`;

if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envExample);
  console.log('📄 Created .env.example file for your reference');
}

console.log('\n' + '='.repeat(70));
console.log('📋 MANUAL SETUP REQUIRED');
console.log('='.repeat(70));
console.log('\n🔧 Create a .env file in your project root with these variables:\n');

console.log('# =============================================');
console.log('# tasQ App Environment Variables');
console.log('# =============================================\n');

console.log('# Firebase Configuration');
console.log('# Get these from Firebase Console > Project Settings > General');
console.log('EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key');
console.log('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
console.log('EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id');
console.log('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
console.log('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id');
console.log('EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id\n');

console.log('# Google OAuth Configuration');
console.log('# Get these from Google Cloud Console > APIs & Services > Credentials');
console.log('EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=your-expo-client-id');
console.log('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com');
console.log('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com');
console.log('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com\n');

console.log('# Google Gemini AI Configuration');
console.log('# Get API key from Google AI Studio: https://makersuite.google.com/app/apikey');
console.log('EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key\n');

console.log('# Push Notifications (Expo)');
console.log('# These will be auto-generated when you build with EAS');
console.log('EXPO_PUBLIC_PUSH_NOTIFICATION_PROJECT_ID=your-expo-project-id\n');

console.log('='.repeat(70));
console.log('📚 NEXT STEPS:');
console.log('='.repeat(70));
console.log('1. Copy the environment variables above into your .env file');
console.log('2. Replace all "your-*" placeholders with your actual values');
console.log('3. Run: npm install');
console.log('4. Run: npx expo start');
console.log('');
console.log('🔔 For push notifications:');
console.log('   npm install -g @expo/eas-cli');
console.log('   eas build:configure');
console.log('');
console.log('💡 The app will work without Gemini AI (uses fallback parsing)');
console.log('   but adding the API key enables much smarter task understanding!');
console.log(''); 