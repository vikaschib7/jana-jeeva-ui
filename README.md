# Jana Jeeva Orchid - Society Portal

A modern society management dashboard for Jana Jeeva Orchid residential community. Built with React, TypeScript, and Material UI.

## Features

- **Resident Dashboard** - View maintenance dues, payment history, and personal account status
- **Admin Panel** - Manage collections, track expenses, view financial insights
- **Accounts Dashboard** - Settlement management and financial reporting
- **Role-based Access** - Different views for residents, admins, and accountants

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material UI (MUI)** - Component library
- **MUI X Charts** - Data visualization
- **Firebase Hosting** - Free tier hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Hosting Deployment

### One-time Setup

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in the project**:
   ```bash
   firebase init hosting
   ```
   
   When prompted:
   - Select **"Use an existing project"** or **"Create a new project"**
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub: `No` (optional)
   - Overwrite dist/index.html: `No`

### Deploy to Firebase

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Useful Firebase Commands

```bash
# Deploy only hosting (faster)
firebase deploy --only hosting

# Preview before deploying
firebase hosting:channel:deploy preview

# View deployment history
firebase hosting:sites:list
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app component
│   ├── components/
│   │   └── mui/
│   │       ├── AdminDashboard.tsx
│   │       ├── UserDashboard.tsx
│   │       ├── SettlementDashboard.tsx
│   │       ├── Sidebar.tsx
│   │       ├── theme.ts
│   │       └── ThemeProvider.tsx
│   ├── data/
│   │   └── mockData.ts      # Sample data
│   └── types/
│       └── society.ts       # TypeScript types
├── styles/
│   ├── fonts.css
│   └── index.css
└── main.tsx                 # App entry point
```

## License

Private - Jana Jeeva Orchid Society
