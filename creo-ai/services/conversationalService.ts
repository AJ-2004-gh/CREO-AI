/**
 * Conversational Content Service
 * Manages the intelligent question-answer flow for content generation
 */
import {
  ConversationFlow,
  ConversationState,
  ConversationQuestion,
  CONVERSATION_FLOWS,
  detectContentFlow,
  generateFinalPrompt
} from '@/types/conversation';
import { Platform, CulturalContext } from '@/types/post';
import { generateContent } from './aiService';
import { generateCulturalPrompt } from '@/types/culturalContext';

export class ConversationalService {
  private static instance: ConversationalService;
  private activeConversations: Map<string, ConversationState> = new Map();

  static getInstance(): ConversationalService {
    if (!ConversationalService.instance) {
      ConversationalService.instance = new ConversationalService();
    }
    return ConversationalService.instance;
  }

  /**
   * Start a new conversation based on user input
   */
  startConversation(userInput: string, conversationId: string): ConversationState {
    const detectedFlow = detectContentFlow(userInput);
    const flow = CONVERSATION_FLOWS[detectedFlow];

    if (!flow) {
      throw new Error('No suitable conversation flow found');
    }

    const conversationState: ConversationState = {
      flowId: detectedFlow,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false
    };

    this.activeConversations.set(conversationId, conversationState);
    return conversationState;
  }

  /**
   * Get the current question for a conversation
   */
  getCurrentQuestion(conversationId: string): ConversationQuestion | null {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation || conversation.isCompleted) {
      return null;
    }

    const flow = CONVERSATION_FLOWS[conversation.flowId];
    const currentQuestion = flow.questions[conversation.currentQuestionIndex];

    // Check if this question has dependencies that aren't met
    if (currentQuestion.dependsOn) {
      const dependentAnswer = conversation.answers[currentQuestion.dependsOn.questionId];
      const requiredAnswer = currentQuestion.dependsOn.answer;

      if (Array.isArray(requiredAnswer)) {
        if (!Array.isArray(dependentAnswer) || !requiredAnswer.some(ans => dependentAnswer.includes(ans))) {
          // Skip this question and move to next
          conversation.currentQuestionIndex++;
          return this.getCurrentQuestion(conversationId);
        }
      } else {
        if (dependentAnswer !== requiredAnswer) {
          // Skip this question and move to next
          conversation.currentQuestionIndex++;
          return this.getCurrentQuestion(conversationId);
        }
      }
    }

    return currentQuestion;
  }

  /**
   * Submit an answer to the current question
   */
  submitAnswer(conversationId: string, answer: any): ConversationState {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation || conversation.isCompleted) {
      throw new Error('Conversation not found or already completed');
    }

    const currentQuestion = this.getCurrentQuestion(conversationId);
    if (!currentQuestion) {
      throw new Error('No current question to answer');
    }

    // Validate the answer
    this.validateAnswer(currentQuestion, answer);

    // Store the answer
    conversation.answers[currentQuestion.id] = answer;

    // Move to next question
    conversation.currentQuestionIndex++;

    // Check if conversation is completed
    const flow = CONVERSATION_FLOWS[conversation.flowId];
    if (conversation.currentQuestionIndex >= flow.questions.length) {
      conversation.isCompleted = true;
    }

    this.activeConversations.set(conversationId, conversation);
    return conversation;
  }

  /**
   * Validate an answer against question requirements
   */
  private validateAnswer(question: ConversationQuestion, answer: any): void {
    if (question.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      throw new Error(`Question "${question.question}" is required`);
    }

    if (question.validation) {
      const validation = question.validation;

      if (question.type === 'number' && typeof answer === 'number') {
        if (validation.min !== undefined && answer < validation.min) {
          throw new Error(`Answer must be at least ${validation.min}`);
        }
        if (validation.max !== undefined && answer > validation.max) {
          throw new Error(`Answer must be at most ${validation.max}`);
        }
      }

      if (question.type === 'text' || question.type === 'textarea') {
        const strAnswer = String(answer);
        if (validation.min !== undefined && strAnswer.length < validation.min) {
          throw new Error(`Answer must be at least ${validation.min} characters`);
        }
        if (validation.max !== undefined && strAnswer.length > validation.max) {
          throw new Error(`Answer must be at most ${validation.max} characters`);
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(strAnswer)) {
          throw new Error('Answer format is invalid');
        }
      }
    }
  }

  /**
   * Generate content based on completed conversation
   */
  async generateContentFromConversation(
    conversationId: string,
    platform: Platform,
    targetLanguage: string,
    culturalContext: CulturalContext
  ): Promise<any> {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation || !conversation.isCompleted) {
      throw new Error('Conversation not completed');
    }

    const flow = CONVERSATION_FLOWS[conversation.flowId];
    const finalPrompt = generateFinalPrompt(
      flow,
      conversation.answers,
      platform,
      targetLanguage,
      culturalContext
    );

    // Use the existing generateContent function with the crafted prompt
    const result = await generateContent(finalPrompt, platform, targetLanguage, culturalContext);

    // Clean up the conversation
    this.activeConversations.delete(conversationId);

    return result;
  }

  /**
   * Get conversation progress
   */
  getProgress(conversationId: string): { current: number; total: number; percentage: number } {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) {
      return { current: 0, total: 0, percentage: 0 };
    }

    const flow = CONVERSATION_FLOWS[conversation.flowId];
    const totalQuestions = flow.questions.length;
    const currentQuestion = conversation.currentQuestionIndex;

    return {
      current: currentQuestion,
      total: totalQuestions,
      percentage: Math.round((currentQuestion / totalQuestions) * 100)
    };
  }

  /**
   * Go back to previous question
   */
  goBack(conversationId: string): ConversationState {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.currentQuestionIndex > 0) {
      conversation.currentQuestionIndex--;
      conversation.isCompleted = false;

      // Remove the last answer if going back
      const flow = CONVERSATION_FLOWS[conversation.flowId];
      const currentQuestion = flow.questions[conversation.currentQuestionIndex];
      delete conversation.answers[currentQuestion.id];
    }

    this.activeConversations.set(conversationId, conversation);
    return conversation;
  }

  /**
   * Get all answers for a conversation
   */
  getAnswers(conversationId: string): Record<string, any> {
    const conversation = this.activeConversations.get(conversationId);
    return conversation ? { ...conversation.answers } : {};
  }

  /**
   * Reset conversation
   */
  resetConversation(conversationId: string): void {
    this.activeConversations.delete(conversationId);
  }

  /**
   * Get available conversation flows
   */
  getAvailableFlows(): ConversationFlow[] {
    return Object.values(CONVERSATION_FLOWS);
  }

  /**
   * Get specific flow by ID
   */
  getFlow(flowId: string): ConversationFlow | null {
    return CONVERSATION_FLOWS[flowId] || null;
  }
}

export default ConversationalService.getInstance();
