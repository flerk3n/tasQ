# 🔥 Simple Firebase Auth Setup (OAuth-Free)

## Pure Firebase Authentication - No OAuth Complexity!

Super simple setup with just Firebase - no Google Cloud Console needed!

## 🚀 Firebase-Only Setup (3 minutes)

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Click "Create a project"
   - Name: "tasq-app" (or whatever you prefer)
   - Enable Google Analytics: Optional
   - Click "Create project"

### Step 2: Enable Anonymous Authentication (for testing)

1. **In your Firebase project**
   - Go to **Build** → **Authentication**
   - Click **Get started**
   - Go to **Sign-in method** tab
   - Find **Anonymous** in the list
   - Click **Anonymous**
   - Toggle **Enable** switch ON
   - Click **Save**

That's it! Anonymous auth is now enabled for testing.

### Step 3: Get Your Firebase Configuration

1. **Still in Firebase Console**
   - Click the **gear icon** (Project Settings)
   - Scroll down to **Your apps** section
   - Click **Add app** → **Web** (</> icon)
   - **App nickname**: "tasQ Web"
   - **Don't** check Firebase Hosting
   - Click **Register app**

2. **Copy These Values**
   ```javascript
   // You'll see something like this:
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "tasq-app-12345.firebaseapp.com",
     projectId: "tasq-app-12345",
     storageBucket: "tasq-app-12345.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

### Step 4: Create Simple .env File

Create `.env` in your project root with ONLY Firebase values:

```bash
# Firebase Configuration (from step 3)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tasq-app-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tasq-app-12345
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tasq-app-12345.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Gemini AI (Optional - for AI features)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here

# App Info
EXPO_PUBLIC_APP_NAME=tasQ
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## ✅ Test Your Setup

1. **Create your `.env` file** with the Firebase values
2. **Start the app**:
   ```bash
   npm install
   npx expo start
   ```
3. **Try Sign-In** - it will sign you in anonymously for testing!

## 🎯 What This Gives You

- ✅ **Anonymous sign-in** for testing all app features
- ✅ **Firebase manages everything**: sessions, security, user data  
- ✅ **Works on all platforms**: iOS, Android, Web
- ✅ **No OAuth complexity** - just Firebase!
- ✅ **Automatic user management** in Firebase Console

## 🔧 If You Get Errors

1. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure you enabled Anonymous sign-in in Firebase Console

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Double-check your API key in .env file

3. **App won't start**
   - Run: `npx expo start --clear`

## 🚀 Later: Add Real Google Sign-In

When you're ready for real Google Sign-In:
1. Enable Google provider in Firebase Console
2. Add Google Sign-In dependency
3. Update the `signInWithGoogle` function

## 🎉 That's It!

Much simpler! No OAuth setup, no client IDs, just pure Firebase Auth.

---

**Note**: You only need the Gemini API key if you want the AI chat features. The authentication works with just Firebase! 