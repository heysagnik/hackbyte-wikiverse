import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // In a real application, you would fetch articles that need attention
    // For now, return placeholder data
    return NextResponse.json({
      success: true,
      articles: [
        {
          title: "Renewable Energy",
          issues: ["Citation needed", "Requires update"],
          priority: "high",
        },
        {
          title: "Artificial Intelligence",
          issues: ["Needs expansion"],
          priority: "medium",
        },
        {
          title: "Global Warming",
          issues: ["POV concerns", "Outdated statistics"],
          priority: "high",
        },
      ]
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch articles';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}