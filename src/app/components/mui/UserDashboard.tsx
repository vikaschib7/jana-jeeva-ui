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
  Pagination,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarIcon,
  Wallet as WalletIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Description as FileTextIcon,
} from '@mui/icons-material';
import {
  PieChart,
  LineChart,
  BarChart,
} from '@mui/x-charts';
import { USER_PAYMENT_HISTORY, MEMBER_EXPENSES } from '@/app/data/mockData';
import { User } from '@/app/types/society';
import { colors } from './theme';

const ITEMS_PER_PAGE = 12;

interface UserDashboardProps {
  currentUser: User;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    label: string;
    icon?: React.ReactNode;
    color?: string;
  };
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
        background: isPrimary
          ? colors.gradients.primary
          : isDark
          ? colors.gradients.dark
          : 'white',
        color: isPrimary || isDark ? 'white' : 'inherit',
        border: isPrimary || isDark ? 'none' : undefined,
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: isPrimary ? alpha('#fff', 0.8) : isDark ? alpha('#fff', 0.7) : 'text.secondary',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: isPrimary || isDark ? alpha('#fff', 0.2) : alpha(colors.primary, 0.1),
              color: isPrimary || isDark ? 'white' : colors.primary,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            {trend.icon}
            <Typography variant="caption" sx={{ color: trend.color || 'inherit' }}>
              {trend.label}
            </Typography>
          </Box>
        )}
        {action && <Box sx={{ mt: 2 }}>{action}</Box>}
      </CardContent>
    </Card>
  );
}

