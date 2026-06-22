"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Building2, CreditCard, Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
import PerformanceDashboard from "./PerformanceDashboard";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalyticsData {
  monthlyGrowth: Array<{ month: string; users: number; madrasas: number; subscriptions: number }>;
  categoryDistribution: Array<{ name: string; value: number; color: string }>;
  subscriptionStatus: Array<{ status: string; count: number; percentage: number }>;
  userActivity: Array<{ date: string; active: number; new: number; returning: number }>;
  revenueTrends: Array<{ month: string; revenue: number; growth: number }>;
}

export default function AdminAnalytics() {
  const { summary, allMadrasas, allUsers, subscriptions } = useAdmin();
  const [timeRange, setTimeRange] = useState("6m");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock analytics data based on current data
  useEffect(() => {
    const generateAnalyticsData = () => {
      const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const currentMonth = new Date().getMonth();
      
      // Monthly growth data (last 6 months)
      const monthlyGrowth = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => ({
        month,
        users: Math.floor(allUsers.length * (0.8 + index * 0.1)),
        madrasas: Math.floor(allMadrasas.length * (0.9 + index * 0.05)),
        subscriptions: Math.floor(subscriptions.length * (0.7 + index * 0.15))
      }));

      // Category distribution (based on madrasa types)
      const categoryDistribution = [
        { name: 'কওমি মাদ্রাসা', value: Math.floor(allMadrasas.length * 0.6), color: '#0088FE' },
        { name: 'আলিয়া মাদ্রাসা', value: Math.floor(allMadrasas.length * 0.25), color: '#00C49F' },
        { name: 'এতিমখানা', value: Math.floor(allMadrasas.length * 0.1), color: '#FFBB28' },
        { name: 'নূরানি মাদ্রাসা', value: Math.floor(allMadrasas.length * 0.05), color: '#FF8042' }
      ];

      // Subscription status
      const subscriptionStatus = [
        { status: 'সক্রিয়', count: summary.activeSubscriptions, percentage: (summary.activeSubscriptions / Math.max(1, subscriptions.length)) * 100 },
        { status: 'অপেক্ষমাণ', count: summary.pendingSubscriptions, percentage: (summary.pendingSubscriptions / Math.max(1, subscriptions.length)) * 100 },
        { status: 'মেয়াদ উত্তীর্ণ', count: summary.expiredSubscriptions, percentage: (summary.expiredSubscriptions / Math.max(1, subscriptions.length)) * 100 },
        { status: 'প্রত্যাখ্যাত', count: summary.rejectedSubscriptions, percentage: (summary.rejectedSubscriptions / Math.max(1, subscriptions.length)) * 100 }
      ];

      // User activity (last 30 days)
      const userActivity = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
          active: Math.floor(Math.random() * 50) + 20,
          new: Math.floor(Math.random() * 10) + 2,
          returning: Math.floor(Math.random() * 40) + 15
        };
      });

      // Revenue trends (mock data)
      const revenueTrends = monthlyGrowth.map((item, index) => ({
        month: item.month,
        revenue: item.subscriptions * 500 + Math.floor(Math.random() * 1000),
        growth: index === 0 ? 0 : Math.floor(Math.random() * 20) - 5
      }));

      setAnalyticsData({
        monthlyGrowth,
        categoryDistribution,
        subscriptionStatus,
        userActivity,
        revenueTrends
      });
      setIsLoading(false);
    };

    generateAnalyticsData();
  }, [allUsers, allMadrasas, subscriptions, summary]);

  const exportToPDF = async () => {
    const element = document.getElementById('analytics-dashboard');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`admin-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div id="analytics-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">উন্নত বিশ্লেষণ</h1>
          <p className="text-muted-foreground">প্ল্যাটফর্মের বিস্তারিত পরিসংখ্যান ও প্রবণতি</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">১ মাস</SelectItem>
              <SelectItem value="3m">৩ মাস</SelectItem>
              <SelectItem value="6m">৬ মাস</SelectItem>
              <SelectItem value="1y">১ বছর</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            এক্সপোর্ট
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">সারসংক্ষেপ</TabsTrigger>
          <TabsTrigger value="growth">প্রবৃদ্ধি</TabsTrigger>
          <TabsTrigger value="users">ব্যবহারকারী</TabsTrigger>
          <TabsTrigger value="revenue">আয়</TabsTrigger>
          <TabsTrigger value="performance">পারফরম্যান্স</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">মোট মাদ্রাসা</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalMadrasas}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(summary.totalMadrasas * 0.1)}% গত মাসে
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সক্রিয় ব্যবহারকারী</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(summary.totalUsers * 0.15)}% গত মাসে
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সক্রিয় সাবস্ক্রিপশন</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.activeSubscriptions} সক্রিয়
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">মাসিক আয়</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{analyticsData.revenueTrends[analyticsData.revenueTrends.length - 1]?.revenue || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.revenueTrends[analyticsData.revenueTrends.length - 1]?.growth || 0}% গত মাসে
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>মাদ্রাসা বিভাজন</CardTitle>
                <CardDescription>মাদ্রাসার ধরন অনুযায়ী বিভাজন</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>সাবস্ক্রিপশন অবস্থা</CardTitle>
                <CardDescription>সাবস্ক্রিপশনের বর্তমান অবস্থা</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.subscriptionStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>মাসিক প্রবৃদ্ধি</CardTitle>
              <CardDescription>ব্যবহারকারী, মাদ্রাসা ও সাবস্ক্রিপশন প্রবৃদ্ধি</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="ব্যবহারকারী" />
                  <Line type="monotone" dataKey="madrasas" stroke="#82ca9d" name="মাদ্রাসা" />
                  <Line type="monotone" dataKey="subscriptions" stroke="#ffc658" name="সাবস্ক্রিপশন" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ব্যবহারকারী কার্যকলাপ</CardTitle>
              <CardDescription>গত ৩০ দিনের ব্যবহারকারী কার্যকলাপ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="active" stackId="1" stroke="#8884d8" fill="#8884d8" name="সক্রিয়" />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="নতুন" />
                  <Area type="monotone" dataKey="returning" stackId="1" stroke="#ffc658" fill="#ffc658" name="ফিরে আসা" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>আয় প্রবণতা</CardTitle>
              <CardDescription>মাসিক আয় ও প্রবৃদ্ধি হার</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="আয় (টাকা)" />
                  <Line type="monotone" dataKey="growth" stroke="#82ca9d" name="প্রবৃদ্ধি (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}