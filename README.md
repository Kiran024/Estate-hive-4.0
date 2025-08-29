# Estate Hive - Premium Real Estate Platform 🏡

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 🚀 Overview

Estate Hive is a cutting-edge real estate platform that revolutionizes property discovery and management. Built with modern web technologies, it offers an exclusive marketplace for verified properties with advanced features like AI-powered search, interactive maps, and comprehensive authentication systems.

### ✨ Key Features

- **🔐 Advanced Authentication System**
  - Secure login/signup with Supabase Auth
  - Protected routes with glassmorphism overlays
  - Role-based access control
  - Session management

- **🏠 Property Management**
  - EH Verified™ exclusive properties
  - Advanced filtering and search
  - Real-time property updates
  - Interactive property galleries

- **🗺️ Interactive Maps**
  - Mapbox integration for property visualization
  - Location-based search
  - Neighborhood insights
  - GeoHeat™ tracking

- **💎 Premium UI/UX**
  - Glassmorphism effects
  - Smooth animations with Framer Motion
  - Responsive design
  - Dark mode support

- **📊 Smart Features**
  - AI Agent Ecosystem
  - Smart Match Engine
  - Property analytics
  - Virtual tours

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router v6** - Routing
- **React Query** - Data fetching

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage
- **Mapbox GL** - Interactive maps
- **Lucide React** - Icon library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/maverickprofile/estatehive-frontend.git
cd estatehive-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration
VITE_MAPBOX_TOKEN=your_mapbox_token

# Optional: API Endpoints
VITE_API_URL=http://localhost:3000
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📁 Project Structure

```
estate-hive/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoginPromptOverlay.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   └── PropertyCardPlaceholder.jsx
│   │   ├── common/            # Shared components
│   │   │   ├── navbar.jsx
│   │   │   └── footer.jsx
│   │   ├── home/              # Homepage components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── VerifiedExclusives.jsx
│   │   │   └── RealEstateEcosystem.jsx
│   │   ├── properties/        # Property components
│   │   ├── services/          # Service pages
│   │   └── technologies/      # Technology pages
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   ├── AllPropertiesEnhanced.jsx
│   │   └── PropertyDetailsEnhanced.jsx
│   ├── services/              # API services
│   │   ├── authService.js
│   │   └── propertyService.js
│   ├── types/                 # TypeScript types
│   ├── util/                  # Utility functions
│   └── App.jsx               # Main app component
├── public/                    # Static assets
├── package.json
└── vite.config.js
```

## 🔒 Authentication Flow

The application implements a comprehensive authentication system:

1. **Public Access**: Limited property viewing (6 cards for "For Sale" category)
2. **Authentication Required**: 
   - Full property details
   - All properties listing
   - Rent, Luxury Rentals, and EH Signature™ categories
3. **Protected Routes**: Automatic redirection to login with return URL preservation
4. **Session Management**: Persistent login with token refresh

## 🎨 UI Components

### Key Components

- **LoginPromptOverlay**: Glassmorphism overlay for protected content
- **AuthModal**: Quick login/signup modal
- **PropertyCardPlaceholder**: Elegant placeholders for locked content
- **ProtectedRoute**: Route wrapper for authentication checks

### Design System

- **Colors**: Indigo-600 primary, Purple-600 accent
- **Typography**: System fonts with responsive sizing
- **Animations**: Framer Motion for smooth transitions
- **Effects**: Glassmorphism, backdrop blur, gradient overlays

## 🚦 Available Scripts

```bash
# Development
npm run dev           # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests (if configured)
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+ (with iOS fixes)
- Edge 90+

## 📱 Mobile Responsiveness

- Fully responsive design
- Touch-optimized interactions
- PWA-ready
- iOS Safari compatibility fixes

## 🔧 Configuration

### Supabase Setup
1. Create a Supabase project
2. Set up authentication providers
3. Configure database tables
4. Enable Row Level Security (RLS)

### Mapbox Setup
1. Create a Mapbox account
2. Generate access token
3. Configure map styles

## 🤝 Contributing

This is a private repository. Please contact the repository owner for contribution guidelines.

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Team

- **Development**: SIMS INFOTECH Team
- **Design**: Estate Hive Design Team
- **Project Management**: Estate Hive Team

## 📞 Support

For support and inquiries:
- Email: support@estatehive.com
- Documentation: [Internal Docs]
- Issues: [GitHub Issues]

## 🔄 Recent Updates

### Version 2.0.0 (Latest)
- ✅ Complete authentication system implementation
- ✅ Protected routes with glassmorphism overlays
- ✅ Category-based access control
- ✅ Safari/iOS compatibility fixes
- ✅ Enhanced property listing features
- ✅ Real-time updates with Supabase

### Version 1.5.0
- Added Mapbox integration
- Improved property search
- Enhanced UI/UX

---

**Estate Hive** - *Exclusive. Curated. Personalized.*

© 2025 Estate Hive. All rights reserved.