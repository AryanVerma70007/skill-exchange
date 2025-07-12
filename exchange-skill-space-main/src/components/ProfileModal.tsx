
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X, Upload, MapPin, User } from "lucide-react";

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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  initialData: User;
}

const ProfileModal = ({ isOpen, onClose, onSave, initialData }: ProfileModalProps) => {
  const [formData, setFormData] = useState<Partial<User>>(initialData);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [newAvailability, setNewAvailability] = useState("");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...(prev.skillsOffered || []), newSkillOffered.trim()]
      }));
      setNewSkillOffered("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered?.filter(s => s !== skill) || []
    }));
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...(prev.skillsWanted || []), newSkillWanted.trim()]
      }));
      setNewSkillWanted("");
    }
  };

  const removeSkillWanted = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted?.filter(s => s !== skill) || []
    }));
  };

  const addAvailability = () => {
    if (newAvailability.trim()) {
      setFormData(prev => ({
        ...prev,
        availability: [...(prev.availability || []), newAvailability.trim()]
      }));
      setNewAvailability("");
    }
  };

  const removeAvailability = (time: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability?.filter(t => t !== time) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Create Your Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Photo */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white text-2xl">
                {formData.name?.charAt(0) || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">Optional - Add a profile picture</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="location"
                  placeholder="City, State"
                  className="pl-10"
                  value={formData.location || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="public-profile" className="text-base font-medium">
                Public Profile
              </Label>
              <p className="text-sm text-gray-600">
                Allow others to find and contact you for skill swaps
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          {/* Skills Offered */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-green-700">Skills You Can Offer</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., Photoshop, Cooking, Guitar..."
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
              />
              <Button onClick={addSkillOffered} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsOffered?.map((skill) => (
                <Badge key={skill} className="bg-green-100 text-green-800">
                  {skill}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                    onClick={() => removeSkillOffered(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-blue-700">Skills You Want to Learn</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., Python, Spanish, Photography..."
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
              />
              <Button onClick={addSkillWanted} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsWanted?.map((skill) => (
                <Badge key={skill} variant="outline" className="border-blue-300 text-blue-700">
                  {skill}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                    onClick={() => removeSkillWanted(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">When Are You Available?</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., Weekends, Evenings, Monday 6-8pm..."
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
              />
              <Button onClick={addAvailability} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.availability?.map((time) => (
                <Badge key={time} variant="secondary">
                  {time}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                    onClick={() => removeAvailability(time)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            disabled={!formData.name?.trim()}
          >
            Save Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
