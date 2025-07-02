# tasQ - AI-Powered Task Manager

> "built for doers, not draggers"

A clean, monochromatic, minimalist task manager app built with React Native (Expo) that focuses on effortless task scheduling through a natural language AI assistant and visual productivity tracking.

## Features

- **🔐 Google Authentication** - Secure login with Firebase Auth
- **✅ Smart Task Management** - Add, complete, and track daily tasks
- **📅 Calendar View** - Monthly calendar with visual progress tracking
- **📊 Growth Analytics** - Track completion rates with beautiful charts
- **🤖 Gemini AI Assistant** - Intelligent natural language task parsing with Google Gemini
- **🔔 Push Notifications** - Smart reminders for scheduled tasks
- **🌙 Dark Theme** - Monochromatic design with black background and white elements

## Screenshots

The app includes:
- Animated splash screen with typewriter effect
- Google Sign-In authentication
- Daily task view with greeting and time
- Calendar with growth rate visualization
- AI chat interface for natural task management

## Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation (Bottom Tabs)
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore
- **AI**: Google Gemini Pro API
- **Notifications**: Expo Notifications
- **Charts**: react-native-chart-kit
- **Animations**: react-native-animatable

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Firebase project
- Google OAuth credentials
- Google Gemini API key (optional but recommended)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tasq

# Install dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/cli
```

### 3. Environment Variables

Create a `.env` file in your project root:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=your-expo-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Google Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 4. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google Sign-In
3. Create a Firestore database
4. Get your Firebase configuration object
5. Add your Firebase config to the `.env` file

### 5. Google OAuth Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google Sign-In
3. Get OAuth client IDs for different platforms
4. Add your OAuth client IDs to the `.env` file

### 6. Gemini AI Setup (Optional but Recommended)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini
3. Add `EXPO_PUBLIC_GEMINI_API_KEY` to your `.env` file
4. This enables intelligent task parsing and AI responses

**Note**: The app will work without Gemini AI using fallback parsing, but the AI features will be much more limited.

### 7. Firestore Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 8. Push Notifications (Optional)

For push notifications to work:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for development
eas build --platform all --profile development
```

**Note**: Push notifications only work in built apps, not in Expo Go.

### 9. Running the App

```bash
# Start the Expo development server
npx expo start

# Run on specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web

# Quick setup (runs setup wizard)
npm run setup
```

## Project Structure

```
tasq/
├── App.js                          # Main app entry point
├── src/
│   ├── contexts/
│   │   └── AuthContext.js         # Authentication context
│   ├── screens/
│   │   ├── SplashScreen.js        # Animated splash screen
│   │   ├── LoginScreen.js         # Google authentication
│   │   ├── TaskScreen.js          # Main task management
│   │   ├── CalendarScreen.js      # Calendar and growth tracking
│   │   └── AIChatScreen.js        # AI task assistant
│   ├── navigation/
│   │   └── BottomTabNavigator.js  # Main navigation
│   └── services/
│       └── firebase.js            # Firebase configuration
├── package.json
└── README.md
```

## Usage

### Adding Tasks
- Tap "add more.." on the Tasks screen to manually add tasks
- Use the AI chat to add tasks naturally: "Remind me to call Mom at 8pm"
- Tasks are automatically saved to your personal Firestore collection

### AI Assistant Commands (Powered by Gemini)
The AI can understand complex natural language patterns:
- "Remind me to call Mom at 8pm tomorrow"
- "Add gym workout for Monday morning"
- "I need to buy groceries this weekend"
- "Important meeting with boss at 9 AM next Tuesday"
- "Schedule doctor appointment for 3:30 PM Friday"

**Enhanced with Gemini AI:**
- Automatically detects task priority (High/Medium/Low)
- Categorizes tasks (Work, Personal, Health, Shopping, etc.)
- Better time and date parsing
- Intelligent task title extraction
- Contextual AI responses

### Growth Tracking
- View your completion rates in the Calendar tab
- Data shows percentage of tasks completed per day
- Visual chart displays your productivity trends

## Customization

### Styling
The app uses a monochromatic theme defined in each component's StyleSheet. Main colors:
- Background: `#000` (black)
- Text: `#fff` (white)
- Accents: `#333` (dark gray)
- Borders: `#666` (medium gray)

### AI Enhancement
To integrate with OpenAI or other AI services:
1. Add your API keys to environment variables
2. Update the `parseTaskFromText` function in `AIChatScreen.js`
3. Implement more sophisticated natural language processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email harshrj.dev@gmail.com or create an issue in the repository.

---

**Built for doers, not draggers** 🚀 