export function UserDashboard({ currentUser }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [filterYear, setFilterYear] = useState('2026');
  const [insightsYear, setInsightsYear] = useState('2026');
  const [currentPage, setCurrentPage] = useState(1);
  const [expenseYear, setExpenseYear] = useState('2026');
  const [expenseMonth, setExpenseMonth] = useState('01');

  // Filter payment history by year
  const filteredHistory =
    filterYear === 'all'
      ? USER_PAYMENT_HISTORY
      : USER_PAYMENT_HISTORY.filter(
          (txn) => new Date(txn.dueDate).getFullYear().toString() === filterYear
        );

  // Current month maintenance
  const currentMaintenance = USER_PAYMENT_HISTORY[0];

  // Calculate total paid
  const totalPaid = filteredHistory.reduce((sum, txn) => sum + txn.amount, 0);

  // Breakdown data for pie chart
  const breakdownItems = [
    { key: 'waterCharges', label: 'Water Charges', color: '#00C9A7' },
    { key: 'infrastructure', label: 'Infrastructure', color: '#0066CC' },
    { key: 'electricity', label: 'Electricity', color: '#00A8E8' },
    { key: 'commonExpenses', label: 'Common Expenses', color: '#FFB84D' },
    { key: 'penalty', label: 'Penalty', color: '#E53E3E' },
  ];

  const breakdownData = currentMaintenance.breakdown
    ? breakdownItems
        .map((item) => ({
          name: item.label,
          value:
            currentMaintenance.breakdown?.[
              item.key as keyof typeof currentMaintenance.breakdown
            ] || 0,
          color: item.color,
        }))
        .filter((d) => d.value > 0)
    : [];

  // Filter insights data by year
  const insightsFilteredHistory =
    insightsYear === 'all'
      ? USER_PAYMENT_HISTORY
      : USER_PAYMENT_HISTORY.filter(
          (txn) => new Date(txn.dueDate).getFullYear().toString() === insightsYear
        );

  // Trend data for line chart
  const trendData = insightsFilteredHistory
    .map((txn) => ({
      month: new Date(txn.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      amount: txn.amount,
    }))
    .reverse();

  // Distribution data for stacked bar chart
  const distributionData = insightsFilteredHistory
    .map((txn) => ({
      month: new Date(txn.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      waterCharges: txn.breakdown?.waterCharges || 0,
      infrastructure: txn.breakdown?.infrastructure || 0,
      electricity: txn.breakdown?.electricity || 0,
      commonExpenses: txn.breakdown?.commonExpenses || 0,
      penalty: txn.breakdown?.penalty || 0,
    }))
    .reverse();

  // Comparison data
  const insightsTotalPaid = insightsFilteredHistory.reduce((sum, txn) => sum + txn.amount, 0);
  const comparisonData = [
    { category: 'Current Month', value: currentMaintenance.amount },
    { category: 'Average', value: insightsTotalPaid / (insightsFilteredHistory.length || 1) },
    { category: 'Highest', value: Math.max(...insightsFilteredHistory.map((t) => t.amount), 0) },
  ];

  // Aggregated breakdown for year
  const yearBreakdownTotals = insightsFilteredHistory.reduce(
    (acc, txn) => {
      if (!txn.breakdown) return acc;
      acc.waterCharges += txn.breakdown.waterCharges || 0;
      acc.infrastructure += txn.breakdown.infrastructure || 0;
      acc.electricity += txn.breakdown.electricity || 0;
      acc.commonExpenses += txn.breakdown.commonExpenses || 0;
      acc.penalty += txn.breakdown.penalty || 0;
      return acc;
    },
    { waterCharges: 0, infrastructure: 0, electricity: 0, commonExpenses: 0, penalty: 0 }
  );

  const yearBreakdownData = [
    { name: 'Water Charges', value: yearBreakdownTotals.waterCharges, color: '#00C9A7' },
    { name: 'Infrastructure', value: yearBreakdownTotals.infrastructure, color: '#0066CC' },
    { name: 'Electricity', value: yearBreakdownTotals.electricity, color: '#00A8E8' },
    { name: 'Common Expenses', value: yearBreakdownTotals.commonExpenses, color: '#FFB84D' },
    { name: 'Penalty', value: yearBreakdownTotals.penalty, color: '#E53E3E' },
  ].filter((d) => d.value > 0);

  // Filter My Expenses
  const filteredExpenses = MEMBER_EXPENSES.filter((exp) => {
    const expDate = new Date(exp.date);
    const matchesUser = exp.member_id === currentUser.id;
    const matchesYear = expenseYear === 'all' || expDate.getFullYear().toString() === expenseYear;
    const matchesMonth =
      expenseMonth === 'all' ||
      (expDate.getMonth() + 1).toString().padStart(2, '0') === expenseMonth;
    return matchesUser && matchesYear && matchesMonth;
  });

  // Calculate Expense Stats
  const totalClaimed = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalReimbursed = filteredExpenses
    .filter((exp) => exp.status === 'settled')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingAmount = filteredExpenses
    .filter((exp) => exp.status === 'pending')
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Expense Category Breakdown
  const expenseCategoryData = Object.entries(
    filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleYearChange = (year: string) => {
    setFilterYear(year);
    setCurrentPage(1);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

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
      case 'rejected':
        return <Chip label="Rejected" size="small" color="error" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ minHeight: '101vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome back, {currentUser.name.split(' ')[0]}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Flat ${currentUser.flatNo}`} variant="outlined" size="small" />
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            January 2026
          </Typography>
        </Stack>
      </Box>

      {/* Quick Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard
          variant="primary"
          title="Current Month"
          value={`₹${currentMaintenance.amount.toLocaleString()}`}
          icon={<WalletIcon />}
          trend={{
            label: currentMaintenance.status === 'paid' ? 'Paid' : `Due ${new Date(currentMaintenance.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            icon: currentMaintenance.status === 'paid' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ScheduleIcon sx={{ fontSize: 14 }} />,
          }}
        />
        <StatCard
          title="Total Paid (YTD)"
          value={`₹${totalPaid.toLocaleString()}`}
          icon={<ReceiptIcon sx={{ color: 'success.main' }} />}
          trend={{
            label: `${USER_PAYMENT_HISTORY.length} payments`,
            icon: <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />,
            color: 'success.main',
          }}
        />
        <StatCard
          title="Outstanding Penalty"
          value={`₹${currentMaintenance.penalty || 0}`}
          icon={
            currentMaintenance.penalty ? (
              <WarningIcon sx={{ color: 'error.main' }} />
            ) : (
              <CheckCircleIcon sx={{ color: 'success.main' }} />
            )
          }
          trend={
            currentMaintenance.penalty
              ? { label: 'Action Required', icon: <WarningIcon sx={{ fontSize: 14, color: 'error.main' }} />, color: 'error.main' }
              : { label: 'No penalties', color: 'success.main' }
          }
        />
        <StatCard
          variant="dark"
          title="Payment Status"
          value=""
          icon={<CalendarIcon />}
          action={
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{ bgcolor: 'white', color: 'grey.900', '&:hover': { bgcolor: 'grey.100' } }}
              startIcon={currentMaintenance.status === 'paid' ? <DownloadIcon /> : undefined}
            >
              {currentMaintenance.status === 'paid' ? 'Receipt' : 'Pay Now'}
            </Button>
          }
          trend={{
            label: '',
            icon: (
              <Chip
                label={currentMaintenance.status.toUpperCase()}
                size="small"
                sx={{ bgcolor: 'white', color: 'grey.900', fontWeight: 600 }}
              />
            ),
          }}
        />
      </Box>

      {/* Main Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Breakdown" />
            <Tab label="Payment History" />
            <Tab label="Insights" />
            {(currentUser.role === 'admin' || currentUser.role === 'accountant') && (
              <Tab label="My Expenses" />
            )}
          </Tabs>
        </Box>

        {/* Breakdown Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, p: 3 }}>
            <Card>
              <CardHeader title="Monthly Breakdown" subheader="Detailed breakdown of charges" />
              <CardContent>
                <Box sx={{ height: 250, width: '100%', minWidth: 300 }}>
                  {breakdownData.length > 0 && (
                    <PieChart
                      key={`breakdown-pie-${currentUser.role}`}
                      series={[
                        {
                          data: breakdownData.map((item, index) => ({
                            id: index,
                            value: item.value,
                            label: item.name,
                            color: item.color,
                          })),
                          innerRadius: 0,
                          outerRadius: 80,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                          arcLabel: (item) => `${((item.value / breakdownData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%`,
                          arcLabelMinAngle: 20,
                          valueFormatter: (value) => `₹${value.value.toLocaleString()}`,
                        },
                      ]}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      height={250}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Charge Details" subheader="Itemized charges for current month" />
              <CardContent>
                <Stack spacing={2}>
                  {breakdownData.map((item) => (
                    <Box
                      key={item.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{item.value.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 1,
                    }}
                  >
                    <Typography fontWeight={600}>Total Amount</Typography>
                    <Typography fontWeight={700} color="primary">
                      ₹{currentMaintenance.amount.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Payment History Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Card>
              <CardHeader
                title="Payment History"
                subheader="Complete record of maintenance payments"
                action={
                  <Stack direction="row" spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={filterYear}
                        label="Year"
                        onChange={(e) => handleYearChange(e.target.value)}
                      >
                        <MenuItem value="all">All Years</MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                      </Select>
                    </FormControl>
                    <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
                      Export
                    </Button>
                  </Stack>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Payment Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedHistory.map((txn) => (
                        <TableRow key={txn.transaction_id}>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {txn.transaction_id}
                            </Typography>
                          </TableCell>
                          <TableCell>{new Date(txn.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {txn.date ? new Date(txn.date).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600}>
                              ₹{txn.amount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{getStatusChip(txn.status)}</TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredHistory.length)} of{' '}
                      {filteredHistory.length} payments
                    </Typography>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Insights Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Payment Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze your payment patterns and trends
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={insightsYear}
                  label="Year"
                  onChange={(e) => setInsightsYear(e.target.value)}
                >
                  <MenuItem value="all">All Years</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Stack spacing={3}>
              {/* Payment Trends */}
              <Card>
                <CardHeader
                  title="Payment Trends"
                  subheader={`Your payment history over time (${insightsYear === 'all' ? 'All years' : insightsYear})`}
                />
                <CardContent>
                  <Box sx={{ height: 300, width: '100%', minWidth: 300 }}>
                    {trendData.length > 0 && (
                      <LineChart
                        key={`trend-line-${currentUser.role}-${insightsYear}`}
                        xAxis={[
                          {
                            data: trendData.map((_, index) => index),
                            scaleType: 'point',
                            valueFormatter: (index) => trendData[index]?.month || '',
                          },
                        ]}
                        series={[
                          {
                            data: trendData.map((d) => d.amount),
                            label: 'Amount',
                            color: colors.primary,
                            curve: 'linear',
                            showMark: true,
                            valueFormatter: (value) => `₹${value?.toLocaleString() || 0}`,
                          },
                        ]}
                        height={300}
                        grid={{ vertical: true, horizontal: true }}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Breakdown Distribution */}
              <Card>
                <CardHeader
                  title="Maintenance Breakdown Trends"
                  subheader={`Distribution of charges over time (${insightsYear === 'all' ? 'All years' : insightsYear})`}
                />
                <CardContent>
                  <Box sx={{ height: 300, width: '100%', minWidth: 300 }}>
                    {distributionData.length > 0 && (
                      <BarChart
                        key={`distribution-bar-${currentUser.role}-${insightsYear}`}
                        xAxis={[
                          {
                            data: distributionData.map((d) => d.month),
                            scaleType: 'band',
                          },
                        ]}
                        series={[
                          { data: distributionData.map((d) => d.waterCharges), label: 'Water Charges', stack: 'total', color: '#00C9A7', valueFormatter: (v) => `₹${v?.toLocaleString() || 0}` },
                          { data: distributionData.map((d) => d.infrastructure), label: 'Infrastructure', stack: 'total', color: '#0066CC', valueFormatter: (v) => `₹${v?.toLocaleString() || 0}` },
                          { data: distributionData.map((d) => d.electricity), label: 'Electricity', stack: 'total', color: '#00A8E8', valueFormatter: (v) => `₹${v?.toLocaleString() || 0}` },
                          { data: distributionData.map((d) => d.commonExpenses), label: 'Common Expenses', stack: 'total', color: '#FFB84D', valueFormatter: (v) => `₹${v?.toLocaleString() || 0}` },
                          { data: distributionData.map((d) => d.penalty), label: 'Penalty', stack: 'total', color: '#E53E3E', valueFormatter: (v) => `₹${v?.toLocaleString() || 0}` },
                        ]}
                        height={300}
                        grid={{ horizontal: true }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Payment Comparison & Quick Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                <Card>
                  <CardHeader
                    title="Annual Cost Distribution"
                    subheader={`Total expense breakdown for ${insightsYear === 'all' ? 'all years' : insightsYear}`}
                  />
                  <CardContent>
                    <Box sx={{ height: 250, width: '100%', minWidth: 300 }}>
                      {yearBreakdownData.length > 0 && (
                        <PieChart
                          key={`year-pie-${currentUser.role}-${insightsYear}`}
                          series={[
                            {
                              data: yearBreakdownData.map((item, index) => ({
                                id: index,
                                value: item.value,
                                label: item.name,
                                color: item.color,
                              })),
                              innerRadius: 0,
                              outerRadius: 80,
                              paddingAngle: 2,
                              cornerRadius: 4,
                              arcLabel: (item) => `${((item.value / yearBreakdownData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%`,
                              arcLabelMinAngle: 20,
                              valueFormatter: (value) => `₹${value.value.toLocaleString()}`,
                            },
                          ]}
                          height={250}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title="Quick Stats"
                    subheader={`Your payment overview (${insightsYear === 'all' ? 'All years' : insightsYear})`}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      {[
                        { label: 'Average Monthly Payment', value: `₹${Math.round(insightsTotalPaid / (insightsFilteredHistory.length || 1)).toLocaleString()}` },
                        { label: 'Total Payments Made', value: insightsFilteredHistory.length },
                        { label: 'On-Time Payments', value: insightsFilteredHistory.filter((t) => t.status === 'paid').length, color: 'success.main' },
                        { label: 'Late Payments', value: insightsFilteredHistory.filter((t) => t.status === 'overdue').length, color: 'warning.main' },
                      ].map((item) => (
                        <Box
                          key={item.label}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pb: 1.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color={item.color}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Reliability
                        </Typography>
                        <Chip label="Excellent" size="small" color="success" />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        {/* My Expenses Tab */}
        {(currentUser.role === 'admin' || currentUser.role === 'accountant') && (
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ p: 3 }}>
              {/* Expense Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                <Card>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Paid
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        ₹{totalClaimed.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expenseMonth === 'all'
                          ? `Year ${expenseYear}`
                          : `${months.find((m) => m.value === expenseMonth)?.label} ${expenseYear}`}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}>
                      <MoneyIcon />
                    </Avatar>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Reimbursed
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        ₹{totalReimbursed.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha('#00C9A7', 0.1), color: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Pending Approval
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="warning.main">
                        ₹{pendingAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha('#FFB84D', 0.1), color: 'warning.main' }}>
                      <ScheduleIcon />
                    </Avatar>
                  </CardContent>
                </Card>
              </Box>

              {/* Expense Category Chart */}
              {expenseCategoryData.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardHeader title="Expense Breakdown" />
                  <CardContent>
                    <Box sx={{ height: 250, width: '100%', minWidth: 300 }}>
                      <PieChart
                        key={`expense-pie-${currentUser.role}-${expenseYear}-${expenseMonth}`}
                        series={[
                          {
                            data: expenseCategoryData.map((item, index) => ({
                              id: index,
                              value: item.value,
                              label: item.name,
                              color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
                            })),
                            innerRadius: 60,
                            outerRadius: 80,
                            paddingAngle: 5,
                            cornerRadius: 4,
                            valueFormatter: (value) => `₹${value.value.toLocaleString()}`,
                          },
                        ]}
                        height={250}
                        slotProps={{
                          legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: 0,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Expenses Table */}
              <Card>
                <CardHeader
                  title="My Expenses"
                  subheader="Track your reimbursement status"
                  action={
                    <Stack direction="row" spacing={2}>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={expenseYear}
                          label="Year"
                          onChange={(e) => setExpenseYear(e.target.value)}
                        >
                          <MenuItem value="2026">2026</MenuItem>
                          <MenuItem value="2025">2025</MenuItem>
                          <MenuItem value="all">All Years</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={expenseMonth}
                          label="Month"
                          onChange={(e) => setExpenseMonth(e.target.value)}
                        >
                          <MenuItem value="all">All Months</MenuItem>
                          {months.map((m) => (
                            <MenuItem key={m.value} value={m.value}>
                              {m.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button variant="contained" color="primary">
                        Submit New
                      </Button>
                    </Stack>
                  }
                />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Expense ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredExpenses.length > 0 ? (
                          filteredExpenses.map((exp) => (
                            <TableRow key={exp.expense_id}>
                              <TableCell>
                                <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
                                  {exp.expense_id}
                                </Typography>
                              </TableCell>
                              <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                              <TableCell>{exp.category}</TableCell>
                              <TableCell sx={{ maxWidth: 200 }}>
                                <Typography variant="body2" noWrap title={exp.description}>
                                  {exp.description}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight={600}>₹{exp.amount.toLocaleString()}</Typography>
                              </TableCell>
                              <TableCell align="center">{getStatusChip(exp.status)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                              <Stack alignItems="center" spacing={1}>
                                <FileTextIcon sx={{ fontSize: 32, opacity: 0.5 }} />
                                <Typography color="text.secondary">
                                  No expenses found for this period.
                                </Typography>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
}

export default UserDashboard;
