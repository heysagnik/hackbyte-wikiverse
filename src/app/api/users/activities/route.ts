import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Retrieve the server session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // In a real application, you would fetch activities from your database
    // For now, return placeholder data
    const activities = [
      {
        title: "Article edited: Climate Change",
        time: "2 hours ago",
        type: "edit",
      },
      {
        title: "New achievement: 5 edits milestone",
        time: "Yesterday",
        type: "achievement",
      },
      {
        title: "Comment on Talk:Renewable Energy",
        time: "3 days ago",
        type: "comment",
      },
    ];

    return NextResponse.json({ success: true, activities });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch activities';
    console.error('Error fetching activities:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}