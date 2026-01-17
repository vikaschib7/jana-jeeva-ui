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

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

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
