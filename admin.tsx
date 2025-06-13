import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, CreditCard, Shield, CheckCircle, XCircle, Clock, DollarSign, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  role: string;
  kycStatus: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  walletAddress?: string;
  bankDetails?: string;
  adminNotes?: string;
  createdAt: string;
}

interface KycRecord {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(null);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-500">Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setLocation("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: true,
  });

  // Fetch all transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    enabled: true,
  });

  // Fetch pending KYC
  const { data: kycRecords = [], isLoading: kycLoading } = useQuery<KycRecord[]>({
    queryKey: ["/api/admin/kyc"],
    enabled: true,
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes: string }) => {
      const response = await fetch(`/api/admin/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Transaction Updated",
        description: "Transaction status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      setSelectedTransaction(null);
      setTransactionStatus("");
      setAdminNotes("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update transaction status.",
        variant: "destructive",
      });
    },
  });

  // Update KYC mutation
  const updateKycMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) => {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (!response.ok) throw new Error("Failed to update KYC");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "KYC Updated",
        description: "KYC status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedKyc(null);
      setKycStatus("");
      setRejectionReason("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update KYC status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string, type: "transaction" | "kyc") => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };

    return (
      <Badge className={colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const stats = {
    totalUsers: users.length,
    pendingKyc: kycRecords.filter(k => k.status === "pending").length,
    pendingTransactions: transactions.filter(t => t.status === "pending").length,
    totalVolume: transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Genius Trading - Admin
              </h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await logout();
                    setLocation("/");
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Manage users, transactions, and KYC verifications
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingKyc}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="addresses">Deposit Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and view user information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatCurrency(user.balance)}</TableCell>
                        <TableCell>{getStatusBadge(user.kycStatus, "kyc")}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
              <CardDescription>
                Review and manage user transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>#{transaction.id}</TableCell>
                        <TableCell>{transaction.userId}</TableCell>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status, "transaction")}</TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setTransactionStatus(transaction.status);
                                  setAdminNotes(transaction.adminNotes || "");
                                }}
                              >
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage Transaction #{transaction.id}</DialogTitle>
                                <DialogDescription>
                                  Update transaction status and add admin notes
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select value={transactionStatus} onValueChange={setTransactionStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Admin Notes</label>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this transaction..."
                                    rows={3}
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    if (selectedTransaction) {
                                      updateTransactionMutation.mutate({
                                        id: selectedTransaction.id,
                                        status: transactionStatus,
                                        adminNotes,
                                      });
                                    }
                                  }}
                                  disabled={updateTransactionMutation.isPending}
                                  className="w-full"
                                >
                                  {updateTransactionMutation.isPending ? "Updating..." : "Update Transaction"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Review and approve KYC submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {kycLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>KYC ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycRecords.map((kyc) => (
                      <TableRow key={kyc.id}>
                        <TableCell>#{kyc.id}</TableCell>
                        <TableCell>{kyc.userId}</TableCell>
                        <TableCell>{kyc.fullName}</TableCell>
                        <TableCell className="capitalize">{kyc.documentType.replace('_', ' ')}</TableCell>
                        <TableCell>{getStatusBadge(kyc.status, "kyc")}</TableCell>
                        <TableCell>{new Date(kyc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedKyc(kyc);
                                  setKycStatus(kyc.status);
                                  setRejectionReason(kyc.rejectionReason || "");
                                }}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review KYC #{kyc.id}</DialogTitle>
                                <DialogDescription>
                                  Review user information and update verification status
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Full Name</label>
                                    <p className="text-sm">{kyc.fullName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Date of Birth</label>
                                    <p className="text-sm">{kyc.dateOfBirth}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Document Type</label>
                                    <p className="text-sm capitalize">{kyc.documentType.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Document Number</label>
                                    <p className="text-sm">{kyc.documentNumber}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Nationality</label>
                                    <p className="text-sm">{kyc.nationality}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <p className="text-sm">{kyc.phoneNumber}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Address</label>
                                  <p className="text-sm">{kyc.address}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select value={kycStatus} onValueChange={setKycStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {kycStatus === "rejected" && (
                                  <div>
                                    <label className="text-sm font-medium">Rejection Reason</label>
                                    <Textarea
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      placeholder="Explain why this KYC was rejected..."
                                      rows={3}
                                    />
                                  </div>
                                )}
                                <Button
                                  onClick={() => {
                                    if (selectedKyc) {
                                      updateKycMutation.mutate({
                                        id: selectedKyc.id,
                                        status: kycStatus,
                                        rejectionReason: kycStatus === "rejected" ? rejectionReason : undefined,
                                      });
                                    }
                                  }}
                                  disabled={updateKycMutation.isPending}
                                  className="w-full"
                                >
                                  {updateKycMutation.isPending ? "Updating..." : "Update KYC Status"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Addresses Management</CardTitle>
              <CardDescription>Manage cryptocurrency deposit addresses for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <DepositAddressesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

function DepositAddressesTab() {
  const [newAddress, setNewAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const { toast } = useToast();

  const { data: depositAddresses = [], isLoading } = useQuery<{id: string, method: string, address: string}[]>({
    queryKey: ["/api/deposit-addresses"],
  });

  const createAddressMutation = useMutation({
    mutationFn: async ({ method, address }: { method: string; address: string }) => {
      const response = await fetch("/api/admin/deposit-addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, address }),
      });
      if (!response.ok) throw new Error("Failed to create address");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Address Created",
        description: "Deposit address has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deposit-addresses"] });
      setNewAddress("");
      setSelectedMethod("");
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create deposit address.",
        variant: "destructive",
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, address }: { id: string; address: string }) => {
      const response = await fetch(`/api/admin/deposit-addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!response.ok) throw new Error("Failed to update address");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Address Updated",
        description: "Deposit address has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deposit-addresses"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update deposit address.",
        variant: "destructive",
      });
    },
  });

  const methods = [
    { value: "bitcoin", label: "Bitcoin" },
    { value: "ethereum", label: "Ethereum" },
    { value: "usdt", label: "USDT (TRC20)" },
    { value: "bank", label: "Bank Transfer" },
  ];

  if (isLoading) {
    return <div>Loading deposit addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {methods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="text"
          placeholder="Enter deposit address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />

        <Button 
          onClick={() => createAddressMutation.mutate({ method: selectedMethod, address: newAddress })}
          disabled={!selectedMethod || !newAddress || createAddressMutation.isPending}
        >
          {createAddressMutation.isPending ? "Adding..." : "Add Address"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Method</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depositAddresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell className="capitalize">{address.method}</TableCell>
              <TableCell className="font-mono text-sm max-w-xs truncate">{address.address}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Deposit Address</DialogTitle>
                      <DialogDescription>
                        Update the {address.method} deposit address
                      </DialogDescription>
                    </DialogHeader>
                    <EditAddressForm 
                      address={address} 
                      onUpdate={(data) => updateAddressMutation.mutate(data)} 
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EditAddressForm({ address, onUpdate }: { address: {id: string, method: string, address: string}, onUpdate: (data: {id: string, address: string}) => void }) {
  const [newAddress, setNewAddress] = useState(address.address);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter new address"
        />
      </div>
      <Button 
        onClick={() => onUpdate({ id: address.id, address: newAddress })}
        className="w-full"
      >
        Update Address
      </Button>
    </div>
  );
}