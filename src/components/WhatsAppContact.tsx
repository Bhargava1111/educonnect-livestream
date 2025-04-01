
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { WhatsApp } from 'lucide-react';

const WhatsAppContact = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber === '+91') {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Format the phone number (remove spaces and special characters)
    const formattedNumber = phoneNumber.replace(/\s+/g, '').replace(/[()-]/g, '');
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in your courses.");
    
    // Generate WhatsApp API URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecting to WhatsApp",
      description: "Connecting you with our support team.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <WhatsApp className="mr-2" size={20} />
          Connect via WhatsApp
        </CardTitle>
        <CardDescription>
          Send us a message directly on WhatsApp for quick assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input 
              id="phone-number" 
              placeholder="+91 98765 43210" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea 
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full">
            <WhatsApp className="mr-2" size={16} />
            Connect on WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppContact;
