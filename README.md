# Drafty

A beautiful, minimalist note-taking application built with TypeScript, React, and Vite.

## Features

- 🏠 **Beautiful Homepage** - Professional landing page showcasing features and security
- ✏️ **Create and manage notes** - Write and organize your thoughts effortlessly
- 🔐 **Firebase Authentication** - Secure user login and signup with Firebase Analytics
- 👤 **User-specific notes** - Each user has their own private notes
- 🎨 **Claude-inspired theme** - Warm, professional design with a focus on readability
- 🔤 **Trebuchet MS font** - Clean, modern typography throughout
- 💾 **Local storage** - Your notes are automatically saved to your browser
- 🎯 **Simple and intuitive** - No unnecessary complexity, just notes

## Security & Data Storage

### Authentication
- **Firebase Authentication**: Industry-leading authentication from Google Firebase
- **Secure Login**: Email/password authentication with secure session management
- **User Isolation**: Each user's data is completely isolated from others

### Data Storage
Your notes are currently stored in **browser localStorage** with the following characteristics:

✅ **Secure & Private**
- Notes are stored locally on your device
- Data is tied to your Firebase user ID
- No one else can access your notes

✅ **Fast & Reliable**
- Instant saving as you type
- No network latency
- Works offline

⚠️ **Device-Specific**
- Notes are stored per device
- Not synced across devices (currently)

🔮 **Future Enhancement**
- Firebase Firestore integration planned for cloud storage
- Cross-device synchronization while maintaining security

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Firebase account (free tier works)

### Firebase Setup

**Note**: The Firebase configuration is already set up with the project credentials. You can optionally override them with environment variables.

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Email/Password authentication in the Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
3. (Optional) To use custom Firebase credentials:
   - Get your Firebase configuration from Project Settings > General
   - Create a `.env` file in the project root (copy from `.env.example`)
   - Fill in your Firebase credentials

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Visit the homepage** at [http://localhost:5173](http://localhost:5173) to learn about features
2. Click **"Get Started"** to access the app
3. **Sign up or sign in** with your email and password
4. Click "✏️ New Note" to create a new note
5. Enter a title and start writing
6. Your notes are automatically saved as you type
7. Click on any note in the sidebar to view or edit it
8. Use the "🗑️ Delete" button to remove notes
9. Click "🚪 Sign Out" when you're done

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Firebase** - Authentication, Analytics, and user management
- **CSS3** - Styling with CSS variables

## Design Philosophy

Drafty follows a minimalist design philosophy inspired by Claude's interface:
- Warm, earthy color palette (#ca9763 accent color)
- Clean, spacious layout
- Focus on content over chrome
- Smooth transitions and interactions

## License

MIT
