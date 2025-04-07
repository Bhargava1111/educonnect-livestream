
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { contactDetails } from "@/lib/contactService";

interface ContactDetailsState {
  email: {
    info: string;
    support: string;
  };
  phone: {
    primary: string;
    secondary: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

const CONTACT_STORAGE_KEY = 'career_aspire_contact_details';

const AdminContact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactDetailsState>({
    email: { info: '', support: '' },
    phone: { primary: '', secondary: '' },
    address: { line1: '', line2: '', city: '', state: '', pincode: '' },
    social: { facebook: '', twitter: '', linkedin: '', instagram: '' }
  });
  
  useEffect(() => {
    // Load contact details from localStorage or use the default ones
    const savedDetails = localStorage.getItem(CONTACT_STORAGE_KEY);
    
    if (savedDetails) {
      setFormData(JSON.parse(savedDetails));
    } else {
      setFormData(contactDetails);
    }
  }, []);
  
  const handleSimpleInputChange = (category: keyof ContactDetailsState, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  const saveContactDetails = () => {
    try {
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(formData));
      
      toast({
        title: "Contact Details Updated",
        description: "Contact information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact details. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Contact Information</h1>
        <p className="text-gray-500">Update your organization's contact details that will be displayed throughout the website.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="info-email">Info Email</Label>
              <Input
                id="info-email"
                value={formData.email.info}
                onChange={(e) => handleSimpleInputChange('email', 'info', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                value={formData.email.support}
                onChange={(e) => handleSimpleInputChange('email', 'support', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-phone">Primary Phone</Label>
              <Input
                id="primary-phone"
                value={formData.phone.primary}
                onChange={(e) => handleSimpleInputChange('phone', 'primary', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-phone">Secondary Phone</Label>
              <Input
                id="secondary-phone"
                value={formData.phone.secondary}
                onChange={(e) => handleSimpleInputChange('phone', 'secondary', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address-line1">Address Line 1</Label>
              <Input
                id="address-line1"
                value={formData.address.line1}
                onChange={(e) => handleSimpleInputChange('address', 'line1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-line2">Address Line 2</Label>
              <Input
                id="address-line2"
                value={formData.address.line2}
                onChange={(e) => handleSimpleInputChange('address', 'line2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleSimpleInputChange('address', 'city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleSimpleInputChange('address', 'state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) => handleSimpleInputChange('address', 'pincode', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social.facebook}
                  onChange={(e) => handleSimpleInputChange('social', 'facebook', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social.twitter}
                  onChange={(e) => handleSimpleInputChange('social', 'twitter', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social.linkedin}
                  onChange={(e) => handleSimpleInputChange('social', 'linkedin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social.instagram}
                  onChange={(e) => handleSimpleInputChange('social', 'instagram', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={saveContactDetails}>
          Save Contact Details
        </Button>
      </div>
    </div>
  );
};

export default AdminContact;
