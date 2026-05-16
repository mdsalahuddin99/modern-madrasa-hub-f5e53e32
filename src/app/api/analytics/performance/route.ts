import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Performance analytics endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      sessionId, 
      sessionDuration, 
      metrics, 
      interactionCount, 
      errorCount, 
      timestamp 
    } = body;

    // Validate required fields
    if (!sessionId || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Store analytics data in database
    const analyticsRecord = await prisma.performanceAnalytics.create({
      data: {
        sessionId,
        userId: session.user.id!,
        sessionDuration: sessionDuration || 0,
        pageLoadTime: metrics?.pageLoadTime || null,
        firstContentfulPaint: metrics?.firstContentfulPaint || null,
        largestContentfulPaint: metrics?.largestContentfulPaint || null,
        timeToInteractive: metrics?.timeToInteractive || null,
        totalBlockingTime: metrics?.totalBlockingTime || null,
        cumulativeLayoutShift: metrics?.cumulativeLayoutShift || null,
        interactionCount: interactionCount || 0,
        errorCount: errorCount || 0,
        userAgent: request.headers.get('user-agent') || null,
        timestamp: new Date(timestamp),
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: analyticsRecord.id 
    });

  } catch (error) {
    console.error("Performance analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Get analytics data (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const userId = searchParams.get('userId');

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    interface WhereClause {
      timestamp: {
        gte: Date;
        lte: Date;
      };
      userId?: string;
    }

    // Build where clause
    const whereClause: WhereClause = {
      timestamp: {
        gte: startDate,
        lte: now
      }
    };

    if (userId) {
      whereClause.userId = userId;
    }

    // Get analytics data
    const analytics = await prisma.performanceAnalytics.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 1000
    });

    // Calculate aggregated metrics
    const totalSessions = analytics.length;
    const avgSessionDuration = analytics.reduce((sum, record) => sum + record.sessionDuration, 0) / Math.max(1, totalSessions);
    const avgPageLoadTime = analytics.reduce((sum, record) => sum + (record.pageLoadTime || 0), 0) / Math.max(1, analytics.filter(r => r.pageLoadTime).length);
    const avgFCP = analytics.reduce((sum, record) => sum + (record.firstContentfulPaint || 0), 0) / Math.max(1, analytics.filter(r => r.firstContentfulPaint).length);
    const avgLCP = analytics.reduce((sum, record) => sum + (record.largestContentfulPaint || 0), 0) / Math.max(1, analytics.filter(r => r.largestContentfulPaint).length);
    const totalErrors = analytics.reduce((sum, record) => sum + record.errorCount, 0);
    const totalInteractions = analytics.reduce((sum, record) => sum + record.interactionCount, 0);

    // Get daily breakdown
    const dailyBreakdown = await prisma.performanceAnalytics.groupBy({
      by: ['timestamp'],
      where: whereClause,
      _avg: {
        sessionDuration: true,
        pageLoadTime: true,
        firstContentfulPaint: true,
        largestContentfulPaint: true,
        totalBlockingTime: true,
        cumulativeLayoutShift: true
      },
      _sum: {
        errorCount: true,
        interactionCount: true
      },
      _count: {
        sessionId: true
      }
    });

    return NextResponse.json({
      summary: {
        totalSessions,
        avgSessionDuration: Math.round(avgSessionDuration),
        avgPageLoadTime: Math.round(avgPageLoadTime),
        avgFCP: Math.round(avgFCP),
        avgLCP: Math.round(avgLCP),
        totalErrors,
        totalInteractions
      },
      dailyBreakdown: dailyBreakdown.map(day => ({
        date: day.timestamp,
        sessions: day._count.sessionId,
        avgSessionDuration: Math.round(day._avg.sessionDuration || 0),
        avgPageLoadTime: Math.round(day._avg.pageLoadTime || 0),
        avgFCP: Math.round(day._avg.firstContentfulPaint || 0),
        avgLCP: Math.round(day._avg.largestContentfulPaint || 0),
        totalBlockingTime: Math.round(day._avg.totalBlockingTime || 0),
        cumulativeLayoutShift: day._avg.cumulativeLayoutShift || 0,
        errors: day._sum.errorCount || 0,
        interactions: day._sum.interactionCount || 0
      })),
      rawData: analytics
    });

  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}