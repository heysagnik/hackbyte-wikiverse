import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Quest from '@/models/Quest';
import User from '@/models/User';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Extract the ID parameter safely
    const questId = context.params.id;
    
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    await connectToDatabase();
    
    // Validate that the ID is in the correct format
    if (!mongoose.isValidObjectId(questId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid quest ID format' },
        { status: 400 }
      );
    }

    // Fetch the quest with all its questions and learning content
    const questResult = await Quest.findById(questId).lean();
    const quest = Array.isArray(questResult) ? questResult[0] : questResult;
    
    if (!quest) {
      return NextResponse.json(
        { success: false, message: 'Quest not found' },
        { status: 404 }
      );
    }

    // Fetch user progress for this quest if needed
    const userEmail = session.user.email;
    const userProgress = await User.findOne(
      { email: userEmail },
      { 'progress.quests': { $elemMatch: { questId } } }
    ).lean();

    return NextResponse.json({
      success: true,
      quest,
      questions: quest.questions || [],
      learningContent: quest.learningContent || {},
      userProgress: Array.isArray(userProgress)
        ? userProgress[0]?.progress?.quests?.[0] || null
        : userProgress?.progress?.quests?.[0] || null
    });
    
  } catch (error) {
    console.error('Error fetching quest:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch quest details';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

// Add completion endpoint to handle quest completion and scoring
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Extract the ID parameter safely
    const questId = context.params.id;
    
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { score, totalPossible, taskId } = await request.json();
    
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get user
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get quest to calculate XP
    let quest = await Quest.findById(questId).lean();
    if (Array.isArray(quest)) {
      quest = quest[0];
    }
    if (!quest) {
      return NextResponse.json(
        { success: false, message: 'Quest not found' },
        { status: 404 }
      );
    }
    
    // Calculate earned XP based on score percentage
    const scorePercentage = totalPossible > 0 ? score / totalPossible : 0;
    const earnedXP = Math.round(scorePercentage * quest.xpReward);
    
    // Update user progress
    // Check if quest is already in progress array
    const questProgressIndex = user.progress?.quests?.findIndex(
      (q: any) => q.questId.toString() === questId
    );
    
    if (questProgressIndex > -1) {
      // Update existing progress
      user.progress.quests[questProgressIndex].completed = true;
      user.progress.quests[questProgressIndex].score = score;
      user.progress.quests[questProgressIndex].earnedXP = earnedXP;
      
      // Mark specific task as completed
      if (taskId) {
        const taskIndex = user.progress.quests[questProgressIndex].tasks.findIndex(
          (t: any) => t.taskId.toString() === taskId
        );
        
        if (taskIndex > -1) {
          user.progress.quests[questProgressIndex].tasks[taskIndex].completed = true;
        }
      }
    } else {
      // Add new quest progress
      if (!user.progress) {
        user.progress = { quests: [] };
      }
      
      user.progress.quests.push({
        questId,
        completed: true,
        score,
        earnedXP,
        completedAt: new Date(),
        tasks: taskId ? [{ taskId, completed: true }] : []
      });
    }
    
    // Update user total XP
    user.totalXP = (user.totalXP || 0) + earnedXP;
    
    // Save user changes
    await user.save();
    
    return NextResponse.json({
      success: true,
      earnedXP,
      totalXP: user.totalXP,
      message: 'Quest progress updated'
    });
    
  } catch (error) {
    console.error('Error updating quest progress:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to update quest progress';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}