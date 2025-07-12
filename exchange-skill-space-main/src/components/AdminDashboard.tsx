
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Download, 
  MessageSquare, 
  Monitor, 
  Shield, 
  Users, 
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  skillsOffered: string[];
  skillsWanted: string[];
  isPublic: boolean;
  isBanned: boolean;
  joinDate: string;
  reportCount: number;
}

interface SwapRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  skillOffered: string;
  skillRequested: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  message: string;
}

interface ReportedSkill {
  id: string;
  userId: string;
  userName: string;
  skill: string;
  type: 'offered' | 'wanted';
  reportReason: string;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard = ({ isOpen, onClose }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [messageDialog, setMessageDialog] = useState(false);
  const [platformMessage, setPlatformMessage] = useState("");

  // Mock data - in real app this would come from backend
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Chen",
      skillsOffered: ["Photoshop", "UI/UX Design"],
      skillsWanted: ["Python", "Data Analysis"],
      isPublic: true,
      isBanned: false,
      joinDate: "2024-01-15",
      reportCount: 0
    },
    {
      id: "2", 
      name: "Marcus Johnson",
      skillsOffered: ["Python", "Machine Learning"],
      skillsWanted: ["Guitar", "Spanish"],
      isPublic: true,
      isBanned: false,
      joinDate: "2024-02-20",
      reportCount: 1
    }
  ]);

  const [swapRequests] = useState<SwapRequest[]>([
    {
      id: "1",
      fromUserId: "1",
      fromUserName: "Sarah Chen",
      toUserId: "2", 
      toUserName: "Marcus Johnson",
      skillOffered: "Photoshop",
      skillRequested: "Python",
      status: "pending",
      createdAt: "2024-07-10",
      message: "I'd love to learn Python basics!"
    },
    {
      id: "2",
      fromUserId: "2",
      fromUserName: "Marcus Johnson", 
      toUserId: "1",
      toUserName: "Sarah Chen",
      skillOffered: "Machine Learning",
      skillRequested: "UI/UX Design",
      status: "accepted",
      createdAt: "2024-07-08",
      message: "Happy to teach ML concepts"
    }
  ]);

  const [reportedSkills] = useState<ReportedSkill[]>([
    {
      id: "1",
      userId: "3",
      userName: "Spam User",
      skill: "Make money fast online",
      type: "offered",
      reportReason: "Inappropriate/Spam content",
      reportedAt: "2024-07-11",
      status: "pending"
    }
  ]);

  const handleBanUser = (userId: string, userName: string) => {
    toast({
      title: "User Banned",
      description: `${userName} has been banned from the platform.`,
      variant: "destructive"
    });
  };

  const handleRejectSkill = (skillId: string) => {
    toast({
      title: "Skill Rejected",
      description: "The reported skill has been removed.",
    });
  };

  const handleApproveSkill = (skillId: string) => {
    toast({
      title: "Skill Approved", 
      description: "The skill has been approved and will remain visible.",
    });
  };

  const handleSendPlatformMessage = () => {
    if (!platformMessage.trim()) return;
    
    toast({
      title: "Platform Message Sent",
      description: "Your message has been sent to all users.",
    });
    setPlatformMessage("");
    setMessageDialog(false);
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportType} report has been generated and downloaded.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      accepted: "default", 
      rejected: "destructive",
      cancelled: "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[800px] sm:max-w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </SheetTitle>
          <SheetDescription>
            Manage users, monitor swaps, and oversee platform activity
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="swaps">Swaps</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">Active users on platform</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Swaps</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {swapRequests.filter(s => s.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportedSkills.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Needs review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
                  <Ban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter(u => u.isBanned).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently banned</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setMessageDialog(true)}
                  className="w-full justify-start"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Platform-wide Message
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport("User Activity")}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download User Activity Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.reportCount}</TableCell>
                    <TableCell>
                      {!user.isBanned && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBanUser(user.id, user.name)}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedSkills.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.userName}</TableCell>
                    <TableCell>{report.skill}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-32 truncate">{report.reportReason}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      {report.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectSkill(report.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveSkill(report.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {swapRequests.map((swap) => (
                  <TableRow key={swap.id}>
                    <TableCell className="font-medium">{swap.fromUserName}</TableCell>
                    <TableCell>{swap.toUserName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{swap.skillOffered} → {swap.skillRequested}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(swap.status)}</TableCell>
                    <TableCell>{swap.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Download Reports</CardTitle>
                  <CardDescription>
                    Generate and download various platform reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport("User Activity")}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    User Activity Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownloadReport("Feedback Logs")}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Feedback & Reviews Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownloadReport("Swap Statistics")}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Swap Statistics Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Platform-wide Message</DialogTitle>
              <DialogDescription>
                This message will be sent to all users on the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your message here..."
                value={platformMessage}
                onChange={(e) => setPlatformMessage(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setMessageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendPlatformMessage}>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
};

export default AdminDashboard;
