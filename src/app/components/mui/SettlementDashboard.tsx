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
  Stack,
  Avatar,
  alpha,
  Paper,
  Checkbox,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TableChart as FileSpreadsheetIcon,
  CheckCircle as CheckCircle2Icon,
  AttachMoney as DollarSignIcon,
  People as UsersIcon,
  Business as Building2Icon,
  Warning as AlertCircleIcon,
  Wallet as WalletIcon,
  Schedule as ClockIcon,
  TrendingUp as ArrowUpRightIcon,
} from '@mui/icons-material';
import {
  SETTLEMENTS,
  SETTLEMENT_BATCHES,
  MEMBER_EXPENSES,
  VENDOR_BILLS,
  MONTHLY_STATS,
} from '@/app/data/mockData';
import { colors } from './theme';

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

export function SettlementDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSettlements, setSelectedSettlements] = useState<string[]>([]);
  const [settlements, setSettlements] = useState(
    SETTLEMENTS.filter((s) => s.month === '2026-01').map((s) => ({
      ...s,
      status: s.status === 'processed' ? 'reimbursed' : s.status,
    }))
  );
  const [activePreviewTab, setActivePreviewTab] = useState(0);

  // Filtered lists based on status
  const pendingSettlements = settlements.filter((s) => s.status === 'pending');
  const approvedSettlements = settlements.filter((s) => s.status === 'approved');
  const reimbursedSettlements = settlements.filter((s) => s.status === 'reimbursed');

  // Determine current list based on tab
  const currentTabSettlements =
    activePreviewTab === 0 ? pendingSettlements : activePreviewTab === 1 ? approvedSettlements : reimbursedSettlements;

  // Calculate totals
  const totalReimbursedAmount = reimbursedSettlements.reduce((sum, s) => sum + s.amount, 0);
  const totalPendingApprovedAmount = [...pendingSettlements, ...approvedSettlements].reduce((sum, s) => sum + s.amount, 0);
  const accountBalance = (MONTHLY_STATS[0]?.netBalance || 0) + 500000;

  const memberReimbursements = settlements.filter((s) => s.beneficiary_type === 'member');
  const vendorPayments = settlements.filter((s) => s.beneficiary_type === 'vendor');
  const totalMembers = memberReimbursements.reduce((sum, s) => sum + s.amount, 0);
  const totalVendors = vendorPayments.reduce((sum, s) => sum + s.amount, 0);

  const pastBatches = SETTLEMENT_BATCHES;

  // Toggle settlement selection
  const toggleSettlement = (id: string) => {
    setSelectedSettlements((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  // Select all settlements
  const toggleSelectAll = () => {
    if (selectedSettlements.length === currentTabSettlements.length) {
      setSelectedSettlements([]);
    } else {
      setSelectedSettlements(currentTabSettlements.map((s) => s.settlement_id));
    }
  };

  // Approve selected
  const approveSelected = () => {
    setSettlements((prev) =>
      prev.map((s) => (selectedSettlements.includes(s.settlement_id) ? { ...s, status: 'approved' } : s))
    );
    setSelectedSettlements([]);
    setActivePreviewTab(1);
  };

  // Generate Excel
  const generateExcel = () => {
    alert(`Excel file generated successfully for ${selectedSettlements.length} approved settlements! Ready for IDFC Bank upload.`);
  };

  // Mark as Reimbursed
  const markAsReimbursed = () => {
    setSettlements((prev) =>
      prev.map((s) => (selectedSettlements.includes(s.settlement_id) ? { ...s, status: 'reimbursed' } : s))
    );
    setSelectedSettlements([]);
    setActivePreviewTab(2);
  };

  // Validate settlements
  const invalidSettlements = currentTabSettlements.filter(
    (s) => (!s.account_number || !s.ifsc_code) && selectedSettlements.includes(s.settlement_id)
  );

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" size="small" color="error" />;
      case 'approved':
        return <Chip label="Approved" size="small" color="warning" />;
      case 'reimbursed':
        return <Chip label="Reimbursed" size="small" color="success" />;
      case 'processed':
        return <Chip label="Processed" size="small" color="success" />;
      case 'uploaded':
        return <Chip label="Uploaded" size="small" color="info" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ minHeight: '101vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Account Dashboard
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="Account Manager" variant="outlined" size="small" />
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Typography variant="body2" color="text.secondary">January 2026</Typography>
        </Stack>
      </Box>

      {/* Overview Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <StatCard
          variant="primary"
          title="Account Balance"
          value={`₹${accountBalance.toLocaleString()}`}
          icon={<WalletIcon />}
          trend={{ label: 'Healthy funds available', icon: <ArrowUpRightIcon sx={{ fontSize: 14 }} /> }}
        />
        <StatCard
          title="Total Reimbursed"
          value={`₹${totalReimbursedAmount.toLocaleString()}`}
          icon={<CheckCircle2Icon sx={{ color: 'success.main' }} />}
          trend={{ label: `${reimbursedSettlements.length} payments completed`, color: 'success.main' }}
        />
        <StatCard
          title="Pending & Approved"
          value={`₹${totalPendingApprovedAmount.toLocaleString()}`}
          icon={<ClockIcon sx={{ color: 'warning.main' }} />}
          trend={{ label: `${pendingSettlements.length + approvedSettlements.length} pending processing`, color: 'warning.main' }}
        />
        <StatCard
          variant="dark"
          title="Validation Status"
          value=""
          icon={<AlertCircleIcon />}
          trend={{
            label: invalidSettlements.length === 0 ? 'Ready for generation' : 'Missing account details',
            icon: (
              <Chip
                label={invalidSettlements.length === 0 ? 'All Valid' : `${invalidSettlements.length} Invalid`}
                size="small"
                sx={{
                  bgcolor: invalidSettlements.length === 0 ? 'success.main' : 'white',
                  color: invalidSettlements.length === 0 ? 'white' : 'error.main',
                }}
              />
            ),
          }}
        />
      </Box>

      {/* Main Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Current Month" />
            <Tab label="Settlement History" />
          </Tabs>
        </Box>

        {/* Current Month Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Settlement Workflow" subheader="Process settlements: Approve → Generate Excel → Mark Reimbursed" />
              <CardContent>
                <Tabs
                  value={activePreviewTab}
                  onChange={(_, v) => {
                    setActivePreviewTab(v);
                    setSelectedSettlements([]);
                  }}
                  sx={{ mb: 2 }}
                >
                  <Tab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>Pending Approval</span>
                        {pendingSettlements.length > 0 && (
                          <Chip label={pendingSettlements.length} size="small" color="error" />
                        )}
                      </Stack>
                    }
                  />
                  <Tab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>Approved (Ready for Excel)</span>
                        {approvedSettlements.length > 0 && (
                          <Chip label={approvedSettlements.length} size="small" color="warning" />
                        )}
                      </Stack>
                    }
                  />
                  <Tab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>Reimbursed (Paid)</span>
                        {reimbursedSettlements.length > 0 && (
                          <Chip label={reimbursedSettlements.length} size="small" color="success" />
                        )}
                      </Stack>
                    }
                  />
                </Tabs>

                {/* Action Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {activePreviewTab !== 2 ? (
                      <>
                        {selectedSettlements.length} selected
                        {selectedSettlements.length > 0 &&
                          ` • ₹${currentTabSettlements
                            .filter((s) => selectedSettlements.includes(s.settlement_id))
                            .reduce((sum, s) => sum + s.amount, 0)
                            .toLocaleString()}`}
                      </>
                    ) : (
                      `Total Reimbursed: ₹${reimbursedSettlements.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}`
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {activePreviewTab === 0 && (
                      <Button
                        variant="contained"
                        color="error"
                        disabled={selectedSettlements.length === 0 || invalidSettlements.length > 0}
                        onClick={approveSelected}
                        startIcon={<CheckCircle2Icon />}
                      >
                        Approve Selected
                      </Button>
                    )}
                    {activePreviewTab === 1 && (
                      <>
                        <Button
                          variant="contained"
                          disabled={selectedSettlements.length === 0 || invalidSettlements.length > 0}
                          onClick={generateExcel}
                          startIcon={<DownloadIcon />}
                        >
                          Generate Excel
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={selectedSettlements.length === 0}
                          onClick={markAsReimbursed}
                          startIcon={<CheckCircle2Icon />}
                        >
                          Mark Reimbursed
                        </Button>
                      </>
                    )}
                    {activePreviewTab === 2 && (
                      <Button variant="outlined" disabled startIcon={<CheckCircle2Icon />}>
                        Completed
                      </Button>
                    )}
                  </Stack>
                </Box>

                {/* Invalid Alert */}
                {invalidSettlements.length > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Invalid Account Details</AlertTitle>
                    {invalidSettlements.length} selected settlement(s) have missing account numbers or IFSC codes.
                  </Alert>
                )}

                {/* Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {activePreviewTab !== 2 && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedSettlements.length === currentTabSettlements.length && currentTabSettlements.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </TableCell>
                        )}
                        <TableCell>Beneficiary Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Account Number</TableCell>
                        <TableCell>IFSC Code</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentTabSettlements.length > 0 ? (
                        currentTabSettlements.map((settlement) => (
                          <TableRow key={settlement.settlement_id}>
                            {activePreviewTab !== 2 && (
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedSettlements.includes(settlement.settlement_id)}
                                  onChange={() => toggleSettlement(settlement.settlement_id)}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography fontWeight={500}>{settlement.beneficiary_name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={settlement.beneficiary_type === 'member' ? 'Member' : 'Vendor'}
                                size="small"
                                variant="outlined"
                                icon={settlement.beneficiary_type === 'member' ? <UsersIcon /> : <Building2Icon />}
                              />
                            </TableCell>
                            <TableCell>
                              {settlement.account_number ? (
                                <Typography variant="body2" fontFamily="monospace">{settlement.account_number}</Typography>
                              ) : (
                                <Typography variant="body2" color="error.main">Missing</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {settlement.ifsc_code ? (
                                <Typography variant="body2" fontFamily="monospace">{settlement.ifsc_code}</Typography>
                              ) : (
                                <Typography variant="body2" color="error.main">Missing</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={600}>₹{settlement.amount.toLocaleString()}</Typography>
                            </TableCell>
                            <TableCell>{getStatusChip(settlement.status)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={activePreviewTab !== 2 ? 7 : 6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No settlements found in {['pending', 'approved', 'reimbursed'][activePreviewTab]} status.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Breakdown by Type */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <UsersIcon sx={{ color: colors.primary }} />
                      <Typography variant="h6">Member Reimbursements</Typography>
                    </Stack>
                  }
                  subheader={`Total: ₹${totalMembers.toLocaleString()}`}
                />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Member</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {memberReimbursements.map((settlement) => {
                          const expense = MEMBER_EXPENSES.find((e) => settlement.reference_ids.includes(e.expense_id));
                          return (
                            <TableRow key={settlement.settlement_id}>
                              <TableCell><Typography variant="body2" fontWeight={500}>{settlement.beneficiary_name}</Typography></TableCell>
                              <TableCell><Typography variant="body2" color="text.secondary">{expense?.category || '-'}</Typography></TableCell>
                              <TableCell><Typography fontWeight={600}>₹{settlement.amount.toLocaleString()}</Typography></TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Building2Icon sx={{ color: colors.success }} />
                      <Typography variant="h6">Vendor Payments</Typography>
                    </Stack>
                  }
                  subheader={`Total: ₹${totalVendors.toLocaleString()}`}
                />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Vendor</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vendorPayments.map((settlement) => {
                          const bill = VENDOR_BILLS.find((b) => settlement.reference_ids.includes(b.bill_id));
                          return (
                            <TableRow key={settlement.settlement_id}>
                              <TableCell><Typography variant="body2" fontWeight={500}>{settlement.beneficiary_name}</Typography></TableCell>
                              <TableCell><Typography variant="body2" color="text.secondary">{bill?.category || '-'}</Typography></TableCell>
                              <TableCell><Typography fontWeight={600}>₹{settlement.amount.toLocaleString()}</Typography></TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        {/* Settlement History Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Past Settlements" subheader="Complete history of all settlement batches" />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Batch ID</TableCell>
                        <TableCell>Month</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Beneficiaries</TableCell>
                        <TableCell>Generated Date</TableCell>
                        <TableCell>Generated By</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastBatches.map((batch) => (
                        <TableRow key={batch.batch_id}>
                          <TableCell><Typography variant="caption" fontFamily="monospace">{batch.batch_id}</Typography></TableCell>
                          <TableCell>
                            {new Date(batch.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </TableCell>
                          <TableCell><Typography fontWeight={600}>₹{batch.total_amount.toLocaleString()}</Typography></TableCell>
                          <TableCell>{batch.settlements.length}</TableCell>
                          <TableCell>{new Date(batch.created_date).toLocaleDateString()}</TableCell>
                          <TableCell>{batch.generated_by}</TableCell>
                          <TableCell>{getStatusChip(batch.status)}</TableCell>
                          <TableCell>
                            <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Excel Format Preview */}
            <Card>
              <CardHeader title="Excel Format Preview" subheader="Format compatible with IDFC Bank bulk upload portal" />
              <CardContent>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>Required Columns:</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                    {[
                      'Beneficiary Name',
                      'Account Number',
                      'IFSC Code',
                      'Amount',
                      'Beneficiary Type',
                      'Reference ID',
                      'Remarks',
                      'Payment Mode',
                    ].map((col) => (
                      <Paper key={col} sx={{ p: 1, bgcolor: 'white' }}>
                        <Typography variant="body2" fontFamily="monospace" color="primary">{col}</Typography>
                      </Paper>
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    The generated Excel file will be formatted according to IDFC Bank's bulk upload specifications.
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default SettlementDashboard;
