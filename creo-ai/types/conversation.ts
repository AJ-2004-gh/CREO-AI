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
    finalPromptTemplate: `Create a highly compelling, conversion-focused social media post for promoting a product with the following details:

Category: {product-category}
Target Audience: {target-audience}
Key Benefits: {product-benefits}
Unique Selling Point (USP): {unique-selling-point}
Price Range: {price-range}
Call to Action (CTA): {call-to-action}
Special Offer/Urgency: {urgency-or-offer}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Length & Depth: Write a detailed, engaging post with a word limit of around 700 words. Build a narrative rather than just listing features.
2. Tone & Voice: Use a highly engaging, persuasive, and friendly tone tailored specifically to resonate with {target-audience}. Avoid dry, overly corporate jargon.
3. Benefit-Driven Narrative: Weave the {product-benefits} and {unique-selling-point} naturally into a storytelling format that shows the reader exactly how this product improves their life.
4. Hook the Reader: Start with a powerful, attention-grabbing opening sentence or question that stops the scroll.
5. Offer & Urgency: If a {urgency-or-offer} is provided, seamlessly integrate it to create a strong sense of FOMO (Fear Of Missing Out) and drive immediate action.
6. Cultural Nuance: Thoughtfully incorporate culturally relevant references, idioms, and appropriate emojis for {cultural-context} without forcing it.
7. Clear Call-to-Action: Conclude with a crystal clear, action-oriented CTA guiding users to {call-to-action}.
8. Formatting: Use proper spacing, line breaks, and bullet points to ensure the content is easily readable and scannable.
9. Hashtags: Include 5-7 highly targeted, trending, and niche-specific hashtags at the end.`
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
    finalPromptTemplate: `Create a highly professional, authority-building social media post for promoting a service business with the following details:

Service Type: {service-type}
Experience/Authority: {experience}
Service Area/Location: {service-area}
Target Clients: {target-clients}
Key Strengths & Expertise: {key-expertise}
Booking Process: {booking-process}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Length & Depth: Write a comprehensive, value-driven post with a word limit of around 700 words. Use this space to build trust and showcase deep expertise.
2. Tone & Voice: Maintain a highly professional, trustworthy, yet accessible and empathetic tone that specifically addresses the needs of {target-clients}.
3. Establish Authority: Naturally highlight the {experience} and {key-expertise} to position the service provider as an industry leader and the best solution to the client's problem.
4. Problem-Solution Framework: Frame the post around common pain points the target clients face, offering the {service-type} as the definitive answer.
5. Local/Targeted Appeal: Ensure the {service-area} is explicitly mentioned so local or targeted prospects know they are covered.
6. Frictionless Booking: Explicitly and clearly explain exactly how clients can engage using the {booking-process}. Remove any doubt about the next steps.
7. Cultural Relevance: Use appropriate professional language, respect, and subtle cultural nuances relevant to {cultural-context}.
8. Formatting: Employ clean formatting, utilizing bullet points for key strengths and white space to make reading effortless.
9. Hashtags: Add 5-7 industry-specific and localized hashtags to maximize discoverability.`
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
    finalPromptTemplate: `Create an electrifying, high-energy social media post to promote an upcoming event with the following details:

Event Type: {event-type}
Event Name: {event-name}
Date & Time: {event-date}
Location: {event-location}
Main Attractions/Highlights: {event-highlights}
Registration/Ticketing: {registration-details}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Length & Depth: Craft a detailed, immersive post with a word limit of around 700 words. Paint a vivid picture of the event experience.
2. Tone & Voice: Bring immense enthusiasm, excitement, and energy. Make the reader feel like this is a must-attend, unmissable experience.
3. Hook & FOMO: Start with a captivating hook. Leverage FOMO (Fear Of Missing Out) to make the target audience feel the urgency to attend.
4. Highlight Value: Elaborate on the {event-highlights}. Don't just list them; describe the value and the experience attendees will walk away with.
5. Absolute Clarity: Ensure {event-date} and {event-location} are impossible to miss, formatted clearly and prominently.
6. Seamless Action: Provide clear, unambiguous instructions on how to secure a spot via {registration-details}. Encourage immediate action.
7. Culturally Resonant: Deeply integrate the {cultural-context} through suitable metaphors, festive/event-specific celebratory tones, and relevant emojis.
8. Accessibility: Structure the lengthy text using line breaks, bold text (if supported by the platform's conventions), or emojis as bullet points.
9. Hashtags: Include 5-7 event-specific, localized, and trending hashtags.`
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
    finalPromptTemplate: `Create a highly engaging, value-packed social media post with the following details:

Primary Purpose: {content-purpose}
Main Topic/Theme: {main-topic}
Target Audience: {target-audience}
Desired Tone: {desired-tone}
Core Key Points to Cover: {key-points}

Platform: {platform}
Language: {language}
Cultural Context: {cultural-context}

Instructions:
1. Length & Depth: Write a substantial, deep-dive post with a word limit of around 700 words. Provide genuine value, thorough insights, or a captivating narrative depending on the topic.
2. Tone & Voice: Strictly adhere to a {desired-tone} tone while ensuring every sentence is tailored to capture the attention of {target-audience}.
3. Narrative Structure: Weave the {key-points} into a cohesive, flowing story or a well-structured educational piece. Ensure a logical progression from the hook to the conclusion.
4. Purpose-Driven: Keep the {content-purpose} at the core of the post. Every paragraph should serve this primary objective (e.g., educating, inspiring, or entertaining).
5. Strong Hook & Conclusion: Open with an scroll-stopping hook (a provocative question, surprising stat, or bold statement). End with a thought-provoking conclusion or question to drive comments and engagement.
6. Cultural Alignment: Thoughtfully align the language, figures of speech, and emojis with {cultural-context} to create local/cultural resonance.
7. Formatting: Use generous paragraph spacing, listicles, or logical breaks to ensure the content is easily digestible and visually appealing on social feeds.
8. Call-to-Action: Include a relevant CTA (like asking a question to prompt discussion, or directing to a link) aligned with the purpose.
9. Hashtags: Conclude with 5-7 highly relevant hashtags spanning broad and niche categories.`
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
