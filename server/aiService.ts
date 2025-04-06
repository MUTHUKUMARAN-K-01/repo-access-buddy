import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

// AI model configuration
export type AIModel = 'openrouter' | 'local';

// Model option interface
export interface AIModelOption {
  id: string;
  name: string;
  isFree?: boolean;
  category?: string;
}

// Fallback OpenRouter models in case the API request fails
export const fallbackOpenRouterModels: AIModelOption[] = [
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', isFree: true },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', isFree: true },
  { id: 'mistralai/mistral-large', name: 'Mistral Large' },
  { id: 'mistralai/mistral-medium', name: 'Mistral Medium', isFree: true },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' }
];

// Function to fetch all available models from OpenRouter
export async function fetchOpenRouterModels(): Promise<AIModelOption[]> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log("OpenRouter API key not configured. Returning fallback model list.");
    return fallbackOpenRouterModels;
  }
  
  try {
    const response = await axios.get(OPENROUTER_MODELS_URL, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://replit.com/",
        "X-Title": "FinanceGuru App"
      }
    });
    
    if (response.data && Array.isArray(response.data.data)) {
      // Transform the response into our AIModelOption format
      const models = response.data.data.map((model: any) => {
        // Get provider name from model ID (first segment before slash)
        const providerRaw = model.id.split('/')[0];
        const provider = providerRaw.charAt(0).toUpperCase() + providerRaw.slice(1);
        
        // Determine if the model is free based on pricing info
        const isPricingFree = model.pricing?.prompt === 0 && model.pricing?.completion === 0;
        
        // Free models based on heuristic if pricing info is not available
        const isFreeByHeuristic = 
          !model.id.includes('gpt-4') && 
          !model.id.includes('claude-3') && 
          !model.id.includes('claude-3.5') && 
          (model.id.includes('mistral-small') || 
           model.id.includes('llama-3-8b') || 
           model.id.includes('command-r') || 
           model.id.includes('gemini-1.0-pro') ||
           model.id.includes('phi'));
        
        // Determine model category with better organization
        let category;
        if (model.id.includes('claude')) {
          category = 'Anthropic';
        } else if (model.id.includes('llama')) {
          category = 'Meta';
        } else if (model.id.includes('mistral') || model.id.includes('mixtral')) {
          category = 'Mistral';
        } else if (model.id.includes('gpt') || model.id.includes('openai')) {
          category = 'OpenAI';
        } else if (model.id.includes('gemini') || model.id.includes('palm')) {
          category = 'Google';
        } else if (model.id.includes('command-r') || model.id.includes('cohere')) {
          category = 'Cohere';
        } else if (model.id.includes('falcon')) {
          category = 'TII';
        } else if (model.id.includes('phi')) {
          category = 'Microsoft';
        } else {
          // Use the provider name as the category if no specific match
          category = provider;
        }
        
        // Special case for "vision" or multimodal capabilities
        if (model.id.includes('vision') || model.context_length > 100000) {
          category += ' (Advanced)';
        }
        
        return {
          id: model.id,
          name: model.name || model.id.split('/').pop(),
          isFree: isPricingFree || isFreeByHeuristic,
          category: category
        };
      });
      
      // Sort models by category and name for better user experience
      models.sort((a: AIModelOption, b: AIModelOption) => {
        // Group by category first
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        
        // Then sort by name
        return a.name.localeCompare(b.name);
      });
      
      return models;
    }
    
    console.log("OpenRouter API returned invalid data format. Returning fallback model list.");
    return fallbackOpenRouterModels;
  } catch (error: unknown) {
    console.error("Error fetching models from OpenRouter:", error);
    return fallbackOpenRouterModels;
  }
}

// For backward compatibility
export const openRouterModels = fallbackOpenRouterModels;

// System prompt for financial advisor role
const SYSTEM_PROMPT = `
You are FinanceGuru, a knowledgeable financial advisor specialized in personal finance.
Provide helpful, accurate, and actionable advice on:
- Budgeting and expense management
- Debt management and reduction strategies
- Saving and investing fundamentals
- Retirement planning
- Tax optimization
- Financial goal setting

Keep responses concise, practical, and tailored to the user's situation.
Answer with concrete examples and specific recommendations when possible.
If you don't know something or aren't qualified to give specific advice on complex matters,
acknowledge your limitations and suggest consulting a certified financial professional.
`;

