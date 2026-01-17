import { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Sidebar, UserDashboard, AdminDashboard, SettlementDashboard } from '@/app/components/mui';
import { CURRENT_USER } from '@/app/data/mockData';
import { UserRole } from '@/app/types/society';
import { colors } from '@/app/components/mui/theme';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

export default function App() {
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [activeView, setActiveView] = useState('user');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role });
    // Set default view based on role
    if (role === 'resident') {
      setActiveView('user');
    } else if (role === 'admin') {
      setActiveView('user');
    } else if (role === 'accountant') {
      setActiveView('user');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: colors.gradients.primary,
            boxShadow: 2,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <BusinessIcon sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Jana Jeeva Orchid
            </Typography>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha('#fff', 0.2),
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </Toolbar>
        </AppBar>
      )}

      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onRoleChange={handleRoleChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          marginLeft: { xs: 0, md: `${drawerWidth}px` },
          p: { xs: 2, md: 3 },
          pt: { xs: 10, md: 3 }, // Extra top padding on mobile for AppBar
          transition: (theme) =>
            theme.transitions.create('margin-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          minHeight: '100vh',
        }}
      >
        {activeView === 'user' && <UserDashboard currentUser={currentUser} />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'settlement' && <SettlementDashboard />}
      </Box>
    </Box>
  );
}
