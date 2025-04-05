import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import Module from '@/models/Module';
import Quest from '@/models/Quest';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Fetch all modules first
    const modules = await Module.find().lean();
    
    // Convert MongoDB _id to id for frontend use
    const enhancedModules = await Promise.all(
      modules.map(async (module) => {
        const moduleId = (module as { _id: { toString(): string } })._id.toString();
        
        // Fetch quests for this module
        const quests = await Quest.find({ moduleId: module._id }).lean();
        
        // Format quests
        const formattedQuests = quests.map(quest => ({
          id: (quest as any)._id.toString(),
          title: quest.title,
          description: quest.description,
          level: quest.level,
          xpReward: quest.xpReward,
          tasks: quest.tasks || [],
          // Add other needed fields
        }));
        
        return {
          id: moduleId,
          title: module.title,
          description: module.description,
          level: module.level,
          order: module.order,
          quests: formattedQuests
        };
      })
    );
    
    // Group modules by level
    const groupedModules = {
      beginner: enhancedModules.filter(module => module.level === 'beginner'),
      intermediate: enhancedModules.filter(module => module.level === 'intermediate'),
      advanced: enhancedModules.filter(module => module.level === 'advanced')
    };
    
    return NextResponse.json({
      success: true,
      modules: enhancedModules,
      groupedModules
    });
    
  } catch (error) {
    console.error('Error fetching modules:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch modules';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}