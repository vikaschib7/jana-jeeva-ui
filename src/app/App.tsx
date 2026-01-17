import { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar, UserDashboard, AdminDashboard, SettlementDashboard } from '@/app/components/mui';
import { CURRENT_USER } from '@/app/data/mockData';
import { UserRole } from '@/app/types/society';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

export default function App() {
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [activeView, setActiveView] = useState('user');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const drawerWidth = sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onRoleChange={handleRoleChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
          p: 3,
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
