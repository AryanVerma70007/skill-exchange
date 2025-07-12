import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Star, Calendar, MapPin, Plus, Shield } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import SwapRequestModal from "@/components/SwapRequestModal";
import AdminDashboard from "@/components/AdminDashboard";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  location?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  reviewCount: number;
}

interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillRequested: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
}

const IndexContent = () => {
  const { toast } = useToast();
  const { isAdmin, toggleAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "current-user",
    name: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true,
    rating: 0,
    reviewCount: 0
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Chen",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg",
      skillsOffered: ["Photoshop", "UI/UX Design", "Figma"],
      skillsWanted: ["Python", "Data Analysis"],
      availability: ["Weekends", "Evenings"],
      isPublic: true,
      rating: 4.8,
      reviewCount: 12
    },
    {
      id: "2",
      name: "Marcus Johnson",
      location: "New York, NY",
      skillsOffered: ["Python", "Machine Learning", "Excel"],
      skillsWanted: ["Guitar", "Spanish"],
      availability: ["Weekends"],
      isPublic: true,
      rating: 4.9,
      reviewCount: 8
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      location: "Austin, TX",
      skillsOffered: ["Spanish", "Cooking", "Photography"],
      skillsWanted: ["Web Development", "Marketing"],
      availability: ["Evenings", "Weekends"],
      isPublic: true,
      rating: 4.7,
      reviewCount: 15
    }
  ]);

  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  const filteredUsers = users.filter(user => 
    user.isPublic && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.skillsWanted.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const handleProfileSave = (profileData: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...profileData }));
    if (profileData.name) {
      const userExists = users.find(u => u.id === currentUser.id);
      if (userExists) {
        setUsers(prev => prev.map(u => 
          u.id === currentUser.id ? { ...u, ...profileData } : u
        ));
      } else {
        setUsers(prev => [...prev, { ...currentUser, ...profileData }]);
      }
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully!",
      });
    }
  };

  const handleSwapRequest = (request: Omit<SwapRequest, 'id' | 'status'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending'
    };
    setSwapRequests(prev => [...prev, newRequest]);
    toast({
      title: "Swap Request Sent",
      description: "Your skill swap request has been sent!",
    });
  };

  const handleSwapResponse = (requestId: string, status: 'accepted' | 'rejected') => {
    setSwapRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status } : req
    ));
    toast({
      title: status === 'accepted' ? "Request Accepted" : "Request Rejected",
      description: `The swap request has been ${status}.`,
    });
  };

  const deleteSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.filter(req => req.id !== requestId));
    toast({
      title: "Request Deleted",
      description: "The swap request has been deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                SkillSwap
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Button 
                  onClick={() => setIsAdminDashboardOpen(true)}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
              <Button 
                onClick={toggleAdmin}
                variant={isAdmin ? "destructive" : "secondary"}
                size="sm"
              >
                {isAdmin ? "Exit Admin" : "Admin Mode"}
              </Button>
              <Button 
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Exchange Skills, Build Community
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with others to trade skills, learn new things, and build meaningful relationships in your community.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search skills (e.g., Photoshop, Python, Guitar...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Swap Requests Section */}
        {swapRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Your Swap Requests</h3>
            <div className="grid gap-4">
              {swapRequests.map((request) => {
                const requestUser = users.find(u => u.id === request.toUserId);
                return (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={requestUser?.avatar} />
                            <AvatarFallback>{requestUser?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{requestUser?.name}</p>
                            <p className="text-sm text-gray-600">
                              Offering: <Badge variant="secondary">{request.skillOffered}</Badge>
                              {" "}for{" "}
                              <Badge variant="outline">{request.skillRequested}</Badge>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              request.status === 'accepted' ? 'default' :
                              request.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                          >
                            {request.status}
                          </Badge>
                          {request.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteSwapRequest(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      {user.location && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {user.rating > 0 && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{user.rating}</span>
                      <span className="text-gray-500">({user.reviewCount})</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.map((skill) => (
                      <Badge key={skill} className="bg-green-100 text-green-800 hover:bg-green-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-blue-300 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Availability
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {user.availability.map((time) => (
                      <Badge key={time} variant="secondary">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsSwapModalOpen(true);
                  }}
                >
                  Request Skill Swap
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or create your profile to get started!</p>
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
        initialData={currentUser}
      />

      <SwapRequestModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={handleSwapRequest}
        targetUser={selectedUser}
        currentUser={currentUser}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <AdminProvider>
      <IndexContent />
    </AdminProvider>
  );
};

export default Index;
