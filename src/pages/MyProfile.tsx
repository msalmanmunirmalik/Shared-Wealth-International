import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Edit,
  Save,
  X,
  Globe,
  Linkedin,
  Twitter
} from "lucide-react";

const MyProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  // Dummy profile data
  const [profileData, setProfileData] = React.useState({
    fullName: "John Smith",
    email: user?.email || "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "Pathway Technologies",
    role: "CEO & Founder",
    bio: "Experienced entrepreneur with 15+ years in technology and sustainable business development. Passionate about creating positive impact through innovative solutions.",
    joinDate: "March 2024",
    expertise: ["Sustainable Technology", "Business Strategy", "Team Leadership", "Innovation"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith",
      website: "https://johnsmith.com"
    }
  });

  const [editData, setEditData] = React.useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center space-x-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profileData.fullName}</CardTitle>
            <CardDescription>{profileData.role}</CardDescription>
            <Badge variant="secondary" className="mt-2">
              Active Member
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{profileData.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{profileData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{profileData.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{profileData.company}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Member since {profileData.joinDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editData.fullName}
                      onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editData.company}
                      onChange={(e) => setEditData({...editData, company: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bio</Label>
                    <p className="mt-1">{profileData.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.expertise.map((skill, index) => (
                  <Badge key={index} variant="outline" style={{ borderColor: 'rgb(245, 158, 11)', color: 'rgb(245, 158, 11)' }}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <a href={profileData.socialLinks.linkedin} className="text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <a href={profileData.socialLinks.twitter} className="text-blue-400 hover:underline">
                    Twitter
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <a href={profileData.socialLinks.website} className="text-gray-600 hover:underline">
                    Personal Website
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-3 pt-6 border-t" style={{ borderColor: 'rgb(224, 230, 235)' }}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyProfile; 