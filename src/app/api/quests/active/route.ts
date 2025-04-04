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
    
    // In a real application, you would fetch quests from your database
    // For now, return placeholder data
    return NextResponse.json({
      success: true,
      quests: [
        {
          title: "Fix 3 citation issues",
          progress: 1,
          total: 3
        },
        {
          title: "Add 2 references to \"Artificial Intelligence\"",
          progress: 0,
          total: 2
        },
        {
          title: "Review edits on \"Democracy\"",
          progress: 1,
          total: 2
        }
      ]
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch quests';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}