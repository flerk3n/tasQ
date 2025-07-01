🧾 Project Specification for Cursor Agent Mode
App Name: tasQ
Tagline: "built for doers, not draggers."
📌 Overview:
tasQ is a clean, monochromatic, minimalist task manager app built with React Native (Expo). It focuses on effortless task scheduling through a natural language AI assistant and visual productivity tracking. It uses Google Sign-In for user authentication via Firebase, ensuring secure, personal task storage.

🧠 Core Functionalities:
🔐 1. Authentication (Google Sign-In)
Use Firebase Authentication with Expo SDK for Google login.

On launch, the user sees a login screen with two options:

“Sign up” with Google (via expo-auth-session or firebase/auth)

“Log in” if they’ve signed in before

Upon login, user data is stored in Firebase Firestore under their UID.

All task data is scoped per authenticated user.

🧱 App Layout
App uses a 3-tab bottom navigation, each representing a core view:

✅ 1. Task View (Home)
Greets the user by name with the current time and date.

Task list shows:

✅ Completed tasks (with strikethrough)

⬜ Incomplete tasks

Tasks are stored in Firebase Firestore under tasks/{userId}/dailyTasks/{date}

User can:

Add a new task manually

Check/uncheck to update status

Includes a subtle animation when checking off tasks.

📆 2. Calendar + Growth Tracker
A monthly calendar shows the current date.

Below is a Growth Rate Graph:

Graph shows % of tasks completed per day of the week.

Calculation:

mathematica
Copy
Edit
(Completed Tasks / Total Tasks) * 100 for each day
Data is pulled from Firestore grouped by date.

Motivational quote at the top: “1% Better Everyday”

🤖 3. tasQ.ai – AI Task Manager
An AI interface to manage tasks by chatting naturally.

User can type:

“Remind me to call Mom at 8pm”

“I need to work on my resume at 6am tomorrow”

AI parses the time/date and creates tasks automatically.

New tasks are added to the daily task list via Firestore.

Components:

Text input with prompt: “type to manage tasks…”

AI chat bubble view

(Optional) typing animation for AI response

🚀 Splash Screen
Displays the tasQ logo (as per UI design).

Tagline “built for doers, not draggers” is typed with a typewriter animation.

Arrow button to proceed after loading.

🔧 Tech Stack
Feature	Technology
App Framework	React Native (Expo)
Navigation	React Navigation (Bottom Tabs)
Authentication	Firebase Auth (Google Sign-In)
Database	Firebase Firestore
Charts	react-native-chart-kit / Victory Native
Animations	react-native-animatable, Lottie
AI (task parsing)	OpenAI API / Langchain / Local LLM
Storage (offline)	AsyncStorage / expo-secure-store

🎨 UI/UX Design Guidelines
Monochrome theme: black background, white elements only

Zero clutter, only essentials shown on screen

Use modern system font with bold text for titles

Animated strikethrough for completed tasks

Simple, tappable interface with no dropdowns or clutter

🔮 Optional Future Features
Push notifications for time-based reminders

AI suggestion engine: “You usually forget to buy groceries on Fridays”

Voice input for tasQ.ai

Productivity heatmap or streak counter

💡 Developer Notes
Use Firebase onAuthStateChanged() to redirect users after login

Store all task objects with title, time, date, isComplete, createdBy fields

AI assistant should call a backend function (or LLM API) that:

Parses input

Returns structured task info (time, date, title)

Graph auto-updates when tasks are completed or modified