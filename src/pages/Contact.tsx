
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would handle form submission with real data
    toast({
      title: "Message Sent",
      description: "We have received your message and will respond soon!",
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our courses or services? Contact us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-eduBlue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <address className="not-italic text-gray-600">
                        123 Learning Street<br />
                        Education City, EC 12345
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-eduBlue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-eduBlue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">info@educonnect.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="font-semibold mb-4">Office Hours</h3>
                  <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" placeholder="(123) 456-7890" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please provide details about your inquiry..." 
                      rows={5}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="bg-eduBlue-600 hover:bg-eduBlue-700">
                    Send Message
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Google Maps placeholder (would integrate actual Google Maps in production) */}
        <div className="mt-12 bg-gray-200 h-80 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Google Maps would be integrated here</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
