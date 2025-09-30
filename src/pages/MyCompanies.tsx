import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Settings,
  Eye,
  Edit
} from "lucide-react";

const MyCompanies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserCompanies();
    }
  }, [user]);

  const loadUserCompanies = async () => {
    try {
      setIsLoading(true);
      const userCompanies = await apiService.getUserCompanies();
      
      // Transform the response to match the expected format
      const companies = userCompanies.map((company: any) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        industry: company.sector || company.industry,
        location: company.location,
        website: company.website,
        avatar: company.logo_url,
        status: company.status === 'approved' ? 'active' : company.status,
        founded: new Date(company.created_at).getFullYear().toString(),
        members: 1, // Default to 1 member (the owner)
        impact: '€0', // Default impact
        lastActivity: 'Recently'
      }));
      
      setCompanies(companies);
    } catch (error) {
      console.error('Error loading user companies:', error);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending Approval';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            My Companies
          </h1>
          <p className="text-gray-600 mt-1">Manage your companies and team members</p>
        </div>
        <Button className="flex items-center space-x-2" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
          <Plus className="w-4 h-4" />
          <span>Add New Company</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
                  {companies.reduce((sum, company) => sum + company.members, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <div>
                <p className="text-sm text-gray-600">Total Impact</p>
                <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
                  €4.4M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <div>
                <p className="text-sm text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
                  {companies.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your companies...</p>
          </CardContent>
        </Card>
      )}

      {/* Companies List */}
      {!isLoading && (
        <div className="space-y-4">
          {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={company.avatar} />
                    <AvatarFallback className="text-lg" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                      {company.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>
                        {company.name}
                      </h3>
                      <Badge className={getStatusColor(company.status)}>
                        {getStatusText(company.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{company.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Industry:</span>
                        <p className="font-medium">{company.industry}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Founded:</span>
                        <p className="font-medium">{company.founded}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{company.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Members:</span>
                        <p className="font-medium">{company.members}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span>Impact: <span className="font-medium text-green-600">{company.impact}</span></span>
                      <span>Last Activity: {company.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && companies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
              No Companies Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't added any companies yet. Start by creating your first company profile.
            </p>
            <Button className="flex items-center space-x-2 mx-auto" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
              <Plus className="w-4 h-4" />
              <span>Add Your First Company</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyCompanies; 