
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, MessageSquare } from "lucide-react";

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

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    fromUserId: string;
    toUserId: string;
    skillOffered: string;
    skillRequested: string;
    message: string;
  }) => void;
  targetUser: User | null;
  currentUser: User;
}

const SwapRequestModal = ({ isOpen, onClose, onSubmit, targetUser, currentUser }: SwapRequestModalProps) => {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!targetUser || !skillOffered || !skillRequested) return;

    onSubmit({
      fromUserId: currentUser.id,
      toUserId: targetUser.id,
      skillOffered,
      skillRequested,
      message
    });

    // Reset form
    setSkillOffered("");
    setSkillRequested("");
    setMessage("");
    onClose();
  };

  if (!targetUser) return null;

  const availableSkillsToOffer = currentUser.skillsOffered.filter(skill =>
    targetUser.skillsWanted.includes(skill)
  );

  const availableSkillsToRequest = targetUser.skillsOffered.filter(skill =>
    currentUser.skillsWanted.includes(skill)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5 text-teal-600" />
            <span>Request Skill Swap</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target User Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={targetUser.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                {targetUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <p className="text-sm text-gray-600">
                {targetUser.location && `${targetUser.location} • `}
                {targetUser.rating > 0 && `⭐ ${targetUser.rating} (${targetUser.reviewCount} reviews)`}
              </p>
            </div>
          </div>

          {/* Skill Selection */}
          {availableSkillsToOffer.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>No matching skills found.</strong> You don't have any skills that {targetUser.name} is looking for. 
                Consider updating your profile to include more skills they might be interested in.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Your Skill to Offer</Label>
                <Select value={skillOffered} onValueChange={setSkillOffered}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a skill you can teach" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkillsToOffer.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {skill}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            (they want this)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skill You Want to Learn</Label>
                <Select value={skillRequested} onValueChange={setSkillRequested}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a skill you want to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkillsToRequest.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                            {skill}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            (they offer this)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder={`Hi ${targetUser.name}! I'd love to exchange skills with you. When would be a good time to connect?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Availability Info */}
              {targetUser.availability.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Their Availability:</h4>
                  <div className="flex flex-wrap gap-1">
                    {targetUser.availability.map((time) => (
                      <Badge key={time} variant="secondary" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!skillOffered || !skillRequested || availableSkillsToOffer.length === 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwapRequestModal;
