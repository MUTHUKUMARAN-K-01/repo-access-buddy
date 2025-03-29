
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { apiRequest } from "../lib/queryClient";

export type AIModel = 'openrouter' | 'local';

export interface AIModelOption {
  id: string;
  name: string;
}

export function useChat() {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('local');
  const [selectedOpenRouterModel, setSelectedOpenRouterModel] = useState<string>('openai/gpt-4o');
  const [availableModels, setAvailableModels] = useState<AIModelOption[]>([
    { id: 'local', name: 'Local AI (No API)' }
  ]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Using a default user ID of 4 for demonstration (user that was created in the database)
  const userId = 4;

  // Load available AI models
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const response = await apiRequest('GET', '/api/ai-models');
        if (!response.ok) {
          throw new Error('Failed to fetch available AI models');
        }
        const data = await response.json();
        setAvailableModels(data.models);
      } catch (error) {
        console.error('Error fetching AI models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);

  const sendMessage = async (text: string) => {
    // Optimistically add user message to state
    const userMessageId = nanoid();
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, text, isUser: true }
    ]);

    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        userId,
        message: text,
        isUserMessage: 1,
        modelType: selectedModel,
        selectedModelId: selectedOpenRouterModel
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), text: data.aiMessage.message, isUser: false }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change the AI model
  const changeModel = (model: AIModel) => {
    setSelectedModel(model);
  };
  
  // Function to change the specific OpenRouter model
  const changeOpenRouterModel = (modelId: string) => {
    setSelectedOpenRouterModel(modelId);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    selectedModel,
    changeModel,
    availableModels,
    isLoadingModels,
    selectedOpenRouterModel,
    changeOpenRouterModel
  };
}
