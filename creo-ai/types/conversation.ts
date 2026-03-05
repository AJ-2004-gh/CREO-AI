// Types for Conversational Content Generation

export interface ConversationQuestion {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'textarea';
  question: string;
  description?: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
  dependsOn?: {
    questionId: string;
    answer: string | string[];
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ConversationFlow {
  id: string;
  name: string;
  description: string;
  questions: ConversationQuestion[];
  finalPromptTemplate: string;
}

export interface ConversationState {
  flowId: string;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  isCompleted: boolean;
  generatedContent?: string;
}

export interface ConversationAnswer {
  questionId: string;
  answer: any;
}

// Predefined conversation flows for different content types
export const CONVERSATION_FLOWS: Record<string, ConversationFlow> = {
  'product-promotion': {
    id: 'product-promotion',
    name: 'Product Promotion',
    description: 'Create engaging posts to promote your products',
    questions: [
      {
        id: 'product-name',
        type: 'text',
        question: 'What is the name of your product?',
        description: 'The specific name of what you are selling',
        placeholder: 'e.g., Organic Honey, Handmade Jewelry, etc.',
        required: true
      },
      {
        id: 'product-category',
        type: 'select',
        question: 'What category does your product belong to?',
        description: 'This helps us understand your product type',
        options: [
          'Food & Beverages',
          'Clothing & Fashion',
          'Electronics & Gadgets',
          'Home & Garden',
          'Health & Beauty',
          'Handicrafts & Art',
          'Services',
          'Education & Learning',
          'Other'
        ],
        required: true
      },
      {
        id: 'target-audience',
        type: 'multiselect',
        question: 'Who are your target customers?',
        description: 'Select all that apply - this helps us tailor the language and tone',
        options: [
          'Students & Youth (16-25)',
          'Young Professionals (25-35)',
          'Families & Parents',
          'Business Professionals',
          'Senior Citizens',
          'Rural Community',
          'Urban Customers',
          'Women',
          'Men',
          'Children'
        ],
        required: true
      },
      {
        id: 'product-benefits',
        type: 'textarea',
        question: 'What are the main benefits of your product?',
        description: 'List 3-5 key benefits that make your product special',
        placeholder: 'e.g., 100% natural, locally sourced, affordable price, long-lasting...',
        required: true
      },
      {
        id: 'unique-selling-point',
        type: 'text',
        question: 'What makes your product unique from competitors?',
        description: 'Your special advantage or unique feature',
        placeholder: 'e.g., Traditional recipe, eco-friendly packaging, family business...',
        required: false
      },
      {
        id: 'price-range',
        type: 'select',
        question: 'What is the price range of your product?',
        description: 'This helps us position your product appropriately',
        options: [
          'Budget friendly (under ₹100)',
          'Affordable (₹100-500)',
          'Mid-range (₹500-2000)',
          'Premium (₹2000-10000)',
          'Luxury (above ₹10000)'
        ],
        required: false
      },
      {
        id: 'call-to-action',
        type: 'select',
        question: 'What do you want people to do after seeing your post?',
        description: 'Your main goal for this post',
        options: [
          'Visit my shop/website',
          'Call or message for orders',
          'Comment for more information',
          'Share with friends',
          'Like and follow my page',
          'Visit my physical store'
        ],
        required: true
      },
      {
        id: 'urgency-or-offer',
        type: 'text',
        question: 'Is there any special offer or urgency?',
        description: 'Limited time discount, special deal, or seasonal offer',
        placeholder: 'e.g., 20% off this week, Free delivery, Festival special...',
        required: false
      }
    ],
    finalPromptTemplate: `Create a compelling social media post for promoting a product with the following details:

Product Name: {product-name}
Category: {product-category}
Target Audience: {target-audience}
Key Benefits: {product-benefits}
Unique Selling Point: {unique-selling-point}
Price Range: {price-range}
Call to Action: {call-to-action}
Special Offer: {urgency-or-offer}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Write in a friendly, conversational tone that resonates with {target-audience}
2. Highlight the key benefits naturally within the post
3. Include a strong call-to-action for {call-to-action}
4. If there's a special offer, create urgency around it
5. Use appropriate emojis and cultural references for {cultural-context}
6. Keep it engaging and authentic - avoid overly corporate language
7. Include 3-5 relevant hashtags`
  },

  'service-business': {
    id: 'service-business',
    name: 'Service Business',
    description: 'Promote your services and expertise',
    questions: [
      {
        id: 'service-type',
        type: 'text',
        question: 'What service do you provide?',
        description: 'The specific service you offer',
        placeholder: 'e.g., Wedding Photography, Home Tutoring, Web Design...',
        required: true
      },
      {
        id: 'experience',
        type: 'select',
        question: 'How long have you been providing this service?',
        options: [
          'Just starting out',
          '1-2 years',
          '3-5 years',
          '5-10 years',
          'More than 10 years'
        ],
        required: true
      },
      {
        id: 'service-area',
        type: 'text',
        question: 'What area/location do you serve?',
        description: 'Your service coverage area',
        placeholder: 'e.g., Mumbai, Delhi NCR, Bangalore, Pan India...',
        required: true
      },
      {
        id: 'target-clients',
        type: 'multiselect',
        question: 'Who are your ideal clients?',
        options: [
          'Individuals',
          'Small Businesses',
          'Large Corporations',
          'Students',
          'Families',
          'Event Organizers',
          'Real Estate',
          'Healthcare',
          'Education Sector'
        ],
        required: true
      },
      {
        id: 'key-expertise',
        type: 'textarea',
        question: 'What are your key strengths or specializations?',
        description: 'What makes you good at what you do',
        placeholder: 'e.g., Attention to detail, Quick turnaround, Affordable pricing, Premium quality...',
        required: true
      },
      {
        id: 'booking-process',
        type: 'select',
        question: 'How can clients book your service?',
        options: [
          'Call or WhatsApp',
          'Email inquiry',
          'Website booking form',
          'Visit in person',
          'Social media message',
          'Through app'
        ],
        required: true
      }
    ],
    finalPromptTemplate: `Create a professional social media post for promoting a service business with the following details:

Service Type: {service-type}
Experience: {experience}
Service Area: {service-area}
Target Clients: {target-clients}
Key Strengths: {key-expertise}
Booking Process: {booking-process}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Write in a professional yet approachable tone
2. Emphasize your experience and expertise
3. Clearly explain how clients can benefit from your service
4. Include a clear call-to-action for booking
5. Mention your service area clearly
6. Use appropriate professional language with cultural sensitivity
7. Include 3-5 relevant hashtags for your industry`
  },

  'event-promotion': {
    id: 'event-promotion',
    name: 'Event Promotion',
    description: 'Create buzz for your upcoming events',
    questions: [
      {
        id: 'event-type',
        type: 'select',
        question: 'What type of event are you organizing?',
        options: [
          'Cultural Festival',
          'Religious Ceremony',
          'Business Conference',
          'Workshop/Seminar',
          'Social Gathering',
          'Sports Event',
          'Art Exhibition',
          'Concert/Performance',
          'Community Event',
          'Fundraiser'
        ],
        required: true
      },
      {
        id: 'event-name',
        type: 'text',
        question: 'What is the name of your event?',
        placeholder: 'e.g., Diwali Mela, Startup Summit, Art Workshop...',
        required: true
      },
      {
        id: 'event-date',
        type: 'text',
        question: 'When is your event?',
        description: 'Date and time',
        placeholder: 'e.g., 15th November 2024, 6:00 PM',
        required: true
      },
      {
        id: 'event-location',
        type: 'text',
        question: 'Where is your event happening?',
        placeholder: 'e.g., Community Hall, Online via Zoom, City Park...',
        required: true
      },
      {
        id: 'event-highlights',
        type: 'textarea',
        question: 'What are the main attractions or highlights?',
        description: 'What makes your event special',
        placeholder: 'e.g., Guest speakers, Live music, Food stalls, Networking opportunities...',
        required: true
      },
      {
        id: 'registration-details',
        type: 'text',
        question: 'How can people register or join?',
        placeholder: 'e.g., Free entry, Register at website, Tickets available at venue...',
        required: true
      }
    ],
    finalPromptTemplate: `Create an exciting social media post to promote an event with the following details:

Event Type: {event-type}
Event Name: {event-name}
Date & Time: {event-date}
Location: {event-location}
Main Highlights: {event-highlights}
Registration: {registration-details}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Create excitement and urgency about the event
2. Highlight the most attractive features
3. Include all essential details (date, time, location)
4. Make the registration process clear and simple
5. Use event-appropriate emojis and cultural references
6. Create FOMO (fear of missing out) if appropriate
7. Include 3-5 relevant event hashtags`
  },

  'general-content': {
    id: 'general-content',
    name: 'General Content',
    description: 'For any other type of content',
    questions: [
      {
        id: 'content-purpose',
        type: 'select',
        question: 'What is the main purpose of your post?',
        options: [
          'Share information/tips',
          'Tell a story',
          'Ask a question/engage audience',
          'Share news/announcement',
          'Inspire or motivate',
          'Entertain',
          'Educate',
          'Build brand awareness'
        ],
        required: true
      },
      {
        id: 'main-topic',
        type: 'text',
        question: 'What is your post about?',
        placeholder: 'e.g., Digital marketing tips, Success story, Industry news...',
        required: true
      },
      {
        id: 'target-audience',
        type: 'select',
        question: 'Who are you trying to reach?',
        options: [
          'General audience',
          'Industry professionals',
          'Potential customers',
          'Students/learners',
          'Community members',
          'Followers/fans'
        ],
        required: true
      },
      {
        id: 'desired-tone',
        type: 'select',
        question: 'What tone should the post have?',
        options: [
          'Professional and formal',
          'Friendly and casual',
          'Inspirational and motivational',
          'Humorous and entertaining',
          'Educational and informative',
          'Empathetic and supportive'
        ],
        required: true
      },
      {
        id: 'key-points',
        type: 'textarea',
        question: 'What are the key points you want to include?',
        description: 'List the main messages or information you want to convey',
        placeholder: 'e.g., 3 tips for better productivity, My journey as an entrepreneur...',
        required: true
      }
    ],
    finalPromptTemplate: `Create an engaging social media post with the following details:

Purpose: {content-purpose}
Main Topic: {main-topic}
Target Audience: {target-audience}
Desired Tone: {desired-tone}
Key Points: {key-points}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Write in a {desired-tone} tone that appeals to {target-audience}
2. Structure the content to achieve {content-purpose}
3. Include all key points naturally and engagingly
4. Use appropriate language and cultural references
5. Make it shareable and engaging for the platform
6. Include a relevant call-to-action if appropriate
7. Add 3-5 relevant hashtags`
  }
};

export function detectContentFlow(userInput: string): string {
  const input = userInput.toLowerCase();
  
  // Product-related keywords
  if (input.includes('product') || input.includes('sell') || input.includes('shop') || 
      input.includes('buy') || input.includes('price') || input.includes('item')) {
    return 'product-promotion';
  }
  
  // Service-related keywords
  if (input.includes('service') || input.includes('consulting') || input.includes('tutoring') ||
      input.includes('photography') || input.includes('design') || input.includes('freelance')) {
    return 'service-business';
  }
  
  // Event-related keywords
  if (input.includes('event') || input.includes('festival') || input.includes('workshop') ||
      input.includes('conference') || input.includes('seminar') || input.includes('celebration')) {
    return 'event-promotion';
  }
  
  // Default to general content
  return 'general-content';
}

export function generateFinalPrompt(flow: ConversationFlow, answers: Record<string, any>, platform: string, language: string, culturalContext: string): string {
  let prompt = flow.finalPromptTemplate;
  
  // Replace all placeholders with actual answers
  Object.keys(answers).forEach(key => {
    const value = Array.isArray(answers[key]) ? answers[key].join(', ') : answers[key];
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value || 'Not specified');
  });
  
  // Replace system placeholders
  prompt = prompt.replace(/{platform}/g, platform);
  prompt = prompt.replace(/{language}/g, language);
  prompt = prompt.replace(/{cultural-context}/g, culturalContext);
  
  return prompt;
}
