import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building, 
  Plus, 
  Search, 
  MapPin, 
  Globe, 
  Users, 
  DollarSign, 
  Target,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Award,
  Shield,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";

interface Company {
  id: string;
  name: string;
  industry: string; // Match database schema
  location: string; // Match database schema
  description: string;
  size: string; // Match database schema
  status: string;
  website?: string;
  logo?: string | null;
  highlights?: string[] | null;
  impact_score?: number | null;
  created_at: string;
}

interface UserCompany {
  id: string;
  user_id: string;
  company_id?: string;
  company_name: string;
  role: string;
  position: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  company_data?: Company;
}

const Companies = () => {
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);
  const [networkCompanies, setNetworkCompanies] = useState<Company[]>([]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // New company form state
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "", // Match database schema
    location: "", // Match database schema
    description: "",
    website: "",
    size: "", // Match database schema
    role: "",
    position: "",
    logo: null as File | null,
    logo_url: "",
    countries: [] as string[] // Added countries array
  });

  // Current country input state
  const [currentCountry, setCurrentCountry] = useState("");

  useEffect(() => {
    loadUserCompanies();
    loadNetworkCompanies();
  }, []);

  const loadUserCompanies = async () => {
    if (!user) return;
    
    try {
      // Load real user companies from API (no need to pass user.id - API uses JWT token)
      const response = await apiService.getUserCompanies();
      setUserCompanies(response || []);
    } catch (error) {
      console.error("Error loading user companies:", error);
      setUserCompanies([]); // Set empty array on error
    }
  };

  const loadNetworkCompanies = async () => {
    try {
      const response = await apiService.getCompanies();
      if (response && Array.isArray(response)) {
        setNetworkCompanies(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        setNetworkCompanies(Array.isArray(response.data) ? response.data : []);
      } else {
        setNetworkCompanies([]);
      }
    } catch (error) {
      console.error("Error loading network companies:", error);
      setNetworkCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Robust search filter
  const filteredNetworkCompanies = networkCompanies.filter(company =>
    (company.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (company.industry?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Error state for add company
  const [addCompanyError, setAddCompanyError] = useState<string | null>(null);

  const handleAddCompany = async () => {
    if (!user) return;
    
    setIsAddingCompany(true);
    setAddCompanyError("");
    
    try {
      // Submit company application to admin system for approval
      const companyApplicationData = {
        name: newCompany.name,
        industry: newCompany.industry,
        location: newCompany.location,
          description: newCompany.description,
          website: newCompany.website,
        size: newCompany.size,
        status: 'pending', // Submit as pending for admin approval
        // Additional applicant information
          applicant_role: newCompany.role,
          applicant_position: newCompany.position,
        applicant_user_id: user.id,
        // Logo data
        logo_file: newCompany.logo,
        logo_url: newCompany.logo_url,
        // Countries data
        countries: newCompany.countries
      };

      const companyResponse = await apiService.createCompany(companyApplicationData);

      if (companyResponse && typeof companyResponse === 'object' && 'id' in companyResponse) {
        // Show success message
        alert('Your company application has been submitted and is pending admin review.');
        
        // Reset form
      setNewCompany({
        name: "",
          industry: "",
          location: "",
        description: "",
        website: "",
          size: "",
        role: "",
          position: "",
          logo: null,
          logo_url: "",
          countries: []
        });
        setCurrentCountry("");
        
        setShowAddDialog(false);
        await loadNetworkCompanies();
      }
    } catch (error: any) {
      setAddCompanyError(error.message || 'Failed to submit company application.');
    } finally {
      setIsAddingCompany(false);
    }
  };

  const handleRemoveCompany = async (companyId: string) => {
    try {
      await apiService.deleteCompany(companyId);
      await loadUserCompanies();
    } catch (error) {
      console.error('Error removing company:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-navy">My Companies</h1>
            <p className="text-muted-foreground">Manage your company associations and network connections</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6">
                <Plus className="w-5 h-5 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Add Company Association</DialogTitle>
                <DialogDescription>
                  Connect with an existing network company or add a new one
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-1">

              <div className="space-y-6">
                {/* Company Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Company Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all ${!isNewCompany ? 'ring-2 ring-navy bg-navy/5' : 'hover:shadow-md'}`}
                      onClick={() => setIsNewCompany(false)}
                    >
                      <CardContent className="p-4 text-center">
                        <Building className="w-8 h-8 mx-auto mb-2 text-navy" />
                        <h3 className="font-semibold">Existing Network Company</h3>
                        <p className="text-sm text-muted-foreground">Select from our verified network</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer transition-all ${isNewCompany ? 'ring-2 ring-navy bg-navy/5' : 'hover:shadow-md'}`}
                      onClick={() => setIsNewCompany(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <Plus className="w-8 h-8 mx-auto mb-2 text-navy" />
                        <h3 className="font-semibold">New Company</h3>
                        <p className="text-sm text-muted-foreground">Add a new company to the network</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {!isNewCompany ? (
                  /* Existing Company Selection */
                  <div className="space-y-4">
                    <div>
                      <Label>Search Network Companies</Label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or sector..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredNetworkCompanies.length > 0 ? (
                        filteredNetworkCompanies.map((company) => (
                          <Card 
                            key={company.id}
                            className={`cursor-pointer transition-all ${selectedCompany === company.id ? 'ring-2 ring-navy bg-navy/5' : 'hover:shadow-sm'}`}
                            onClick={() => setSelectedCompany(company.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                                  {/* Assuming a logo field exists or use a placeholder */}
                                  <Building className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-navy">{company.name}</h4>
                                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {company.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      <MapPin className="w-3 h-3 inline mr-1" />
                                      {company.location}
                                    </span>
                                  </div>
                                </div>
                                {selectedCompany === company.id && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500 font-medium">No companies found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {searchTerm ? `No companies match "${searchTerm}". Try a different search term or add a new company.` : 'No companies available.'}
                          </p>
                          {searchTerm && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3"
                              onClick={() => setSearchTerm("")}
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* New Company Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Company Name *</Label>
                        <Input
                          id="name"
                          value={newCompany.name}
                          onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={newCompany.industry}
                          onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="countries">Countries of Operation *</Label>
                        <div className="flex items-center space-x-2">
                        <Input
                            id="countries"
                            value={currentCountry}
                            onChange={(e) => setCurrentCountry(e.target.value)}
                            placeholder="Enter country name"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (currentCountry.trim() && !newCompany.countries.includes(currentCountry.trim())) {
                                  setNewCompany({
                                    ...newCompany,
                                    countries: [...newCompany.countries, currentCountry.trim()]
                                  });
                                  setCurrentCountry('');
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (currentCountry.trim() && !newCompany.countries.includes(currentCountry.trim())) {
                                setNewCompany({
                                  ...newCompany,
                                  countries: [...newCompany.countries, currentCountry.trim()]
                                });
                                setCurrentCountry('');
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {newCompany.countries.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newCompany.countries.map((country, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                {country}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewCompany({
                                      ...newCompany,
                                      countries: newCompany.countries.filter((_, i) => i !== index)
                                    });
                                  }}
                                  className="ml-2 hover:text-red-600"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Press Enter or click + to add countries. Click × to remove.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newCompany.website}
                          onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newCompany.description}
                        onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                        placeholder="Brief description of the company..."
                        rows={3}
                      />
                    </div>

                    {/* Company Logo Upload */}
                    <div>
                      <Label htmlFor="logo">Company Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                      <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const previewUrl = URL.createObjectURL(file);
                                setNewCompany({...newCompany, logo: file, logo_url: previewUrl});
                              }
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        {newCompany.logo_url && (
                          <div className="max-w-32 max-h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={newCompany.logo_url} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 200x200px. Supported formats: JPG, PNG, GIF
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Select value={newCompany.size} onValueChange={(value) => setNewCompany({...newCompany, size: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-10 employees)</SelectItem>
                          <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                          <SelectItem value="large">Large (51-200 employees)</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Role and Position */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Your Role *</Label>
                        <Select value={newCompany.role} onValueChange={(value) => setNewCompany({...newCompany, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner/Founder</SelectItem>
                            <SelectItem value="executive">Executive/CEO</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="consultant">Consultant</SelectItem>
                            <SelectItem value="advisor">Advisor</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="position">Position/Title *</Label>
                        <Input
                          id="position"
                          value={newCompany.position}
                          onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                          placeholder="e.g., CEO, Manager, Consultant"
                        />
                      </div>
                    </div>
                    {/* Error feedback */}
                    {addCompanyError && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <AlertDescription>{addCompanyError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Role and Position */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Your Role *</Label>
                    <Select value={newCompany.role} onValueChange={(value) => setNewCompany({...newCompany, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner/Founder</SelectItem>
                        <SelectItem value="executive">Executive/CEO</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="advisor">Advisor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position/Title *</Label>
                    <Input
                      id="position"
                      value={newCompany.position}
                      onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                      placeholder="e.g., CEO, Manager, Consultant"
                    />
                  </div>
                </div>
                {/* Error feedback */}
                {addCompanyError && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <AlertDescription>{addCompanyError}</AlertDescription>
                  </Alert>
                )}
              </div>
              </div>

              <DialogFooter className="flex-shrink-0">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCompany}
                  disabled={isAddingCompany || (!isNewCompany && !selectedCompany) || (isNewCompany && (!newCompany.name || !newCompany.industry || !newCompany.location)) || !newCompany.role || !newCompany.position}
                >
                  {isAddingCompany ? <span className="flex items-center"><span className="loader mr-2"></span>Adding...</span> : "Add Company"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Companies */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">Your Company Associations</h2>
          
          {userCompanies.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">No companies yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your company associations to connect with the Shared Wealth network.
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Company
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCompanies.map((userCompany) => (
                <Card key={userCompany.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-navy">{userCompany.company_name}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Award className="w-4 h-4 mr-1" />
                          {userCompany.role} • {userCompany.position}
                        </CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(userCompany.status)}`}>
                        {userCompany.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">

                      <div className="text-sm text-muted-foreground">
                        Added {new Date(userCompany.created_at).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveCompany(userCompany.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Network Statistics */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-navy" />
              </div>
              <div className="text-2xl font-bold text-navy mb-2">{userCompanies.length}</div>
              <div className="text-sm text-muted-foreground">Your Companies</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <div className="text-2xl font-bold text-navy mb-2">
                {userCompanies.filter(c => c.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Approved Companies</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-navy" />
              </div>
              <div className="text-2xl font-bold text-navy mb-2">{networkCompanies.length}</div>
              <div className="text-sm text-muted-foreground">Network Companies</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Companies; 