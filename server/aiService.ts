
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export type AIModel = 'local' | 'openrouter';

interface AIModelInfo {
  id: string;
  name: string;
}

const systemPrompt = `You are a helpful AI assistant specialized in financial advice. You help users with budgeting, investments, savings strategies, debt management, and other personal finance topics.

Please provide concise, accurate information based on generally accepted financial principles. If you don't know something or if a question requires very specific professional advice, recommend consulting with a financial advisor.

Avoid making specific investment recommendations like "buy this stock" or "invest in this fund". Instead, discuss principles, strategies, and considerations.

When discussing concepts, explain them in simple terms first, then provide more details if needed.`;

export async function fetchOpenRouterModels(): Promise<AIModelInfo[]> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key is not available');
    }

    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    // Extract supported models and sort them by category
    const models = response.data.data
      .filter((model: any) => 
        // Only include models that support text generation
        model.supports_chat || model.supports_completion
      )
      .map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
        category: model.category || 'other'
      }));

    // Sort models by category
    models.sort((a: {category: string | undefined, id: string}, b: {category: string | undefined, id: string}) => {
      // Handle undefined categories by treating them as 'other'
      const categoryA = a.category || 'other';
      const categoryB = b.category || 'other';
      
      return categoryA.localeCompare(categoryB);
    });

    return models;
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return fallbackOpenRouterModels;
  }
}

// Fallback models if API call fails
export const fallbackOpenRouterModels: AIModelInfo[] = [
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B' }
];

export async function generateFinanceResponse(
  userMessage: string,
  chatHistory: string[],
  modelType: AIModel,
  selectedModelId: string = 'openai/gpt-4o'
): Promise<string> {
  // If using local model, use the simpler implementation
  if (modelType === 'local') {
    return generateLocalFinanceResponse(userMessage);
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key is not available');
    }

    // Format messages for the API
    const messages = [
      { role: 'system', content: systemPrompt },
      // Include the most recent messages from the chat history (up to 5)
      ...chatHistory.slice(-5).map((message, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant', 
        content: message
      })),
      { role: 'user', content: userMessage }
    ];

    // Call the OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModelId,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://finance-tracker.lovable.dev',
          'X-Title': 'AI Finance Tracker'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`API returned status code: ${response.status}`);
    }

    const aiResponse = response.data.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response content received from API');
    }

    return aiResponse;
  } catch (error) {
    console.error('Error with OpenRouter API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    // Fall back to local response generation
    return generateLocalFinanceResponse(userMessage);
  }
}

// Local implementation for generating finance responses
export function generateLocalFinanceResponse(userMessage: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();

  // Investment related query
  if (lowerCaseMessage.includes("invest") || lowerCaseMessage.includes("stock") || lowerCaseMessage.includes("bond") || lowerCaseMessage.includes("fund")) {
    return "Thanks for your question about investing! Before recommending specific investments, I'd like to understand your overall financial situation better:\n\n1. Do you have an emergency fund with 3-6 months of expenses?\n2. Do you have any high-interest debt that should be paid off first?\n3. What are your investment goals (retirement, house down payment, etc.)?\n4. What's your risk tolerance and time horizon?\n\nWith this information, I can provide more personalized investment advice.";
  }

  // Debt related query
  else if (lowerCaseMessage.includes("debt") || lowerCaseMessage.includes("credit") || lowerCaseMessage.includes("loan")) {
    return "Regarding debt management, here are some key strategies that could help:\n\n- List all your debts with their interest rates and minimum payments\n- Consider the debt avalanche method (paying highest interest first) to minimize interest costs\n- Look into balance transfer options for high-interest credit cards\n- Maintain on-time payments to improve your credit score\n\nCould you share what types of debt you're dealing with and their approximate amounts and interest rates?";
  }

  // Budget related query
  else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("spend") || lowerCaseMessage.includes("save")) {
    return "Creating an effective budget is the foundation of financial success! Here are some steps to get started:\n\n1. Track all your income and expenses for a month\n2. Categorize your spending (housing, food, transport, etc.)\n3. Look for areas where you can cut back\n4. Set specific saving goals\n5. Use the 50/30/20 rule as a guideline: 50% for needs, 30% for wants, and 20% for savings/debt repayment\n\nWhat's your biggest challenge when it comes to budgeting?";
  }

  // Retirement related query
  else if (lowerCaseMessage.includes("retire") || lowerCaseMessage.includes("401k") || lowerCaseMessage.includes("ira")) {
    return "Planning for retirement is crucial for long-term financial security. Here are some key considerations:\n\n1. Start saving early to benefit from compound growth\n2. Take advantage of tax-advantaged accounts like 401(k)s and IRAs\n3. If your employer offers a match, contribute at least enough to get the full match\n4. Diversify your investments based on your age and risk tolerance\n5. Regularly review and adjust your retirement strategy\n\nAt what age do you hope to retire, and have you started saving yet?";
  }

  // Generic response for other queries
  else {
    return "Thank you for your question! To provide the most helpful advice, could you share a bit more about your specific financial situation and goals? This will help me tailor my response to your needs.";
  }
}
