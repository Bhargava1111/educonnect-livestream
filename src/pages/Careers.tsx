
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';

const Careers = () => {
  const benefits = [
    "Professional growth and development opportunities",
    "Flexible work arrangements",
    "Competitive salary and benefits package",
    "Collaborative and innovative work environment",
    "Opportunity to make a difference in education",
    "Regular team building activities and events"
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Software Development Instructor",
      location: "Remote",
      type: "Full-time",
      category: "teaching",
      description: "Lead live online courses in software development topics including web, mobile, and cloud technologies."
    },
    {
      id: 2,
      title: "Data Science Instructor",
      location: "Remote",
      type: "Part-time",
      category: "teaching",
      description: "Teach advanced data science and machine learning concepts to intermediate and advanced students."
    },
    {
      id: 3,
      title: "Curriculum Developer",
      location: "Hybrid",
      type: "Full-time",
      category: "curriculum",
      description: "Design and develop comprehensive curriculum for software training courses."
    },
    {
      id: 4,
      title: "Student Support Specialist",
      location: "Remote",
      type: "Full-time",
      category: "support",
      description: "Provide technical and academic support to students enrolled in our online training programs."
    },
    {
      id: 5,
      title: "Technical Content Creator",
      location: "Remote",
      type: "Contract",
      category: "curriculum",
      description: "Create engaging technical content for courses including coding exercises, quizzes, and projects."
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Join Our Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Be part of our mission to empower students with the skills they need for successful technology careers.
          </p>
        </div>

        {/* Why Work With Us */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why Work With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-gray-700">
                At EduConnect, we're passionate about education and technology. We believe in creating an environment where both our team members and students can thrive and reach their full potential.
              </p>
              
              <p className="text-gray-700">
                Whether you're an experienced instructor, curriculum developer, or support specialist, joining our team means being part of an organization committed to excellence in education and innovation in teaching methods.
              </p>
              
              <div className="bg-eduBlue-50 p-6 rounded-lg border border-eduBlue-100">
                <h3 className="font-semibold text-lg mb-4">Benefits of Working at EduConnect</h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-eduBlue-600 mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Team image would appear here</p>
            </div>
          </div>
        </section>
        
        {/* Current Openings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Positions</TabsTrigger>
              <TabsTrigger value="teaching">Teaching</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            {["all", "teaching", "curriculum", "support"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                {jobOpenings
                  .filter(job => category === "all" || job.category === category)
                  .map(job => (
                    <Card key={job.id} className="card-hover">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                              <span className="mx-2">•</span>
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-eduBlue-50 text-eduBlue-700 border-eduBlue-200">
                            {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{job.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">Apply Now</Button>
                      </CardFooter>
                    </Card>
                  ))
                }
                
                {jobOpenings.filter(job => category === "all" || job.category === category).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No open positions in this category at the moment.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        {/* Application Process */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Application Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-12 w-12 bg-eduBlue-100 text-eduBlue-700 rounded-full flex items-center justify-center">1</div>
                <CardTitle>Submit Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Apply online with your resume and cover letter outlining your relevant experience and why you want to join EduConnect.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-12 w-12 bg-eduBlue-100 text-eduBlue-700 rounded-full flex items-center justify-center">2</div>
                <CardTitle>Interview Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Selected candidates will participate in interviews and may be asked to demonstrate their teaching ability or technical skills.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-12 w-12 bg-eduBlue-100 text-eduBlue-700 rounded-full flex items-center justify-center">3</div>
                <CardTitle>Welcome Aboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Successful candidates will receive an offer and join our team of passionate educators and technology professionals.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Don't See a Position That Fits?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always interested in connecting with talented individuals passionate about education and technology.
            </p>
            <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">
              Submit Open Application
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
