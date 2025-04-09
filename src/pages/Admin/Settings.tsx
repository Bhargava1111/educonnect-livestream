
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Bell,
  Shield,
  Lock,
  CreditCard,
  Globe,
  Database,
  FileText,
  Save
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Career Aspire',
    adminEmail: 'admin@careeraspire.com',
    supportEmail: 'support@careeraspire.com',
    contactPhone: '+91 9876543210',
    address: '123 Education Street, Tech Park, Bangalore - 560001'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@careeraspire.com',
    smtpPassword: '••••••••••••',
    fromName: 'Career Aspire Academy',
    fromEmail: 'notifications@careeraspire.com'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmails: true,
    enableSMS: false,
    newEnrollmentAlert: true,
    newPaymentAlert: true,
    courseFeedbackAlert: true,
    adminLoginAlert: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'INR',
    razorpayKeyId: 'rzp_test_••••••••••••',
    razorpayKeySecret: '••••••••••••••••••••••••••',
    enableTestMode: true,
    autoGenerateInvoice: true,
    successPage: '/payment-success',
    cancelPage: '/payment-failed'
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationToggle = (name: string) => {
    setNotificationSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentToggle = (name: string) => {
    setPaymentSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };
  
  const handlePaymentSelectChange = (name: string, value: string) => {
    setPaymentSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const saveSettings = (type: string) => {
    // In a real app, you'd save these settings to a database
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: `${type} settings have been updated successfully.`
      });
    }, 500);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic information about your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    name="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => saveSettings('General')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Setup email delivery settings for notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    value={emailSettings.fromName}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-600">
                  <strong>Note:</strong> After saving these settings, you should send a test email to verify your configuration.
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">Send Test Email</Button>
                <Button onClick={() => saveSettings('Email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableEmails">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="enableEmails"
                    checked={notificationSettings.enableEmails}
                    onCheckedChange={() => handleNotificationToggle('enableEmails')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableSMS">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications via SMS (additional charges may apply)
                    </p>
                  </div>
                  <Switch
                    id="enableSMS"
                    checked={notificationSettings.enableSMS}
                    onCheckedChange={() => handleNotificationToggle('enableSMS')}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium">Notification Events</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newEnrollmentAlert">New Enrollment</Label>
                    <p className="text-sm text-gray-500">
                      When a student enrolls in a course
                    </p>
                  </div>
                  <Switch
                    id="newEnrollmentAlert"
                    checked={notificationSettings.newEnrollmentAlert}
                    onCheckedChange={() => handleNotificationToggle('newEnrollmentAlert')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newPaymentAlert">New Payment</Label>
                    <p className="text-sm text-gray-500">
                      When a payment is received
                    </p>
                  </div>
                  <Switch
                    id="newPaymentAlert"
                    checked={notificationSettings.newPaymentAlert}
                    onCheckedChange={() => handleNotificationToggle('newPaymentAlert')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="courseFeedbackAlert">Course Feedback</Label>
                    <p className="text-sm text-gray-500">
                      When a student leaves feedback for a course
                    </p>
                  </div>
                  <Switch
                    id="courseFeedbackAlert"
                    checked={notificationSettings.courseFeedbackAlert}
                    onCheckedChange={() => handleNotificationToggle('courseFeedbackAlert')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="adminLoginAlert">Admin Login</Label>
                    <p className="text-sm text-gray-500">
                      When an admin account logs in
                    </p>
                  </div>
                  <Switch
                    id="adminLoginAlert"
                    checked={notificationSettings.adminLoginAlert}
                    onCheckedChange={() => handleNotificationToggle('adminLoginAlert')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => saveSettings('Notification')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure your payment gateway and related settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={paymentSettings.currency}
                    onValueChange={(value) => handlePaymentSelectChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="enableTestMode" className="block mb-6">Test Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTestMode"
                      checked={paymentSettings.enableTestMode}
                      onCheckedChange={() => handlePaymentToggle('enableTestMode')}
                    />
                    <Label htmlFor="enableTestMode">Enable test mode</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <Input
                    id="razorpayKeyId"
                    name="razorpayKeyId"
                    value={paymentSettings.razorpayKeyId}
                    onChange={handlePaymentChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                  <Input
                    id="razorpayKeySecret"
                    name="razorpayKeySecret"
                    type="password"
                    value={paymentSettings.razorpayKeySecret}
                    onChange={handlePaymentChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="successPage">Success Redirect URL</Label>
                  <Input
                    id="successPage"
                    name="successPage"
                    value={paymentSettings.successPage}
                    onChange={handlePaymentChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancelPage">Cancel Redirect URL</Label>
                  <Input
                    id="cancelPage"
                    name="cancelPage"
                    value={paymentSettings.cancelPage}
                    onChange={handlePaymentChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoGenerateInvoice"
                      checked={paymentSettings.autoGenerateInvoice}
                      onCheckedChange={() => handlePaymentToggle('autoGenerateInvoice')}
                    />
                    <Label htmlFor="autoGenerateInvoice">
                      Automatically generate invoice PDF after successful payment
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => saveSettings('Payment')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="minPasswordLength" defaultChecked />
                    <Label htmlFor="minPasswordLength">
                      Require minimum password length (8 characters)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="requireUppercase" defaultChecked />
                    <Label htmlFor="requireUppercase">
                      Require at least one uppercase letter
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="requireNumber" defaultChecked />
                    <Label htmlFor="requireNumber">
                      Require at least one number
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="requireSpecialChar" />
                    <Label htmlFor="requireSpecialChar">
                      Require at least one special character
                    </Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactorAuth" />
                    <Label htmlFor="twoFactorAuth">
                      Enable Two-Factor Authentication for admin accounts
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="accountLockout" defaultChecked />
                    <Label htmlFor="accountLockout">
                      Lock account after 5 failed login attempts
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="sessionTimeout" defaultChecked />
                    <Label htmlFor="sessionTimeout">
                      Automatically log out after 30 minutes of inactivity
                    </Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Protection</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="dataMasking" defaultChecked />
                    <Label htmlFor="dataMasking">
                      Mask sensitive information in logs and reports
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="dataEncryption" defaultChecked />
                    <Label htmlFor="dataEncryption">
                      Encrypt sensitive data at rest
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => saveSettings('Security')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
