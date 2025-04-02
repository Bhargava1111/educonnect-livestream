
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmission, contactDetails } from "@/lib/courseManagement";
import WhatsAppContact from '@/components/WhatsAppContact';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission
    try {
      trackFormSubmission({
        ...formData,
        source: 'contact_page',
        submittedAt: new Date()
      });

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Have questions about our courses or need assistance? Reach out to us using any of the methods below.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-eduBlue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Phone className="text-eduBlue-600" />
            </div>
            <CardTitle className="mt-2">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              <a href={`tel:${contactDetails.phone.primary}`} className="hover:text-eduBlue-600">
                {contactDetails.phone.primary}
              </a>
            </p>
            <p className="text-gray-600">
              <a href={`tel:${contactDetails.phone.secondary}`} className="hover:text-eduBlue-600">
                {contactDetails.phone.secondary}
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-eduBlue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Mail className="text-eduBlue-600" />
            </div>
            <CardTitle className="mt-2">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              <a href={`mailto:${contactDetails.email.info}`} className="hover:text-eduBlue-600">
                {contactDetails.email.info}
              </a>
            </p>
            <p className="text-gray-600">
              <a href={`mailto:${contactDetails.email.support}`} className="hover:text-eduBlue-600">
                {contactDetails.email.support}
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-eduBlue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <MapPin className="text-eduBlue-600" />
            </div>
            <CardTitle className="mt-2">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {contactDetails.address.line1},<br />
              {contactDetails.address.line2},<br />
              {contactDetails.address.city}, {contactDetails.address.state} - {contactDetails.address.pincode}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Tell us what you need help with..."
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <WhatsAppContact />
      </div>
    </div>
  );
};

export default Contact;
