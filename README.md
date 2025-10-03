# 🇧🇷 Portuguese Verb Tenses Flashcards App

A modern web application built with React, TypeScript, and Vite to help learners master Portuguese verb conjugations across all tenses.

## 🎯 Features

- **📚 Study Mode**: Interactive flashcards with contextual phrases
- **🧠 Quiz Mode**: Multiple choice questions with smart distractors
- **📊 Statistics**: Track progress by tense and verb type
- **⚙️ Settings**: Customize your learning experience
- **🎨 Tropical Design**: Beautiful, responsive UI with Portuguese theme

## 🚀 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS with tropical theme
- **Development**: Hot Module Replacement (HMR)

## 📋 Project Status

### ✅ Phase 1: Project Setup & Basic Structure (Complete)
- Vite + React + TypeScript project initialization
- Multi-page routing with React Router
- Tropical-themed UI with responsive design
- Navigation header with active page highlighting
- All page components created
- Layout fixes for consistent full-width design

### 🔄 Next: Phase 2: Data Structure & Types
- TypeScript interfaces for cards and user progress
- JSON data structure for Portuguese verbs
- Data loading utilities

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd flashcard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Access the App
- **Development**: http://localhost:5173/ or http://127.0.0.1:5173/
- **Production**: Build and serve the `dist` folder

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── Home.tsx        # Welcome page
│   ├── Study.tsx       # Flashcard study mode
│   ├── Quiz.tsx        # Quiz mode
│   ├── Statistics.tsx  # Progress tracking
│   └── Settings.tsx    # User preferences
├── data/               # JSON data files (Phase 2)
├── types/              # TypeScript type definitions (Phase 2)
├── utils/              # Utility functions (Phase 2)
├── App.tsx             # Main app component with routing
├── App.css             # Main styles with tropical theme
└── main.tsx            # App entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Vibrant greens (#2E8B57, #32CD32)
- **Secondary**: Warm yellows and coral accents
- **Background**: Light tropical gradients
- **Text**: High contrast for accessibility

### Layout
- **Max Width**: 1200px (centered)
- **Responsive**: Mobile-first design
- **Typography**: System fonts with Portuguese character support

## 📚 Documentation

- **Specification**: `specification.md` - Complete project requirements
- **TODO List**: `TODO.md` - Implementation roadmap with 80+ tasks
- **Git History**: Track progress through commits

## 🔧 Configuration

### TypeScript
- Strict mode enabled
- Path mapping configured
- React JSX support

### ESLint
- TypeScript-aware linting
- React-specific rules
- Code quality enforcement

### Vite
- Fast development server
- Hot Module Replacement
- Optimized production builds

## 🚀 Deployment

The app is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📈 Roadmap

See `TODO.md` for the complete implementation roadmap:
- **Phase 1**: ✅ Project Setup & Basic Structure
- **Phase 2**: Data Structure & Types
- **Phase 3**: Basic Flashcard Component
- **Phase 4**: Study Mode Implementation
- **Phase 5**: Quiz Mode Implementation
- **Phase 6**: Progress Tracking & Statistics
- **Phase 7**: UI/UX Polish
- **Phase 8**: Advanced Features
- **Phase 9**: Testing & Quality Assurance
- **Phase 10**: Deployment & Launch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a learning course and is for educational purposes.

---

**Built with ❤️ for Portuguese language learners**


