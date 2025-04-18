
// Form submission tracking and contact details

export const trackFormSubmission = (formData: any): void => {
  const formSubmissions = localStorage.getItem('career_aspire_form_submissions') || '[]';
  const submissions = JSON.parse(formSubmissions);
  
  submissions.push({
    ...formData,
    timestamp: new Date().toISOString(),
    triggered: true,
    sentTo: 'info@careeraspiretechnology.com'
  });
  
  localStorage.setItem('career_aspire_form_submissions', JSON.stringify(submissions));
  
  console.log(`Form submission received and sent to info@careeraspiretechnology.com`);
  console.log(`Form data:`, JSON.stringify(formData, null, 2));
  
  // In a real production environment, this would call an API endpoint to send an email
  // For now, we're simulating the behavior
};

// Default contact details for the website
const defaultContactDetails = {
  email: {
    info: "info@careeraspiretechnology.com",
    support: "support@careeraspiretechnology.com"
  },
  phone: {
    primary: "+91 9390872628",
    secondary: "+91 8765 432 101"
  },
  address: {
    line1: "Career Aspire Technology",
    line2: "123, Tech Park, Sector 15",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001"
  },
  social: {
    facebook: "https://facebook.com/careeraspiretechnology",
    twitter: "https://twitter.com/careeraspiretech",
    linkedin: "https://linkedin.com/company/careeraspiretechnology",
    instagram: "https://instagram.com/careeraspiretechnology",
    whatsapp: "9390872628"
  }
};

// Get the current contact details
export const getContactDetails = () => {
  const savedDetails = localStorage.getItem('career_aspire_contact_details');
  if (savedDetails) {
    return JSON.parse(savedDetails);
  }
  return defaultContactDetails;
};

// Export the contact details
export const contactDetails = getContactDetails();
