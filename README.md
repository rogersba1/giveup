# GiveUp

A modern React application built with TypeScript and Vite for fast development and optimal performance.

## Project Overview

GiveUp is a community-driven platform that connects parents to exchange children's items such as clothing, toys, and accessories. The application helps reduce waste and supports families by facilitating the free exchange of outgrown or unused children's items. Built with modern web technologies, it provides a responsive and intuitive user experience for browsing, posting, and managing item exchanges.

### Key Features

- **User Authentication** - Secure Google sign-in integration via Firebase Auth
- **Item Posting** - Upload items with multiple photos, detailed descriptions, and categorization
- **Smart Browsing** - Search and filter items by category (clothing, toys, accessories), age group, gender, and condition
- **Personal Dashboard** - Manage your posted items and view your giving history
- **Responsive Design** - Optimized for desktop and mobile devices
- **Real-time Updates** - Live item availability and user interactions

## Technical Stack

- **Frontend Framework**: React 19
- **Type Safety**: TypeScript
- **Build Tool**: Vite 6
- **UI Framework**: Material-UI (MUI) 6 with Emotion
- **Backend Services**: Firebase
  - Authentication (Google OAuth)
  - Firestore Database
  - Cloud Storage
- **Routing**: React Router DOM 7
- **State Management**: React Context API
- **Styling**: Material-UI theming with custom design system
- **Development**: Hot Module Replacement (HMR), ESLint, TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rogersba1/giveup.git
cd giveup

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Firebase configuration values

# Start development server
npm run dev
```

### Environment Setup

The application requires Firebase configuration. Follow these steps:

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Enable services**:
   - Authentication (enable Google provider)
   - Firestore Database
   - Cloud Storage
3. **Get your Firebase config** from Project Settings > General > Your apps
4. **Copy `.env.example` to `.env`** and fill in your Firebase values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Available Scripts

- `npm run dev` - Start development server (with HMR)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Development

This project uses Vite for fast development with Hot Module Replacement (HMR) and [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) for Fast Refresh with Babel.

### Architecture Highlights

- **Authentication Flow**: Firebase Auth with Google OAuth integration
- **Data Model**: Firestore collections for users and items with real-time updates
- **File Storage**: Firebase Storage for item images with automatic resizing
- **Routing**: Protected routes for authenticated users, public browsing for visitors
- **UI Components**: Material-UI component library with custom theming
- **Type Safety**: Comprehensive TypeScript interfaces for all data models

### Data Model

The application centers around the `Item` entity with the following structure:

- **Categories**: clothing, toy, accessory
- **Age Groups**: baby, toddler, preschooler, child
- **Gender**: boy, girl, neutral
- **Condition States**: new, like-new, used
- **Features**: Multiple image support, size information, availability tracking

### Usage Flow

1. **Browse Items**: Anyone can view available items without authentication
2. **Sign In**: Users authenticate via Google to post or manage items
3. **Add Items**: Authenticated users can create listings with photos and details
4. **Manage Items**: Users can view and manage their posted items
5. **Item Discovery**: Advanced filtering by category, age group, gender, and search terms

### Code Quality

The project includes ESLint configuration for maintaining code quality. For production applications, consider enabling type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Navigation.tsx      # Main navigation bar
│   ├── Footer.tsx          # Site footer
│   └── ProtectedRoute.tsx  # Authentication wrapper
├── pages/          # Page components and routes
│   ├── Home.tsx           # Landing page
│   ├── Login.tsx          # Authentication page
│   ├── ItemsPage.tsx      # Browse all items
│   ├── ItemDetail.tsx     # Individual item view
│   ├── AddItem.tsx        # Create new item listing
│   ├── MyItems.tsx        # User's item management
│   └── Profile.tsx        # User profile page
├── contexts/       # React Context providers
│   └── AuthContext.tsx    # Authentication state management
├── firebase/       # Firebase configuration and setup
│   └── config.ts          # Firebase initialization
├── types/          # TypeScript type definitions
│   └── Item.ts            # Item and form data types
├── assets/         # Static assets (images, icons)
└── theme.ts        # Material-UI theme configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. Please specify your chosen license (e.g., MIT, Apache 2.0, GPL-3.0) or add a LICENSE file to the repository.
