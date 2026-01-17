import { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Avatar,
  alpha,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as UsersIcon,
  Warning as AlertTriangleIcon,
  Notifications as BellIcon,
  Upload as UploadIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircle2Icon,
  Schedule as ClockIcon,
  Cancel as XCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Wallet as WalletIcon,
  PieChart as PieChartIconMui,
  Store as StoreIcon,
  AccountBalance as LandmarkIcon,
  Business as Building2Icon,
} from '@mui/icons-material';
import {
  BarChart,
  LineChart,
  PieChart,
} from '@mui/x-charts';
import {
  MAINTENANCE_TRANSACTIONS,
  MEMBER_EXPENSES,
  VENDOR_BILLS,
  MONTHLY_STATS,
  OTHER_REVENUE_TRANSACTIONS,
  VENDOR_REVENUE_TRANSACTIONS,
} from '@/app/data/mockData';
import { colors } from './theme';

const ITEMS_PER_PAGE = 12;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { label: string; icon?: React.ReactNode; color?: string };
  action?: React.ReactNode;
  variant?: 'default' | 'primary' | 'dark';
}

function StatCard({ title, value, icon, trend, action, variant = 'default' }: StatCardProps) {
  const isPrimary = variant === 'primary';
  const isDark = variant === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        background: isPrimary ? colors.gradients.primary : isDark ? colors.gradients.dark : 'white',
        color: isPrimary || isDark ? 'white' : 'inherit',
        border: isPrimary || isDark ? 'none' : undefined,
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: isPrimary ? alpha('#fff', 0.8) : isDark ? alpha('#fff', 0.7) : 'text.secondary', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>{value}</Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40, bgcolor: isPrimary || isDark ? alpha('#fff', 0.2) : alpha(colors.primary, 0.1), color: isPrimary || isDark ? 'white' : colors.primary }}>
            {icon}
          </Avatar>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            {trend.icon}
            <Typography variant="caption" sx={{ color: trend.color || 'inherit' }}>{trend.label}</Typography>
          </Box>
        )}
        {action && <Box sx={{ mt: 2 }}>{action}</Box>}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [expensesPage, setExpensesPage] = useState(1);
  const [maintenancePage, setMaintenancePage] = useState(1);
  const [otherRevenuePage, setOtherRevenuePage] = useState(1);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [distributionPeriod, setDistributionPeriod] = useState<'month' | 'year'>('month');
  const [collectionSubTab, setCollectionSubTab] = useState(0);

  // Current month stats
  const currentStats = MONTHLY_STATS[0];

  // Collection status by flat (Maintenance)
  const collectionStatus = MAINTENANCE_TRANSACTIONS.filter(
    (txn) => new Date(txn.dueDate).getMonth() === 0 && new Date(txn.dueDate).getFullYear() === 2026
  );

  // Other Revenue (Vendor + Other) - Current Month
  const currentVendorRevenue = VENDOR_REVENUE_TRANSACTIONS.filter(
    (txn) => new Date(txn.date).getMonth() === 0 && new Date(txn.date).getFullYear() === 2026
  );

  const currentOtherRevenue = OTHER_REVENUE_TRANSACTIONS.filter(
    (txn) => new Date(txn.date).getMonth() === 0 && new Date(txn.date).getFullYear() === 2026
  );

  // Totals
  const totalMaintenance = collectionStatus.reduce((sum, txn) => (txn.status === 'paid' ? sum + txn.amount : sum), 0);
  const totalVendor = currentVendorRevenue.reduce((sum, txn) => (txn.status === 'paid' ? sum + txn.amount : sum), 0);
  const totalMisc = currentOtherRevenue.reduce((sum, txn) => (txn.status === 'paid' ? sum + txn.amount : sum), 0);
  const totalIncome = totalMaintenance + totalVendor + totalMisc;

  // Income Distribution Data
  const incomeDistribution = [
    { name: 'Maintenance', value: totalMaintenance, color: '#0066CC' },
    { name: 'Vendor/Stalls', value: totalVendor, color: '#00C9A7' },
    { name: 'Events/Other', value: totalMisc, color: '#FFB84D' },
  ].filter((d) => d.value > 0);

  // Overdue and pending flats
  const overdueFlats = collectionStatus.filter((txn) => txn.status === 'overdue');
  const pendingFlats = collectionStatus.filter((txn) => txn.status === 'pending');

  // Filtered Monthly Stats based on selected year
  const filteredMonthlyStats = MONTHLY_STATS.filter((stat) => stat.month.startsWith(selectedYear));

  // Collection trend data
  const collectionTrend = filteredMonthlyStats.length > 0
    ? filteredMonthlyStats.map((stat) => ({
        month: new Date(stat.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        collection: stat.totalCollection / 1000,
        expenses: stat.totalExpenses / 1000,
      })).reverse()
    : [{ month: 'Jan', collection: 0, expenses: 0 }];

  // All expenses
  const allExpenses = [
    ...MEMBER_EXPENSES.map((e) => ({ ...e, type: 'member' as const })),
    ...VENDOR_BILLS.map((b) => ({ ...b, type: 'vendor' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter expenses for distribution
  const filteredExpensesForDistribution = allExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    if (distributionPeriod === 'year') {
      return expenseDate.getFullYear().toString() === selectedYear;
    }
    return expenseDate.getFullYear().toString() === selectedYear && expenseDate.getMonth() === 0;
  });

  // Expenses by category
  const expenseCategoryMap = filteredExpensesForDistribution.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expensesByCategoryData = Object.entries(expenseCategoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#0066CC', '#00C9A7', '#FFB84D', '#FF5B5B', '#8884d8', '#82ca9d'];

  // Combined Other Revenue List
  const combinedOtherRevenue = [
    ...currentVendorRevenue.map((r) => ({
      id: r.transaction_id,
      source: 'Stall/Vendor',
      description: `Stall: ${r.vendor_name} (${r.stallNumber})`,
      amount: r.amount,
      date: r.date,
      status: r.status,
    })),
    ...currentOtherRevenue.map((r) => ({
      id: r.id,
      source: r.source,
      description: r.description,
      amount: r.amount,
      date: r.date,
      status: r.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'paid':
        return <Chip label="Paid" size="small" color="success" />;
      case 'pending':
        return <Chip label="Pending" size="small" color="warning" />;
      case 'overdue':
        return <Chip label="Overdue" size="small" color="error" />;
      case 'approved':
        return <Chip label="Approved" size="small" color="info" />;
      case 'settled':
        return <Chip label="Reimbursed" size="small" color="success" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ minHeight: '101vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="Society Manager" variant="outlined" size="small" />
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Typography variant="body2" color="text.secondary">January 2026</Typography>
        </Stack>
      </Box>

      {/* Quick Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <StatCard
          variant="primary"
          title="Total Income"
          value={`₹${totalIncome.toLocaleString()}`}
          icon={<WalletIcon />}
          trend={{
            label: totalIncome > MONTHLY_STATS[1].totalCollection ? 'Up from last month' : 'Down from last month',
            icon: <TrendingUpIcon sx={{ fontSize: 14 }} />,
          }}
        />
        <StatCard
          title="Total Expenses"
          value={`₹${currentStats.totalExpenses.toLocaleString()}`}
          icon={<FileTextIcon sx={{ color: 'warning.main' }} />}
          trend={{
            label: 'Exceeds collection',
            icon: <TrendingDownIcon sx={{ fontSize: 14, color: 'warning.main' }} />,
            color: 'warning.main',
          }}
        />
        <StatCard
          title="Pending Maintenance"
          value={pendingFlats.length}
          icon={<UsersIcon sx={{ color: colors.primary }} />}
          trend={{ label: `${pendingFlats.length} flats pending`, color: colors.primary }}
        />
        <StatCard
          variant="dark"
          title="Overdue Status"
          value=""
          icon={<BellIcon />}
          action={
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{ bgcolor: 'white', color: 'grey.900', '&:hover': { bgcolor: 'grey.100' } }}
              startIcon={<BellIcon />}
              onClick={() => setReminderDialogOpen(true)}
            >
              Send Reminders
            </Button>
          }
          trend={{
            label: '',
            icon: (
              <Chip
                label={`${overdueFlats.length} Overdue`}
                size="small"
                sx={{ bgcolor: 'white', color: 'error.main', fontWeight: 600 }}
              />
            ),
          }}
        />
      </Box>

      {/* Main Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Collection Status" />
            <Tab label="Expenses" />
            <Tab label="Insights" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        {/* Collection Status Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Revenue Insights & Breakdown */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3, mb: 4 }}>
              <Card>
                <CardHeader title="Income Source Distribution" subheader="Breakdown of all revenue sources" />
                <CardContent>
                  <Box sx={{ height: 200, width: '100%' }}>
                    <PieChart
                      series={[
                        {
                          data: incomeDistribution.map((item, index) => ({
                            id: index,
                            value: item.value,
                            label: item.name,
                            color: item.color,
                          })),
                          innerRadius: 60,
                          outerRadius: 80,
                          paddingAngle: 5,
                          cornerRadius: 4,
                          valueFormatter: (value) => `₹${value.value.toLocaleString()}`,
                        },
                      ]}
                      height={200}
                    />
                  </Box>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Maintenance</Typography>
                      <Typography variant="body2" fontWeight={600}>₹{totalMaintenance.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Other Sources</Typography>
                      <Typography variant="body2" fontWeight={600}>₹{(totalVendor + totalMisc).toLocaleString()}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Card>
                  <CardHeader
                    title={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Building2Icon fontSize="small" sx={{ color: colors.primary }} />
                        <Typography variant="subtitle1">Maintenance Collection</Typography>
                      </Stack>
                    }
                  />
                  <CardContent>
                    <Typography variant="h4" fontWeight={700}>₹{totalMaintenance.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      From {collectionStatus.filter((t) => t.status === 'paid').length} residents
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(collectionStatus.filter((t) => t.status === 'paid').length / collectionStatus.length) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {collectionStatus.filter((t) => t.status === 'paid').length} Paid
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {collectionStatus.length} Total
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StoreIcon fontSize="small" sx={{ color: colors.success }} />
                        <Typography variant="subtitle1">Other Revenue</Typography>
                      </Stack>
                    }
                  />
                  <CardContent>
                    <Typography variant="h4" fontWeight={700}>₹{(totalVendor + totalMisc).toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">Stalls, Ads, Events, etc.</Typography>
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {combinedOtherRevenue.slice(0, 3).map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>{item.source}</Typography>
                          <Typography variant="caption" fontWeight={600}>₹{item.amount.toLocaleString()}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ gridColumn: 'span 2' }}>
                  <CardHeader title="Revenue Trend Analysis" />
                  <CardContent sx={{ height: 150 }}>
                    <BarChart
                      xAxis={[
                        {
                          data: collectionTrend.map((d) => d.month),
                          scaleType: 'band',
                        },
                      ]}
                      series={[
                        {
                          data: collectionTrend.map((d) => d.collection),
                          color: colors.primary,
                          valueFormatter: (v) => `₹${((v || 0) * 1000).toLocaleString()}`,
                        },
                      ]}
                      height={150}
                      grid={{ horizontal: true }}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      leftAxis={null}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Sub Tabs for Maintenance vs Other Revenue */}
            <Tabs value={collectionSubTab} onChange={(_, v) => setCollectionSubTab(v)} sx={{ mb: 2 }}>
              <Tab label="Maintenance" />
              <Tab label="Other Revenue" />
            </Tabs>

            {collectionSubTab === 0 && (
              <Card>
                <CardHeader
                  title="Maintenance Status"
                  subheader="Payment status for residents"
                  action={<Button size="small">View All</Button>}
                />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Flat</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {collectionStatus.slice((maintenancePage - 1) * ITEMS_PER_PAGE, maintenancePage * ITEMS_PER_PAGE).map((txn) => (
                          <TableRow key={txn.transaction_id}>
                            <TableCell><Typography variant="caption" fontFamily="monospace">{txn.transaction_id}</Typography></TableCell>
                            <TableCell><Typography fontWeight={500}>{txn.flat_no}</Typography></TableCell>
                            <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                            <TableCell>{new Date(txn.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusChip(txn.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ChevronLeftIcon />}
                      disabled={maintenancePage === 1}
                      onClick={() => setMaintenancePage(maintenancePage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ChevronRightIcon />}
                      disabled={maintenancePage * ITEMS_PER_PAGE >= collectionStatus.length}
                      onClick={() => setMaintenancePage(maintenancePage + 1)}
                    >
                      Next
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {collectionSubTab === 1 && (
              <Card>
                <CardHeader
                  title="Other Revenue Streams"
                  subheader="Income from stalls, events, ads"
                  action={<Button size="small">View All</Button>}
                />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {combinedOtherRevenue.length > 0 ? (
                          combinedOtherRevenue.slice((otherRevenuePage - 1) * ITEMS_PER_PAGE, otherRevenuePage * ITEMS_PER_PAGE).map((txn) => (
                            <TableRow key={txn.id}>
                              <TableCell><Typography variant="caption" fontFamily="monospace">{txn.id}</Typography></TableCell>
                              <TableCell><Chip label={txn.source} size="small" variant="outlined" /></TableCell>
                              <TableCell><Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{txn.description}</Typography></TableCell>
                              <TableCell><Typography fontWeight={600}>₹{txn.amount.toLocaleString()}</Typography></TableCell>
                              <TableCell>{txn.date ? new Date(txn.date).toLocaleDateString() : '-'}</TableCell>
                              <TableCell>{getStatusChip(txn.status)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                              <Typography color="text.secondary">No other revenue this month</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Box>
        </TabPanel>

        {/* Expenses Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {/* Expenses Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                    <Typography variant="h5" fontWeight={700}>₹{currentStats.totalExpenses.toLocaleString()}</Typography>
                    <Typography variant="caption" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <AlertTriangleIcon fontSize="inherit" /> Exceeds monthly budget
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#E53E3E', 0.1) }}><TrendingDownIcon sx={{ color: 'error.main' }} /></Avatar>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pending Approvals</Typography>
                    <Typography variant="h5" fontWeight={700}>{allExpenses.filter((e) => e.status === 'pending').length}</Typography>
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>Requires immediate attention</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#FFB84D', 0.1) }}><ClockIcon sx={{ color: 'warning.main' }} /></Avatar>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Settled / Reimbursed</Typography>
                    <Typography variant="h5" fontWeight={700}>₹{allExpenses.filter((e) => e.status === 'settled').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</Typography>
                    <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                      {allExpenses.filter((e) => e.status === 'settled').length} transactions completed
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#00C9A7', 0.1) }}><CheckCircle2Icon sx={{ color: 'success.main' }} /></Avatar>
                </CardContent>
              </Card>
            </Box>

            {/* Expense Management Table */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Expense Management"
                subheader="Track and manage all society expenses"
                action={
                  <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setUploadDialogOpen(true)}>
                    Upload Bill
                  </Button>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Name/Vendor</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allExpenses.slice((expensesPage - 1) * ITEMS_PER_PAGE, expensesPage * ITEMS_PER_PAGE).map((expense) => (
                        <TableRow key={'expense_id' in expense ? expense.expense_id : expense.bill_id}>
                          <TableCell><Typography variant="caption" fontFamily="monospace">{'expense_id' in expense ? expense.expense_id : expense.bill_id}</Typography></TableCell>
                          <TableCell><Chip label={expense.type === 'member' ? 'Member' : 'Vendor'} size="small" variant="outlined" /></TableCell>
                          <TableCell>{'member_name' in expense ? expense.member_name : expense.vendor_name}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell><Typography fontWeight={600}>₹{expense.amount.toLocaleString()}</Typography></TableCell>
                          <TableCell>{getStatusChip(expense.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined" size="small" startIcon={<ChevronLeftIcon />} disabled={expensesPage === 1} onClick={() => setExpensesPage(expensesPage - 1)}>Previous</Button>
                  <Button variant="outlined" size="small" endIcon={<ChevronRightIcon />} disabled={expensesPage * ITEMS_PER_PAGE >= allExpenses.length} onClick={() => setExpensesPage(expensesPage + 1)}>Next</Button>
                </Box>
              </CardContent>
            </Card>

            {/* Expenses by Category Chart */}
            <Card>
              <CardHeader title="Expenses by Category" subheader="Breakdown of current month expenses" />
              <CardContent>
                <Box sx={{ height: 300, width: '100%' }}>
                  <BarChart
                    xAxis={[
                      {
                        data: expensesByCategoryData.map((d) => d.name),
                        scaleType: 'band',
                      },
                    ]}
                    series={[
                      {
                        data: expensesByCategoryData.map((d) => d.value),
                        color: colors.primary,
                        valueFormatter: (v) => `₹${(v || 0).toLocaleString()}`,
                      },
                    ]}
                    height={300}
                    grid={{ horizontal: true }}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Insights Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" fontWeight={500}>Fiscal Year:</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Typography variant="body2" color="text.secondary">Showing data for {selectedYear}</Typography>
            </Box>

            <Stack spacing={3}>
              {/* Financial Health Trends */}
              <Card>
                <CardHeader title={`Financial Health Trends (${selectedYear})`} subheader="Income vs Expense Comparison" />
                <CardContent>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <LineChart
                      xAxis={[
                        {
                          data: collectionTrend.map((_, index) => index),
                          scaleType: 'point',
                          valueFormatter: (index) => collectionTrend[index]?.month || '',
                        },
                      ]}
                      series={[
                        {
                          data: collectionTrend.map((d) => d.collection),
                          label: 'Income',
                          color: '#0066CC',
                          area: true,
                          showMark: true,
                          valueFormatter: (v) => `₹${((v || 0) * 1000).toLocaleString()}`,
                        },
                        {
                          data: collectionTrend.map((d) => d.expenses),
                          label: 'Expenses',
                          color: '#E53E3E',
                          area: true,
                          showMark: true,
                          valueFormatter: (v) => `₹${((v || 0) * 1000).toLocaleString()}`,
                        },
                      ]}
                      height={300}
                      grid={{ horizontal: true }}
                      sx={{
                        '& .MuiAreaElement-series-0': { fill: 'url(#incomeGradient)' },
                        '& .MuiAreaElement-series-1': { fill: 'url(#expenseGradient)' },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Expense Distribution */}
              <Card>
                <CardHeader
                  title="Expense Distribution"
                  subheader="Breakdown by Category"
                  action={
                    <ToggleButtonGroup
                      size="small"
                      value={distributionPeriod}
                      exclusive
                      onChange={(_, v) => v && setDistributionPeriod(v)}
                    >
                      <ToggleButton value="month">Current Month</ToggleButton>
                      <ToggleButton value="year">Full Year</ToggleButton>
                    </ToggleButtonGroup>
                  }
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ height: 300, flex: 1 }}>
                      <PieChart
                        series={[
                          {
                            data: expensesByCategoryData.map((item, index) => ({
                              id: index,
                              value: item.value,
                              label: item.name,
                              color: COLORS[index % COLORS.length],
                            })),
                            innerRadius: 80,
                            outerRadius: 100,
                            paddingAngle: 2,
                            cornerRadius: 4,
                            valueFormatter: (value) => `₹${value.value.toLocaleString()}`,
                          },
                        ]}
                        height={300}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                      />
                    </Box>
                    <Stack spacing={2} sx={{ flex: 1 }}>
                      {expensesByCategoryData.length > 0 ? (
                        expensesByCategoryData.map((item, index) => (
                          <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'grey.50' } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                              <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                            </Stack>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" fontWeight={600}>₹{item.value.toLocaleString()}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {((item.value / expensesByCategoryData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                          No expense data available for this period
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Card>
              <CardHeader title="Monthly Summary" subheader="Income vs Expense comparison (January 2026)" />
              <CardContent>
                <Stack spacing={2}>
                  {[
                    { label: 'Total Collection (Maintenance)', value: currentStats.totalCollection, color: 'success.main', prefix: '₹' },
                    { label: 'Vendor Revenue (Stalls)', value: 35000, color: 'success.main', prefix: '₹' },
                    { label: 'Total Revenue', value: currentStats.totalCollection + 35000, color: 'success.main', prefix: '₹', bold: true },
                    { label: 'Total Expenses', value: currentStats.totalExpenses, color: 'error.main', prefix: '₹' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" fontWeight={item.bold ? 600 : 400}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight={600} color={item.color}>
                        {item.prefix}{item.value.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Typography variant="h6" fontWeight={600}>Net Balance</Typography>
                    <Typography variant="h6" fontWeight={700} color={currentStats.netBalance >= 0 ? 'success.main' : 'error.main'}>
                      ₹{Math.abs(currentStats.netBalance + 35000).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>

      {/* Upload Bill Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Vendor Bill</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Submit a new expense bill for approval
          </Typography>
          <Stack spacing={2.5}>
            <TextField label="Vendor Name" fullWidth size="small" />
            <TextField label="Amount" type="number" fullWidth size="small" />
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select label="Category">
                <MenuItem value="electricity">Electricity</MenuItem>
                <MenuItem value="water">Water</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Description" multiline rows={3} fullWidth size="small" />
            <TextField type="file" fullWidth size="small" />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Account Number" fullWidth size="small" />
              <TextField label="IFSC Code" fullWidth size="small" />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setUploadDialogOpen(false)}>Submit Bill</Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onClose={() => setReminderDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Payment Reminders</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Send reminders to {pendingFlats.length + overdueFlats.length} flats with pending or overdue payments
          </Typography>
          <Typography variant="subtitle2" gutterBottom>Recipients</Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', mb: 2, p: 1 }}>
            {[...pendingFlats, ...overdueFlats].map((txn) => (
              <Box key={txn.transaction_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant="body2">{txn.flat_no}</Typography>
                <Chip label={txn.status} size="small" color={txn.status === 'overdue' ? 'error' : 'warning'} />
              </Box>
            ))}
          </Paper>
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            defaultValue="Dear Resident, This is a friendly reminder that your maintenance payment is pending. Please clear your dues at the earliest to avoid penalties."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<BellIcon />} onClick={() => setReminderDialogOpen(false)}>
            Send Reminders
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