/**
 * Generate a response to a user's finance question using the specified AI model
 * @param userMessage The user's finance-related question or message
 * @param chatHistory Previous messages for context (optional)
 * @param modelType The AI model type to use (openrouter or local)
 * @param selectedModelId The specific OpenRouter model ID to use
 * @returns AI-generated response
 */
export async function generateFinanceResponse(
  userMessage: string,
  chatHistory: string[],
  modelType: AIModel = 'local',
  selectedModelId: string = 'openai/gpt-4o'
): Promise<string> {
  if (modelType === 'local') {
    return generateLocalFinanceResponse(userMessage);
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OpenRouter API key not configured. Falling back to local response.");
    return generateLocalFinanceResponse(userMessage);
  }

  try {
    // Format the chat history for the API
    const messages = chatHistory.map((msg, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: msg
    }));

    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: selectedModelId,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://replit.com/",
          "X-Title": "FinanceGuru App",
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      console.error("Unexpected response format from OpenRouter:", response.data);
      return generateLocalFinanceResponse(userMessage);
    }
  } catch (error: unknown) {
    console.error("Error calling OpenRouter API:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    return generateLocalFinanceResponse(userMessage);
  }
}

/**
 * Enhanced fallback function that returns detailed responses for common financial questions
 * Uses keyword matching to provide relevant financial advice without requiring external APIs
 * @param userMessage User's question
 * @returns Detailed response based on keywords in the question
 */
