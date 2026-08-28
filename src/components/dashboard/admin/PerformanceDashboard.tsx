"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, Clock, AlertTriangle, TrendingUp, Zap, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";

interface PerformanceMetrics {
  totalSessions: number;
  avgSessionDuration: number;
  avgPageLoadTime: number;
  avgFCP: number;
  avgLCP: number;
  totalErrors: number;
  totalInteractions: number;
}

interface DailyMetrics {
  date: string;
  sessions: number;
  avgSessionDuration: number;
  avgPageLoadTime: number;
  avgFCP: number;
  avgLCP: number;
  errors: number;
  interactions: number;
}

export default function PerformanceDashboard() {
  const { summary } = useAdmin();
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dailyData, setDailyData] = useState<DailyMetrics[]>([]);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics/performance?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.summary) {
        setMetrics(data.summary);
        setDailyData(data.dailyBreakdown || []);
      }
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const getPerformanceGrade = (fcp: number, lcp: number) => {
    if (fcp <= 1800 && lcp <= 2500) return { grade: 'A', color: 'text-primary', bgColor: 'bg-primary/10' };
    if (fcp <= 3000 && lcp <= 4000) return { grade: 'B', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { grade: 'C', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">পারফরম্যান্স ডেটা পাওয়া যায়নি</p>
      </div>
    );
  }

  const performanceGrade = getPerformanceGrade(metrics.avgFCP, metrics.avgLCP);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">পারফরম্যান্স মনিটরিং</h2>
          <p className="text-muted-foreground">ওয়েবসাইটের পারফরম্যান্স মেট্রিক্স ও ব্যবহারকারী অভিজ্ঞতা</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">১ দিন</SelectItem>
              <SelectItem value="7d">৭ দিন</SelectItem>
              <SelectItem value="30d">৩০ দিন</SelectItem>
              <SelectItem value="90d">৯০ দিন</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPerformanceData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            রিফ্রেশ
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">পেজ লোড টাইম</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgPageLoadTime}ms</div>
            <Badge variant={metrics.avgPageLoadTime < 3000 ? "default" : "destructive"} className="mt-1">
              {metrics.avgPageLoadTime < 3000 ? "ভাল" : "ধীর"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCP (First Contentful Paint)</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgFCP}ms</div>
            <Badge className={`mt-1 ${performanceGrade.bgColor} ${performanceGrade.color}`}>
              {performanceGrade.grade}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LCP (Largest Contentful Paint)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgLCP}ms</div>
            <Badge className={`mt-1 ${performanceGrade.bgColor} ${performanceGrade.color}`}>
              {performanceGrade.grade}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সেশন ডিউরেশন</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.avgSessionDuration / 1000)}s</div>
            <p className="text-xs text-muted-foreground">গড় সেশন সময়</p>
          </CardContent>
        </Card>
      </div>

      {/* Session Analytics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট সেশন</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">মোট সেশন সংখ্যা</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ইন্টারঅ্যাকশন</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalInteractions}</div>
            <p className="text-xs text-muted-foreground">ব্যবহারকারী ইন্টারঅ্যাকশন</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট এরর</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalErrors}</div>
            <Badge variant={metrics.totalErrors === 0 ? "default" : "destructive"} className="mt-1">
              {metrics.totalErrors === 0 ? "ক্লিন" : "সমস্যা আছে"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      {dailyData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>পারফরম্যান্স ট্রেন্ড</CardTitle>
              <CardDescription>দৈনিক পারফরম্যান্স মেট্রিক্স</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgPageLoadTime" stroke="#8884d8" name="পেজ লোড টাইম (ms)" />
                  <Line type="monotone" dataKey="avgFCP" stroke="#82ca9d" name="FCP (ms)" />
                  <Line type="monotone" dataKey="avgLCP" stroke="#ffc658" name="LCP (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>সেশন অ্যানালিটিক্স</CardTitle>
                <CardDescription>দৈনিক সেশন ও ইন্টারঅ্যাকশন</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#8884d8" name="সেশন" />
                    <Bar dataKey="interactions" fill="#82ca9d" name="ইন্টারঅ্যাকশন" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>এরর ট্রেন্ড</CardTitle>
                <CardDescription>দৈনিক এরর সংখ্যা</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef4444" name="এরর" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>পারফরম্যান্স সুপারিশ</CardTitle>
          <CardDescription>উন্নতির জন্য সুপারিশ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.avgPageLoadTime > 3000 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">পেজ লোড টাইম ধীর</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    পেজ লোড টাইম {metrics.avgPageLoadTime}ms যা আদর্শের চেয়ে বেশি। ইমেজ অপটিমাইজেশন ও ক্যাশিং ব্যবহার করুন।
                  </p>
                </div>
              </div>
            )}
            
            {metrics.avgFCP > 1800 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">FCP ধীর</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    First Contentful Paint {metrics.avgFCP}ms। সার্ভার রেসপন্স টাইম উন্নত করুন।
                  </p>
                </div>
              </div>
            )}
            
            {metrics.totalErrors > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">এরর রিপোর্ট</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {metrics.totalErrors}টি এরর রিপোর্ট হয়েছে। কনসোল চেক করুন এবং সমাধান করুন।
                  </p>
                </div>
              </div>
            )}
            
            {metrics.avgPageLoadTime <= 3000 && metrics.avgFCP <= 1800 && metrics.totalErrors === 0 && (
              <div className="flex items-start gap-3 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/20">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary dark:text-primary-foreground">চমৎকার পারফরম্যান্স</p>
                  <p className="text-sm text-primary dark:text-primary/80">
                    আপনার ওয়েবসাইটের পারফরম্যান্স চমৎকার। সব মেট্রিক্স আদর্শ পর্যায়ে আছে।
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}