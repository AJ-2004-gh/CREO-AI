/**
 * GET /api/conversation/status
 * Get conversation status and current question
 */
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';
import conversationalService from '@/services/conversationalService';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { conversation_id } = req.query as { conversation_id?: string };

  if (!conversation_id) {
    return res.status(400).json({ error: 'conversation_id is required' });
  }

  try {
    const currentQuestion = conversationalService.getCurrentQuestion(conversation_id);
    const progress = conversationalService.getProgress(conversation_id);
    const answers = conversationalService.getAnswers(conversation_id);

    if (!currentQuestion && Object.keys(answers).length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.status(200).json({
      current_question: currentQuestion,
      progress: progress,
      answers: answers,
      is_completed: !currentQuestion
    });
  } catch (error) {
    console.error('[/api/conversation/status] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export default withAuth(handler);
