import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      console.debug('GET /community/updates - Authentication failed');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // In a real application, you would fetch community updates from your database
    // For now, return placeholder data
    return NextResponse.json({
      success: true,
      updates: [
        {
          username: "ArticleWizard",
          userInitial: "A",
          action: "completed a featured article on Climate Change",
          time: "1 hour ago"
        },
        {
          username: "ReferenceQueen",
          userInitial: "R",
          action: "fixed 15 citation issues on Science articles",
          time: "3 hours ago"
        }
      ]
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch community updates';
    console.error('GET /community/updates - Error:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}