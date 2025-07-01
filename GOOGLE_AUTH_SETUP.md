# 🔐 Google Authentication Setup Guide for tasQ

## Step-by-Step Setup Process

### 1. Firebase Console Setup

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create or Select Project**
   - Click "Create a project"
   - Enter project name: "tasq-app" (or your preferred name)
   - Enable Google Analytics (optional)
   - Wait for project creation

3. **Enable Authentication**
   - In your Firebase project dashboard
   - Go to **Build** → **Authentication**
   - Click **Get started**
   - Go to **Sign-in method** tab
   - Click on **Google** provider (don't enable yet, we'll do this later)

### 2. Google Cloud Console Setup

1. **Open Google Cloud Console**
   - Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Select the same project that Firebase created

2. **Enable Required APIs**
   - Navigate to **APIs & Services** → **Library**
   - Search and enable:
     - **Google+ API** (if available)
     - **People API**
     - **Google Sign-In API**

3. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** (unless you have a workspace)
   - Fill required fields:
     ```
     App name: tasQ
     User support email: your-email@gmail.com
     App logo: (optional)
     App domain: (leave blank for now)
     Developer contact: your-email@gmail.com
     ```
   - Click **Save and Continue** through all steps
   - Add your email as a test user

### 3. Create OAuth Credentials

1. **Go to Credentials**
   - **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**

2. **Create Web Client ID**
   ```
   Application type: Web application
   Name: tasQ Web Client
   Authorized redirect URIs: (leave empty for now)
   ```
   - Click **Create**
   - **SAVE THIS CLIENT ID** → This is your `GOOGLE_WEB_CLIENT_ID`

3. **Create Android Client ID**
   ```
   Application type: Android
   Name: tasQ Android Client
   Package name: com.tasq.app
   SHA-1: DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09
   ```
   - Click **Create**
   - **SAVE THIS CLIENT ID** → This is your `GOOGLE_ANDROID_CLIENT_ID`

4. **Create iOS Client ID**
   ```
   Application type: iOS
   Name: tasQ iOS Client
   Bundle ID: com.tasq.app
   ```
   - Click **Create**
   - **SAVE THIS CLIENT ID** → This is your `GOOGLE_IOS_CLIENT_ID`

### 4. Configure Firebase Authentication

1. **Back to Firebase Console**
   - Go to **Authentication** → **Sign-in method**
   - Click on **Google** provider
   - **Enable** the toggle
   - **Web SDK configuration**: Paste your **Web Client ID** from step 3.2
   - Click **Save**

### 5. Get Firebase Configuration

1. **In Firebase Console**
   - Go to **Project Settings** (gear icon)
   - Scroll down to **Your apps**
   - Click **Add app** → Web icon `</>`
   - App nickname: "tasQ Web"
   - Click **Register app**

2. **Copy Firebase Config Values**
   - You'll see a config object - copy each value for your .env file

### 6. Get Gemini AI API Key

1. **Go to Google AI Studio**
   - Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click **Create API Key**
   - **SAVE THIS KEY** → This is your `GEMINI_API_KEY`

## 📄 Create Your .env File

Create a `.env` file in your project root with these values:

```bash
# =============================================
# tasQ App Environment Variables
# =============================================

# Firebase Configuration (from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcd1234567890

# Google OAuth Configuration (from Google Cloud Console)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123456789012-qrstuvwxyz123456.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=123456789012-987654321abcdef.apps.googleusercontent.com

# Google Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC_your_gemini_api_key_here

# App Configuration
EXPO_PUBLIC_APP_NAME=tasQ
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 🚀 Testing Your Setup

1. **Create your .env file** with the values above
2. **Start the development server**:
   ```bash
   npx expo start
   ```
3. **Test Google Sign-In**:
   - The app should load without errors
   - Try signing in with Google
   - Check the console for any authentication errors

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid client" error**
   - Double-check your client IDs in .env file
   - Ensure you've enabled Google Sign-In in Firebase

2. **"Unauthorized domain" error**
   - Add your domain to authorized domains in Firebase Console
   - For development, this usually isn't needed

3. **App crashes on Google Sign-In**
   - Check that all required packages are installed
   - Verify your Firebase project is active

### Need Help?

If you encounter any issues:

1. **Check Firebase Console**:
   - Go to Authentication → Users to see if sign-ins are being recorded
   - Check Authentication → Sign-in method to ensure Google is enabled

2. **Check Google Cloud Console**:
   - Verify all OAuth clients are created
   - Check quota usage in APIs & Services → Dashboard

3. **Common Commands**:
   ```bash
   # Clear Expo cache
   npx expo start --clear

   # Reinstall dependencies
   npm install

   # Check environment variables
   npx expo config
   ```

## 📱 Next Steps

After Google Auth is working:
1. Test the app on different platforms (iOS, Android, Web)
2. Set up production OAuth clients with proper domains
3. Configure push notifications
4. Deploy to app stores

---

**Important**: Keep your API keys secure and never commit your `.env` file to version control! 