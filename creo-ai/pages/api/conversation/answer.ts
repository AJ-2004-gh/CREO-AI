/**
 * POST /api/conversation/answer
 * Handles answering questions in the conversational flow
 */
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';
import conversationalService from '@/services/conversationalService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { conversation_id, answer, action } = req.body as {
    conversation_id?: string;
    answer?: any;
    action?: 'submit' | 'back' | 'reset';
  };

  if (!conversation_id) {
    return res.status(400).json({ error: 'conversation_id is required' });
  }

  try {
    switch (action) {
      case 'submit':
        if (answer === undefined) {
          return res.status(400).json({ error: 'answer is required for submit action' });
        }

        const updatedConversation = conversationalService.submitAnswer(conversation_id, answer);
        const currentQuestion = conversationalService.getCurrentQuestion(conversation_id);
        const progress = conversationalService.getProgress(conversation_id);

        return res.status(200).json({
          conversation_state: updatedConversation,
          current_question: currentQuestion,
          progress: progress,
          is_completed: updatedConversation.isCompleted
        });

      case 'back':
        const backConversation = conversationalService.goBack(conversation_id);
        const backQuestion = conversationalService.getCurrentQuestion(conversation_id);
        const backProgress = conversationalService.getProgress(conversation_id);

        return res.status(200).json({
          conversation_state: backConversation,
          current_question: backQuestion,
          progress: backProgress,
          is_completed: backConversation.isCompleted
        });

      case 'reset':
        conversationalService.resetConversation(conversation_id);
        return res.status(200).json({ message: 'Conversation reset successfully' });

      default:
        return res.status(400).json({ error: 'Invalid action. Must be submit, back, or reset' });
    }
  } catch (error) {
    console.error('[/api/conversation/answer] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export default withAuth(handler);
