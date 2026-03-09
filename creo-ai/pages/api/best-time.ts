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

Return ONLY valid JSON in this exact format:
{
  "top_pick": {
    "day": "Wednesday",
    "time": "7:00 PM – 9:00 PM",
    "timezone": "IST",
    "reason": "One sentence explaining why this is the best slot"
  },
  "best_times": [
    {
      "day": "Monday",
      "time": "8:00 AM – 10:00 AM",
      "timezone": "IST",
      "reason": "One sentence reason"
    },
    {
      "day": "Wednesday",
      "time": "7:00 PM – 9:00 PM",
      "timezone": "IST",
      "reason": "One sentence reason"
    },
    {
      "day": "Saturday",
      "time": "11:00 AM – 1:00 PM",
      "timezone": "IST",
      "reason": "One sentence reason"
    }
  ],
  "summary": "One to two sentence overview of why these times work for this specific content and platform."
}`;

  try {
    const result = await invokeModel<BestTimeResult>(prompt);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[best-time] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to get best posting times' });
  }
}
