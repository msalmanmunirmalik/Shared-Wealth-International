import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Shield,
  Heart,
  Users,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Building,
  Handshake,
  DollarSign,
  FileSignature
} from "lucide-react";

interface SocialLicenseAgreementProps {
  onAgreementSigned: (agreementData: AgreementData) => void;
  onCancel: () => void;
  companyName: string;
  companyData: CompanyData;
}

interface CompanyData {
  name: string;
  sector: string;
  country: string;
  description: string;
  applicant_role: string;
  applicant_position: string;
}

interface AgreementData {
  userSignature: string;
  agreementVersion: string;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
  companyName: string;
  representativeName: string;
}

const SocialLicenseAgreement: React.FC<SocialLicenseAgreementProps> = ({
  onAgreementSigned,
  onCancel,
  companyName,
  companyData
}) => {
  const { user } = useAuth();
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [hasUnderstoodTerms, setHasUnderstoodTerms] = useState(false);
  const [agreesToComply, setAgreesToComply] = useState(false);
  const [userSignature, setUserSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agreementVersion = "1.0";
  const currentDate = new Date().toISOString();
  const effectiveDate = new Date().toISOString().split('T')[0]; // Today's date
  const reviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 12 months from now

  // Auto-fill company representative name from user profile
  const representativeName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Company Representative';

  useEffect(() => {
    // Auto-fill the signature with the representative's name
    if (representativeName && !userSignature) {
      setUserSignature(representativeName);
    }
  }, [representativeName, userSignature]);

  const handleSubmit = async () => {
    if (!hasReadAgreement || !hasUnderstoodTerms || !agreesToComply || !userSignature.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user's IP address and user agent
      const ipAddress = await getClientIP();
      const userAgent = navigator.userAgent;

      const agreementData: AgreementData = {
        userSignature: userSignature.trim(),
        agreementVersion,
        signedAt: currentDate,
        ipAddress,
        userAgent,
        companyName,
        representativeName
      };

      onAgreementSigned(agreementData);
    } catch (error) {
      console.error('Error submitting agreement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    // Return a placeholder since IP fetching is blocked by CSP
    // In a production environment, this would be handled server-side
    return 'client-ip-placeholder';
  };

  const canSubmit = hasReadAgreement && hasUnderstoodTerms && agreesToComply && userSignature.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Shield className="w-12 h-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">SOCIAL LICENCE AGREEMENT</h1>
        </div>
        <p className="text-lg text-gray-600">
          Digital signing of the Social Licence Agreement for {companyName}
        </p>
        <Badge variant="secondary" className="mt-2">
          Version {agreementVersion} • Effective Date: {new Date(effectiveDate).toLocaleDateString()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Social Licence Agreement Terms & Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agreement Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">SOCIAL LICENCE AGREEMENT</h2>
            <p className="text-lg text-gray-700 mb-2">
              Between: <strong>Shared Wealth International Ltd</strong> and <strong>{companyName}</strong>
            </p>
            <p className="text-gray-600">
              Effective date: {new Date(effectiveDate).toLocaleDateString()} • Duration: 12 months
            </p>
          </div>

          {/* Agreement Content */}
          <div className="prose prose-gray max-w-none space-y-6 text-sm">
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">1. Purpose of the Licence</h3>
              <p className="text-gray-700 leading-relaxed">
                This Social Licence Agreement recognises that <strong>{companyName}</strong> is a Shared Wealth Enterprise 
                and as such is willing to join the International network of Shared Wealth enterprises also registered by 
                Social Licences by Shared Wealth International. The licence allows both organisations to share resources 
                and achieve common goals in both mutual development and the development of the Shared Wealth model.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">2. Guiding Values</h3>
              <p className="text-gray-700 mb-3">
                Both parties agree to operate in accordance with the Shared Wealth Values of:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Fair and ethical distribution of wealth</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Participation and inclusivity in decision making</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Transparency and mutual accountability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Handshake className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Reciprocity between enterprises and their stakeholders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 md:col-span-2">
                  <Globe className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Environmental and social responsibility</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">3. Shared Goals and Commitments</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">3.1 {companyName} commits to:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Supporting Shared Wealth International develop the Shared Wealth network, specifically by working on the website and platform.</li>
                    <li>Agrees to support where possible other members of the network</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800">3.2 Shared Wealth International commits to:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Supporting {companyName} develop its business specifically through a mentoring team led by Cliff Southcombe</li>
                    <li>Provide {companyName} without charge use of a virtual office at Falconhurst Robin Hoods Bay</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">4. Legal</h3>
              <p className="text-gray-700 leading-relaxed">
                As part of the Social Licence <strong>{representativeName}</strong> is appointed as a Director of Shared Wealth International Ltd 
                and will support Shared Wealth International through this role as appropriate in a voluntary capacity. 
                Shared Wealth International Ltd will issue {companyName} Founder shares and then consider {companyName} for development shares 
                in payment of contributions made to the Shared Wealth International throughout the year.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                {companyName} and Shared Wealth International will be able to use each other's logos on any document as appropriate 
                and with each other's agreement.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">5. Financial</h3>
              <p className="text-gray-700 leading-relaxed">
                {companyName} will be able to invoice Shared Wealth International for any work that is carried out where payment is agreed 
                and there is a contract drawn up which supplements this Social Licence Agreement.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">6. Review</h3>
              <p className="text-gray-700 leading-relaxed">
                After a period of twelve months from the signing of this Social Licence both parties will review this agreement. 
                Review date: <strong>{new Date(reviewDate).toLocaleDateString()}</strong>
              </p>
            </section>
          </div>

          {/* Company Information Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Agreement Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Company:</strong> {companyName}</p>
                <p><strong>Sector:</strong> {companyData.sector}</p>
                <p><strong>Country:</strong> {companyData.country}</p>
              </div>
              <div>
                <p><strong>Representative:</strong> {representativeName}</p>
                <p><strong>Role:</strong> {companyData.applicant_role}</p>
                <p><strong>Position:</strong> {companyData.applicant_position}</p>
              </div>
            </div>
          </div>

          {/* Agreement Checkboxes */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="read-agreement"
                checked={hasReadAgreement}
                onCheckedChange={(checked) => setHasReadAgreement(checked as boolean)}
              />
              <Label htmlFor="read-agreement" className="text-sm leading-relaxed">
                I have read and understood the complete Social Licence Agreement above
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="understood-terms"
                checked={hasUnderstoodTerms}
                onCheckedChange={(checked) => setHasUnderstoodTerms(checked as boolean)}
              />
              <Label htmlFor="understood-terms" className="text-sm leading-relaxed">
                I understand the commitments and requirements outlined in this agreement
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agree-comply"
                checked={agreesToComply}
                onCheckedChange={(checked) => setAgreesToComply(checked as boolean)}
              />
              <Label htmlFor="agree-comply" className="text-sm leading-relaxed">
                I agree to comply with all terms and conditions of this Social Licence Agreement
              </Label>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="space-y-3 border-t pt-6">
            <Label htmlFor="signature" className="text-sm font-medium">
              Digital Signature <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                id="signature"
                value={userSignature}
                onChange={(e) => setUserSignature(e.target.value)}
                placeholder="Enter your full name as digital signature"
                className="text-center text-lg font-semibold"
              />
              <p className="text-xs text-gray-500 text-center">
                By typing your name above, you are providing a digital signature equivalent to a handwritten signature.
                This signature will be automatically applied to the agreement upon submission.
              </p>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Legal Notice:</p>
                <p>
                  This agreement is legally binding and represents your company's commitment to the Shared Wealth International principles. 
                  By digitally signing this agreement, you confirm that you have the authority to bind {companyName} to these terms.
                  The agreement will be automatically signed and submitted upon completion.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Effective: {new Date(effectiveDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Review: {new Date(reviewDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Signed by: {userSignature || 'Not signed'}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Sign & Submit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer Information */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>
          This agreement is governed by the laws of the jurisdiction where Shared Wealth International operates. 
          For questions about this agreement, please contact our legal team.
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Shared Wealth International Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SocialLicenseAgreement;
