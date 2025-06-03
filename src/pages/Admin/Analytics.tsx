
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentAnalyticsDashboard from '@/components/admin/analytics/PaymentAnalyticsDashboard';
import StudentAnalyticsDashboard from '@/components/admin/analytics/StudentAnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive insights into payments, students, courses, and system performance
        </p>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <PaymentAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="students">
          <StudentAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="courses">
          <div className="text-center py-8">
            <p className="text-gray-500">Course analytics dashboard coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="text-center py-8">
            <p className="text-gray-500">System analytics dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
