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
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  sector: string; // Match database schema
  country: string; // Match database schema
  description: string;
  employees: number; // Match database schema
  shared_value: string; // Match database schema
  status: string;
  website: string; // Match database schema
  logo: string | null;
  highlights: string[] | null;
  location: string | null;
  impact_score: number | null;
  joined_date: string | null;
  is_shared_wealth_licensed: boolean;
  license_number: string | null;
  license_date: string | null;
}

interface UserCompany {
  id: string;
  user_id: string;
  company_id?: string;
  company_name: string;
  role: string;
  position: string;
  is_shared_wealth_licensed: boolean;
  license_number?: string;
  license_date?: string;
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
    sector: "", // Match database schema
    country: "", // Match database schema
    description: "",
    website: "", // Match database schema
    employees: "", // Match database schema
    isSharedWealthLicensed: false,
    licenseNumber: "",
    licenseDate: "",
    role: "",
    position: ""
  });

  useEffect(() => {
    loadUserCompanies();
    loadNetworkCompanies();
  }, []);

  const loadUserCompanies = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our UserCompany interface
      const userCompanies: UserCompany[] = (data || []).map(company => ({
        id: company.id,
        user_id: company.user_id,
        company_id: company.company_id,
        company_name: company.company_name,
        role: company.role,
        position: company.position,
        is_shared_wealth_licensed: company.is_shared_wealth_licensed,
        license_number: company.license_number,
        license_date: company.license_date,
        status: company.status as "pending" | "approved" | "rejected",
        created_at: company.created_at
      }));
      
      setUserCompanies(userCompanies);
    } catch (error) {
      console.error('Error loading user companies:', error);
    }
  };

  // Fallback companies data (same as in Network.tsx)
  const fallbackCompanies: Company[] = [
    {
      id: "1",
      name: "Shared Wealth International Ltd",
      sector: "Social Enterprise, Equitable Finance",
      country: "United Kingdom",
      description: "The overarching entity driving the Shared Wealth model globally. Core Shared Wealth Model implementation with global partnerships and strategic development.",
      employees: 50,
      shared_value: "5",
      status: "Core Entity",
      website: "https://sharedwealth.net",
      logo: null,
      highlights: null,
      location: "United Kingdom",
      impact_score: 95,
      joined_date: "2023-01-01",
      is_shared_wealth_licensed: true,
      license_number: "L-001",
      license_date: "2023-01-01"
    },
    {
      id: "2",
      name: "SEi Caledonia Ltd",
      sector: "Social Enterprise, Regional Development",
      country: "United Kingdom",
      description: "Supports political engagement and JV exploration for Pathway in Scotland. Regional development focused on Scottish market.",
      employees: 15,
      shared_value: "0.75",
      status: "Regional Partner",
      website: "https://seicaledonia.com",
      logo: null,
      highlights: null,
      location: "United Kingdom",
      impact_score: 88,
      joined_date: "2023-02-15",
      is_shared_wealth_licensed: false,
      license_number: null,
      license_date: null
    },
    // ... (add the rest of the 19 companies from Network.tsx here) ...
  ];

  const loadNetworkCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('network_companies')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Database error:', error);
        setNetworkCompanies(fallbackCompanies);
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setNetworkCompanies(fallbackCompanies);
        setIsLoading(false);
        return;
      }

      const companies: Company[] = data.map((company: any) => ({
        id: company.id,
        name: company.name,
        sector: company.sector || '',
        country: company.country || '',
        description: company.description || '',
        employees: company.employees || 0,
        shared_value: company.shared_value || '0',
        status: company.status || 'active',
        website: company.website || '',
        logo: company.logo || null,
        highlights: company.highlights || null,
        location: company.location || null,
        impact_score: company.impact_score || null,
        joined_date: company.joined_date || null,
        is_shared_wealth_licensed: company.is_shared_wealth_licensed || false,
        license_number: company.license_number || null,
        license_date: company.license_date || null
      }));

      setNetworkCompanies(companies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading network companies:', error);
      setNetworkCompanies(fallbackCompanies);
      setIsLoading(false);
    }
  };

  // 1. Robust search filter
  const filteredNetworkCompanies = networkCompanies.filter(company =>
    (company.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (company.sector?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Error state for add company
  const [addCompanyError, setAddCompanyError] = useState<string | null>(null);

  const handleAddCompany = async () => {
    if (!user) return;
    setAddCompanyError(null);
    try {
      setIsAddingCompany(true);

      // Insert into company_applications table
      const { error } = await supabase
        .from('company_applications')
        .insert({
          user_id: user.id,
          company_name: newCompany.name,
          sector: newCompany.sector,
          country: newCompany.country,
          description: newCompany.description,
          website: newCompany.website,
          employees: newCompany.employees ? parseInt(newCompany.employees) : null,
          is_shared_wealth_licensed: newCompany.isSharedWealthLicensed,
          license_number: newCompany.licenseNumber || null,
          license_date: newCompany.licenseDate || null,
          applicant_role: newCompany.role,
          applicant_position: newCompany.position,
          status: 'pending'
        });

      if (error) throw error;

      setShowAddDialog(false);
      setIsAddingCompany(false);
      setNewCompany({
        name: "",
        sector: "",
        country: "",
        description: "",
        website: "",
        employees: "",
        isSharedWealthLicensed: false,
        licenseNumber: "",
        licenseDate: "",
        role: "",
        position: ""
      });
      // Show a success message (could use a toast or alert)
      alert('Your company application has been submitted and is pending review.');
    } catch (error: any) {
      setAddCompanyError(error.message || 'Failed to submit application.');
      setIsAddingCompany(false);
    }
  };

  const handleRemoveCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('user_companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Company Association</DialogTitle>
                <DialogDescription>
                  Connect with an existing network company or add a new one
                </DialogDescription>
              </DialogHeader>

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
                                  <p className="text-sm text-muted-foreground">{company.sector}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {company.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      <MapPin className="w-3 h-3 inline mr-1" />
                                      {company.country}
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
                        <Label htmlFor="sector">Industry</Label>
                        <Input
                          id="sector"
                          value={newCompany.sector}
                          onChange={(e) => setNewCompany({...newCompany, sector: e.target.value})}
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Location</Label>
                        <Input
                          id="country"
                          value={newCompany.country}
                          onChange={(e) => setNewCompany({...newCompany, country: e.target.value})}
                          placeholder="Enter country"
                        />
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

                    <div>
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={newCompany.employees}
                        onChange={(e) => setNewCompany({...newCompany, employees: e.target.value})}
                        placeholder="e.g., 50"
                      />
                    </div>

                    {/* Shared Wealth License Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <Label className="text-base font-semibold text-blue-900">Shared Wealth License</Label>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isLicensed"
                            checked={newCompany.isSharedWealthLicensed}
                            onChange={(e) => setNewCompany({...newCompany, isSharedWealthLicensed: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="isLicensed" className="text-sm">
                            This company is a Shared Wealth Licensed company
                          </Label>
                        </div>

                        {newCompany.isSharedWealthLicensed && (
                          <div className="space-y-3 pl-6">
                            <Alert>
                              <AlertCircle className="w-4 h-4" />
                              <AlertDescription>
                                Licensed companies will be reviewed and may be added to our public network directory.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="licenseNumber">License Number</Label>
                                <Input
                                  id="licenseNumber"
                                  value={newCompany.licenseNumber}
                                  onChange={(e) => setNewCompany({...newCompany, licenseNumber: e.target.value})}
                                  placeholder="Enter license number"
                                />
                              </div>
                              <div>
                                <Label htmlFor="licenseDate">License Date</Label>
                                <Input
                                  id="licenseDate"
                                  type="date"
                                  value={newCompany.licenseDate}
                                  onChange={(e) => setNewCompany({...newCompany, licenseDate: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCompany}
                  disabled={isAddingCompany || (!isNewCompany && !selectedCompany) || (isNewCompany && (!newCompany.name || !newCompany.sector || !newCompany.country)) || !newCompany.role || !newCompany.position}
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
                      {userCompany.is_shared_wealth_licensed && (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Shared Wealth Licensed</span>
                        </div>
                      )}
                      
                      {userCompany.license_number && (
                        <div className="text-sm">
                          <span className="font-medium">License:</span> {userCompany.license_number}
                        </div>
                      )}

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
                {userCompanies.filter(c => c.is_shared_wealth_licensed).length}
              </div>
              <div className="text-sm text-muted-foreground">Licensed Companies</div>
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