export function generateLocalFinanceResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Greeting or introduction
  if (message.includes("hi") || message.includes("hello") || message.includes("hey") || message.length < 5) {
    return "Hello! I'm FinanceGuru, your personal finance assistant. I can help you with budgeting, investing, debt management, and achieving your financial goals. How can I assist you today?";
  }
  
  // Budget-related questions
  if (message.includes("budget") || message.includes("spending") || message.includes("expenses") || message.includes("track")) {
    return "Creating a solid budget is the foundation of financial success! Here's how to get started:\n\n1. Track all income and expenses for at least a month\n2. Categorize your spending (housing, food, transportation, etc.)\n3. Follow the 50/30/20 rule: allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment\n4. Use budgeting apps or spreadsheets to automate tracking\n5. Review and adjust your budget monthly\n\nThe key to successful budgeting is consistency and regular reviews. What specific aspect of budgeting are you struggling with?";
  }
  
  // Saving-related questions
  if (message.includes("save") || message.includes("saving") || message.includes("emergency fund") || message.includes("emergency")) {
    return "Building savings is critical for financial security. Here's my advice:\n\n1. Start with an emergency fund covering 3-6 months of essential expenses\n2. Keep your emergency fund in a high-yield savings account for easy access\n3. Set up automatic transfers on payday to make saving effortless\n4. Create specific savings goals with deadlines (vacation, down payment, etc.)\n5. Once your emergency fund is complete, direct savings toward other financial goals\n\nRemember: Even small, consistent contributions add up significantly over time thanks to compound interest.";
  }
  
  // Debt-related questions
  if (message.includes("debt") || message.includes("loan") || message.includes("credit card") || message.includes("mortgage") || message.includes("student loan")) {
    return "Managing debt effectively is crucial for your financial health. Here's a step-by-step approach:\n\n1. List all debts with their interest rates, minimum payments, and balances\n2. Consider these two popular payoff strategies:\n   - Debt Avalanche: Focus on highest-interest debt first (saves the most money)\n   - Debt Snowball: Pay off smallest balances first (provides psychological wins)\n3. Always pay more than the minimum payment when possible\n4. Consider balance transfers or debt consolidation for high-interest debt\n5. Avoid taking on new debt while paying off existing obligations\n\nWhat types of debt are you currently dealing with? I can provide more specific advice based on your situation.";
  }
  
  // Investment-related questions
  if (message.includes("invest") || message.includes("stock") || message.includes("bond") || message.includes("retirement") || message.includes("401k") || message.includes("ira")) {
    return "Investing is how you build wealth long-term. Here are key principles to get started:\n\n1. Before investing, ensure you have an emergency fund and have addressed high-interest debt\n2. Take advantage of employer-matched retirement accounts like 401(k)s first\n3. Consider tax-advantaged accounts like Roth or Traditional IRAs\n4. For most people, low-cost index funds provide appropriate diversification\n5. Set an asset allocation based on your risk tolerance and time horizon\n6. Invest regularly regardless of market conditions (dollar-cost averaging)\n\nRemember that investing is for long-term goals, typically 5+ years. Short-term needs should be kept in savings accounts.";
  }
  
  // Real estate or home buying
  if (message.includes("house") || message.includes("home") || message.includes("mortgage") || message.includes("property") || message.includes("real estate")) {
    return "Buying a home is one of the biggest financial decisions you'll make. Here's guidance:\n\n1. Save for a down payment of at least 20% to avoid PMI (private mortgage insurance)\n2. Get pre-approved for a mortgage before house hunting\n3. Budget for total housing costs (mortgage, property taxes, insurance, maintenance)\n4. The general rule is that housing shouldn't exceed 28% of your gross income\n5. Consider additional costs like closing costs, moving expenses, and new furniture\n6. Think about how long you plan to stay in the home - buying usually makes sense if you'll stay 5+ years\n\nAre you currently saving for a home or already in the process of buying?";
  }
  
  // Credit score questions
  if (message.includes("credit score") || message.includes("credit report") || message.includes("credit history") || message.includes("fico")) {
    return "Your credit score has a huge impact on your financial options. Here's how to maintain a healthy score:\n\n1. Pay all bills on time - payment history is 35% of your FICO score\n2. Keep credit utilization below 30% of available credit (lower is better)\n3. Don't close old credit accounts - length of credit history matters\n4. Limit applications for new credit to avoid hard inquiries\n5. Regularly check your credit reports for errors at annualcreditreport.com\n\nScore ranges: 300-579 (Poor), 580-669 (Fair), 670-739 (Good), 740-799 (Very Good), 800-850 (Excellent). Most lenders consider 740+ to be excellent.";
  }
  
  // Tax planning
  if (message.includes("tax") || message.includes("taxes") || message.includes("deduction") || message.includes("write-off") || message.includes("irs")) {
    return "Tax planning can save you significant money. Consider these strategies:\n\n1. Maximize tax-advantaged accounts like 401(k)s, IRAs, and HSAs\n2. Keep track of deductible expenses throughout the year\n3. Consider bunching itemized deductions in certain years\n4. Harvest investment losses to offset gains\n5. Contribute to a 529 plan for education expenses\n\nRemember that tax laws change frequently, so consult with a tax professional for personalized advice based on your specific situation.";
  }
  
  // Retirement planning
  if (message.includes("retire") || message.includes("retirement") || message.includes("401k") || message.includes("ira") || message.includes("pension")) {
    return "Planning for retirement is essential for long-term financial security. Here's how to prepare:\n\n1. Start saving as early as possible to benefit from compound growth\n2. Aim to save 15% of your income for retirement (including employer matches)\n3. Maximize tax-advantaged accounts in this order:\n   - 401(k) or 403(b) up to employer match\n   - HSA if eligible (triple tax advantage)\n   - Roth IRA or Traditional IRA\n   - Remainder in 401(k) or taxable accounts\n4. Adjust your asset allocation to become more conservative as you approach retirement\n5. Consider working with a fee-only financial advisor for personalized retirement planning\n\nThe 4% rule suggests you can withdraw about 4% of your retirement savings annually without running out of money. This means you need approximately 25 times your annual expenses saved for retirement.";
  }
  
  // Financial goal setting
  if (message.includes("goal") || message.includes("plan") || message.includes("future") || message.includes("target")) {
    return "Setting financial goals is key to long-term success. Follow these steps:\n\n1. Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound\n2. Categorize goals as short-term (< 1 year), medium-term (1-5 years), and long-term (5+ years)\n3. Prioritize goals based on importance and urgency\n4. Break down larger goals into smaller, actionable steps\n5. Regularly review and adjust your goals as circumstances change\n\nWhat specific financial goals are you currently working toward?";
  }
  
  // Insurance questions
  if (message.includes("insurance") || message.includes("insure") || message.includes("coverage") || message.includes("protect")) {
    return "Insurance is crucial for protecting your financial health. Here are key types to consider:\n\n1. Health insurance - Provides coverage for medical expenses\n2. Auto insurance - Required for drivers in most states\n3. Homeowners/renters insurance - Protects your property and possessions\n4. Life insurance - Provides for dependents in case of your death\n5. Disability insurance - Replaces income if you're unable to work\n6. Umbrella policy - Additional liability coverage above other policies\n\nReview your insurance coverage annually and whenever you experience major life changes (marriage, children, new home, etc.). Always shop around for the best rates while ensuring adequate coverage.";
  }
  
  // Default response for other financial questions
  return "That's an interesting financial question. To provide the best advice, I'd need to understand more about your specific financial situation, goals, and timeline. Could you provide more details about your current financial circumstances and what you're hoping to achieve?";
}
