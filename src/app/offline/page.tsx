"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl font-bold">ইন্টারনেট সংযোগ নেই</CardTitle>
          <CardDescription>
            আপনার ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">কিছু পরামর্শ:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ওয়াইফাই বা মোবাইল ডেটা চেক করুন</li>
              <li>• ফ্লাইট মোড বন্ধ আছে কিনা দেখুন</li>
              <li>• রাউটার বা মোডেম রিস্টার্ট করুন</li>
              <li>• পরে আবার চেষ্টা করুন</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleRetry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              আবার চেষ্টা করুন
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                হোম পেজ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}