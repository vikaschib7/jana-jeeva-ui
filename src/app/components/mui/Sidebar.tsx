import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { User, UserRole } from '@/app/types/society';
import { colors } from './theme';

interface SidebarProps {
  currentUser: User;
  activeView: string;
  onViewChange: (view: string) => void;
  onRoleChange: (role: UserRole) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

const navigationItems = [
  {
    id: 'user',
    label: 'My Dashboard',
    icon: HomeIcon,
    roles: ['resident', 'admin', 'accountant'] as UserRole[],
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: BusinessIcon,
    roles: ['admin', 'accountant'] as UserRole[],
  },
  {
    id: 'settlement',
    label: 'Accounts',
    icon: AccountBalanceIcon,
    roles: ['accountant'] as UserRole[],
  },
];

const roleOptions = [
  { role: 'resident' as UserRole, label: 'Resident View', emoji: '👤' },
  { role: 'admin' as UserRole, label: 'Admin View', emoji: '👨‍💼' },
  { role: 'accountant' as UserRole, label: 'Accountant View', emoji: '💰' },
];

export function Sidebar({
  currentUser,
  activeView,
  onViewChange,
  onRoleChange,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const theme = useTheme();
  const availableNavItems = navigationItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: colors.gradients.primary,
          border: 'none',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Collapse Toggle Button */}
      <IconButton
        onClick={onToggleCollapse}
        sx={{
          position: 'absolute',
          right: -12,
          top: 24,
          width: 24,
          height: 24,
          backgroundColor: 'white',
          color: colors.primary,
          boxShadow: 2,
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
        size="small"
      >
        {isCollapsed ? (
          <ChevronRightIcon fontSize="small" />
        ) : (
          <ChevronLeftIcon fontSize="small" />
        )}
      </IconButton>

      {/* Logo / Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
        >
          <BusinessIcon sx={{ fontSize: 32, color: 'white' }} />
          {!isCollapsed && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Society Portal
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha('#fff', 0.7),
                }}
              >
                Management System
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* User Info Card */}
      {!isCollapsed ? (
        <Box
          sx={{
            mx: 2,
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha('#fff', 0.1),
            border: `1px solid ${alpha('#fff', 0.2)}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: alpha('#fff', 0.2),
                color: 'white',
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentUser.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: alpha('#fff', 0.7) }}
              >
                Flat {currentUser.flatNo}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 1.5, borderColor: alpha('#fff', 0.2) }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
              Role
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {currentUser.role}
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: alpha('#fff', 0.2),
              color: 'white',
            }}
          >
            <PersonIcon />
          </Avatar>
        </Box>
      )}

      {/* Navigation */}
      <List sx={{ px: 2, flex: 1 }}>
        {availableNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => onViewChange(item.id)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: isCollapsed ? 2 : 2,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? colors.primary : 'white',
                    '&:hover': {
                      backgroundColor: isActive ? 'white' : alpha('#fff', 0.1),
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: alpha('#fff', 0.95),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 40,
                      color: isActive ? colors.primary : 'white',
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Demo: Role Switcher */}
      {!isCollapsed && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 2, borderColor: alpha('#fff', 0.2) }} />
          <Typography
            variant="caption"
            sx={{ color: alpha('#fff', 0.7), mb: 1, display: 'block' }}
          >
            Switch Role (Demo)
          </Typography>
          <Stack spacing={0.5}>
            {roleOptions.map((option) => (
              <ListItemButton
                key={option.role}
                onClick={() => onRoleChange(option.role)}
                sx={{
                  borderRadius: 1.5,
                  py: 0.75,
                  px: 1.5,
                  color: 'white',
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.1),
                  },
                }}
              >
                <Typography variant="caption">
                  {option.emoji} {option.label}
                </Typography>
              </ListItemButton>
            ))}
          </Stack>
        </Box>
      )}

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
          <ListItemButton
            sx={{
              borderRadius: 2,
              py: 1.25,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#fff', 0.1),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: isCollapsed ? 0 : 40,
                color: 'white',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
