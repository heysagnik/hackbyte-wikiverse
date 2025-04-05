import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Quest from '@/models/Quest';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questId = params.id;
    console.log(`[DEBUG] Quest ID: ${questId}`);

    const session = await getServerSession();
    console.log(
      `[DEBUG] Session obtained:`,
      session ? { user: session.user } : null
    );

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    if (!mongoose.isValidObjectId(questId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid quest ID format' },
        { status: 400 }
      );
    }

    const questResult = await Quest.findById(questId).lean();
    const quest = Array.isArray(questResult)
      ? questResult[0]
      : questResult;

    if (!quest) {
      return NextResponse.json(
        { success: false, message: 'Quest not found' },
        { status: 404 }
      );
    }

    const userEmail = session.user.email;
    const userData = await User.findOne(
      { email: userEmail },
      { 'progress.quests': 1 }
    ).lean() as { progress?: { quests?: any[] } } | null;

    const userProgress =
      userData?.progress?.quests?.find(
        (q: any) =>
          q.questId && q.questId.toString() === questId
      ) || null;

    return NextResponse.json({
      success: true,
      quest,
      questions: quest.questions || [],
      learningContent: quest.learningContent || {},
      userProgress,
    });
  } catch (error) {
    console.error('[ERROR] Error fetching quest:', error);
    const errMsg =
      error instanceof Error ? error.message : 'Failed to fetch quest details';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        const questId = params.id;
        console.log(`[DEBUG] Quest ID: ${questId}`);
        
        const session = await getServerSession();
        console.log(`[DEBUG] Session obtained:`, session ? { user: session.user } : null);
        
        if (!session || !session.user) {
            console.log(`[WARN] User is not authenticated`);
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }
        
        const { score, totalPossible, taskId } = await request.json();
        console.log(`[DEBUG] Received score: ${score}, totalPossible: ${totalPossible}, taskId: ${taskId}`);
        
        console.log(`[DEBUG] Connecting to MongoDB...`);
        await connectToDatabase();
        console.log(`[DEBUG] Connected to MongoDB`);
        
        const userEmail = session.user.email;
        console.log(`[DEBUG] Finding user by email: ${userEmail}`);
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            console.log(`[WARN] User not found with email: ${userEmail}`);
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        
        console.log(`[DEBUG] Finding quest with ID: ${questId}`);
        let quest = await Quest.findById(questId).lean();
        if (Array.isArray(quest)) {
            quest = quest[0];
        }
        if (!quest) {
            console.log(`[WARN] Quest not found for ID: ${questId}`);
            return NextResponse.json(
                { success: false, message: 'Quest not found' },
                { status: 404 }
            );
        }
        console.log(`[DEBUG] Quest found:`, quest);
        
        const scorePercentage = totalPossible > 0 ? score / totalPossible : 0;
        const earnedXP = Math.round(scorePercentage * quest.xpReward);
        console.log(`[DEBUG] Score Percentage: ${scorePercentage}, Earned XP: ${earnedXP}`);
        
        // Update user progress with quest completion
        if (!user.progress) {
            user.progress = { quests: [] };
        }
        
        const questProgressIndex = user.progress.quests?.findIndex(
            (q: any) => q.questId && q.questId.toString() === questId
        );
        console.log(`[DEBUG] Quest progress index: ${questProgressIndex}`);
        
        if (questProgressIndex > -1) {
            console.log(`[DEBUG] Updating existing quest progress for quest ID: ${questId}`);
            user.progress.quests[questProgressIndex].completed = true;
            user.progress.quests[questProgressIndex].score = score;
            user.progress.quests[questProgressIndex].earnedXP = earnedXP;
            
            if (taskId) {
                console.log(`[DEBUG] Marking task ${taskId} as completed`);
                const tasks = user.progress.quests[questProgressIndex].tasks || [];
                const taskIndex = tasks.findIndex(
                    (t: any) => t.taskId && t.taskId.toString() === taskId
                );
                
                if (taskIndex > -1) {
                    user.progress.quests[questProgressIndex].tasks[taskIndex].completed = true;
                } else {
                    // Add the task if it doesn't exist
                    user.progress.quests[questProgressIndex].tasks.push({
                        taskId,
                        completed: true,
                        completedAt: new Date()
                    });
                }
            }
        } else {
            console.log(`[DEBUG] Creating new quest progress for quest ID: ${questId}`);
            if (!user.progress.quests) {
                user.progress.quests = [];
            }
            
            user.progress.quests.push({
                questId,
                completed: true,
                score,
                earnedXP,
                completedAt: new Date(),
                tasks: taskId ? [{ taskId, completed: true, completedAt: new Date() }] : []
            });
        }
        
        // Update total XP
        user.totalXP = (user.totalXP || 0) + earnedXP;
        console.log(`[DEBUG] Updated total XP for user: ${user.totalXP}`);
        
        await user.save();
        console.log(`[DEBUG] User progress updated successfully`);
        
        return NextResponse.json({
            success: true,
            earnedXP,
            totalXP: user.totalXP,
            message: 'Quest progress updated'
        });
        
    } catch (error) {
        console.error('[ERROR] Error updating quest progress:', error);
        const errMsg = error instanceof Error ? error.message : 'Failed to update quest progress';
        return NextResponse.json(
            { success: false, message: errMsg },
            { status: 500 }
        );
    }
}