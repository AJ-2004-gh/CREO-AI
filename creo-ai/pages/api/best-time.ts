import type { NextApiRequest, NextApiResponse } from 'next';
import { invokeModel } from '@/lib/bedrockClient';
import type { BestTimeResult } from '@/types/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { content, platform, culturalContext, targetLanguage } = req.body as {
    content: string;
    platform: string;
    culturalContext?: string;
    targetLanguage?: string;
  };

  if (!content || !platform) {
    return res.status(400).json({ error: 'content and platform are required' });
  }

  const culturalNote =
    culturalContext && culturalContext !== 'None'
      ? `The content is themed around "${culturalContext}", a cultural/seasonal event primarily observed in India.`
      : 'No specific cultural context.';

  const prompt = `You are a social media strategist specializing in optimal posting schedules for maximum engagement.

Analyze the following post and suggest the best times to publish it on ${platform}.

Platform: ${platform}
Content Language: ${targetLanguage || 'English'}
Cultural Context: ${culturalNote}

Post Content:
"""
${content.substring(0, 600)}
"""

Consider: audience activity patterns on ${platform}, content type, cultural timing (festivals/events if applicable), and time zones relevant to the audience (IST for Indian content, EST/PST for English content).

Return ONLY valid JSON in this exact format, but donot over fit to the examples, use :
{
  "top_pick": {
    "day": "day name (e.g., Monday)",
    "time": "7:00 PM – 9:00 PM",
    "timezone": "IST",
    "reason": "One sentence explaining why this is the best slot"
  },
  "best_times": [
    {
      "day": "day name (e.g., Monday)",
      "time": "optimal time",
      "timezone": "IST",
      "reason": "One sentence reason"
    },
    {
      "day": "day name (e.g., Wednesday)",
      "time": "optimal time",
      "timezone": "IST",
      "reason": "One sentence reason"
    },
    {
      "day": "day name (e.g., Saturday)",
      "time": "optimal time",
      "timezone": "IST",
      "reason": "One sentence reason"
    }
  ],
  "summary": "One to two sentence overview of why these times work for this specific content and platform."
}`;

  try {
    console.log('[/api/best-time] ========== REQUEST START =========');
    console.log('[/api/best-time] Platform:', platform);
    console.log('[/api/best-time] Target Language:', targetLanguage);
    console.log('[/api/best-time] Cultural Context:', culturalContext);
    console.log('[/api/best-time] Content length:', content.length);
    console.log('[/api/best-time] Calling invokeModel...');
    
    const result = await invokeModel<BestTimeResult>(prompt);
    
    console.log('[/api/best-time] ✅ Result received');
    console.log('[/api/best-time] Result keys:', Object.keys(result));
    console.log('[/api/best-time] Top pick:', result.top_pick?.day, result.top_pick?.time);
    console.log('[/api/best-time] Number of best times:', result.best_times?.length);
    console.log('[/api/best-time] ========== REQUEST COMPLETE =========');
    
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/best-time] ❌ CAUGHT ERROR');
    console.error('[/api/best-time] Error:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) {
      console.error('[/api/best-time] Stack:', err.stack);
    }
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to get best posting times' });
  }
}
