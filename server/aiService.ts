import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Generate a response to a user's finance question using OpenAI
 * @param userMessage The user's finance-related question or message
 * @param chatHistory Previous messages for context (optional)
 * @returns AI-generated response
 */
export async function generateFinanceResponse(userMessage: string, chatHistory: string[] = []): Promise<string> {
  try {
    // Default fallback response if API call fails
    let response = "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
    
    if (!process.env.OPENAI_API_KEY) {
      return "API key not configured. Please set the OPENAI_API_KEY environment variable.";
    }

    // Format chat history for the API with proper typing
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
    ];
    
    // Add chat history if available
    if (chatHistory.length > 0) {
      for (let i = 0; i < chatHistory.length; i += 2) {
        if (i < chatHistory.length) {
          messages.push({ role: 'user' as const, content: chatHistory[i] });
        }
        if (i + 1 < chatHistory.length) {
          messages.push({ role: 'assistant' as const, content: chatHistory[i + 1] });
        }
      }
    }
    
    // Add the current user message
    messages.push({ role: 'user' as const, content: userMessage });

    // Make API request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract and return the generated response
    if (completion.choices && completion.choices.length > 0) {
      response = completion.choices[0].message.content || response;
    }

    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Return a helpful message with the specific error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "API key error. Please check your OpenAI API key configuration.";
      }
      return `I'm having trouble generating a response: ${error.message}`;
    }
    
    // Generic fallback
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

/**
 * Simple fallback function that returns predefined responses for common financial questions
 * Uses basic keyword matching - only used if the API integration fails
 * @param userMessage User's question
 * @returns Predefined response based on keywords in the question
 */
export function generateLocalFinanceResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Budget-related questions
  if (message.includes("budget") || message.includes("spending") || message.includes("expenses")) {
    return "To create an effective budget, track your income and expenses for a month, categorize spending, set realistic goals, and use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.";
  }
  
  // Saving-related questions
  if (message.includes("save") || message.includes("saving") || message.includes("emergency fund")) {
    return "For savings, aim to build an emergency fund covering 3-6 months of expenses. Automate transfers to a high-yield savings account on payday, and consider setting specific goals with deadlines to stay motivated.";
  }
  
  // Debt-related questions
  if (message.includes("debt") || message.includes("loan") || message.includes("credit card")) {
    return "To tackle debt effectively, list all debts with interest rates, focus on high-interest debt first (debt avalanche) or start with small balances for quick wins (debt snowball). Always pay more than the minimum payment when possible.";
  }
  
  // Investment-related questions
  if (message.includes("invest") || message.includes("stock") || message.includes("retirement")) {
    return "For beginning investors, start with your employer's 401(k) if available, especially if they match contributions. Consider low-cost index funds for diversification, and look into Roth IRAs for tax-advantaged retirement savings.";
  }
  
  // Generic response for other questions
  return "I can help with budgeting, saving, debt management, and investing. Could you provide more details about your financial situation or question?";
}