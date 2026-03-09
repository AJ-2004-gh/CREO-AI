// Types for Post data structures used across the app
import { CulturalContext } from './culturalContext';

export type Platform = 'Twitter' | 'LinkedIn' | 'Instagram';

export type IndicLanguage = 'English' | 'Hindi' | 'Marathi' | 'Tamil' | 'Bengali' | 'Telugu' | 'Gujarati' | 'Kannada' | 'Malayalam' | 'Punjabi';

export type { CulturalContext };

export interface ScoreResult {
  hook_score: number;
  clarity_score: number;
  cta_score: number;
  final_score: number;
}

export interface GenerateResult {
  content: string;
  suggested_hashtags: string[];
}

export interface Post {
  user_id: string;
  created_at: string | number;
  post_id: string;
  content: string;
  platform: Platform;
  target_language: IndicLanguage;
  cultural_context?: CulturalContext;
  hook_score: number;
  clarity_score: number;
  cta_score: number;
  final_score: number;
  suggested_hashtags?: string[];
  idea?: string;
  image_url?: string;
}

export interface CreatePostInput {
  user_id: string;
  idea: string;
  platform: Platform;
  target_language: IndicLanguage;
  cultural_context?: CulturalContext;
}

export interface OptimizationType {
  type: 'hook' | 'cta' | 'hashtags';
}

export interface OptimizationRecord {
  post_id: string;
  created_at: string;
  optimization_type: string;
  old_score: number;
  new_score: number;
  improvement_percentage: number;
  improved_content: string;
  suggested_hashtags?: string[];
}

export interface OptimizationResult {
  original_content: string;
  improved_content: string;
  original_score: ScoreResult;
  improved_score: ScoreResult;
  improvement_percentage: number;
  suggested_hashtags?: string[];
}

export interface PostingTimeSlot {
  day: string;
  time: string;
  timezone: string;
  reason: string;
}

export interface BestTimeResult {
  top_pick: PostingTimeSlot;
  best_times: PostingTimeSlot[];
  summary: string;
}
