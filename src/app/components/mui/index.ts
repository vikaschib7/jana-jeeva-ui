// MUI Theme & Provider
export { societyTheme, colors } from './theme';
export { ThemeProvider } from './ThemeProvider';

// Custom MUI Components
export { Sidebar } from './Sidebar';
export { UserDashboard } from './UserDashboard';
export { AdminDashboard } from './AdminDashboard';
export { SettlementDashboard } from './SettlementDashboard';

// Re-export commonly used MUI components for convenience
export {
  // Layout
  Box,
  Container,
  Grid,
  Stack,
  Paper,
  Divider,
  
  // Navigation
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  
  // Inputs
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Autocomplete,
  
  // Data Display
  Typography,
  Avatar,
  Badge,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  
  // Feedback
  Alert,
  AlertTitle,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Backdrop,
  
  // Surfaces
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  
  // Navigation Components
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Menu,
  
  // Utils
  Collapse,
  Fade,
  Grow,
  Slide,
  Zoom,
} from '@mui/material';

// Re-export MUI X components
export { DataGrid, GridToolbar } from '@mui/x-data-grid';
export type { GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';

export { DatePicker } from '@mui/x-date-pickers/DatePicker';
export { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
export { TimePicker } from '@mui/x-date-pickers/TimePicker';
