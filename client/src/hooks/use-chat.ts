
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { apiRequest } from "../lib/queryClient";

export type AIModel = 'openrouter' | 'local';

export interface AIModelOption {
  id: string;
  name: string;
  isFree?: boolean;
  category?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('local');
  const [selectedOpenRouterModel, setSelectedOpenRouterModel] = useState<string>('openai/gpt-4o');
  const [availableModels, setAvailableModels] = useState<AIModelOption[]>([
    { id: 'local', name: 'Local AI (No API)' }
  ]);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [modelCategories, setModelCategories] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [showFreeModelsOnly, setShowFreeModelsOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
        setHasApiKey(data.hasApiKey);
        
        // Extract unique categories for filtering
        if (data.models && data.models.length > 1) {
          const categories = new Set<string>(
            data.models
              .filter((model: AIModelOption) => model.id !== 'local' && model.category)
              .map((model: AIModelOption) => model.category || 'Other')
          );
          setModelCategories(['All', ...Array.from(categories)]);
        }
        
        // Set default OpenRouter model to a free one if available
        if (data.models.length > 1) {
          const freeModel = data.models.find((m: AIModelOption) => m.id !== 'local' && m.isFree);
          if (freeModel) {
            setSelectedOpenRouterModel(freeModel.id);
          } else if (data.models.length > 1) {
            // Or just select the first non-local model
            const firstNonLocal = data.models.find((m: AIModelOption) => m.id !== 'local');
            if (firstNonLocal) {
              setSelectedOpenRouterModel(firstNonLocal.id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching AI models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);

  // Filtered models based on selected category and free-only setting
  const filteredModels = availableModels.filter(model => {
    if (model.id === 'local') return true;
    
    const categoryMatch = selectedCategory === 'All' || model.category === selectedCategory;
    const freeMatch = !showFreeModelsOnly || model.isFree;
    
    return categoryMatch && freeMatch;
  });

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
  
  // Toggle showing only free models
  const toggleShowFreeModelsOnly = () => {
    setShowFreeModelsOnly(prev => !prev);
  };
  
  // Change category filter
  const changeCategory = (category: string) => {
    setSelectedCategory(category);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    selectedModel,
    changeModel,
    availableModels,
    filteredModels,
    isLoadingModels,
    selectedOpenRouterModel,
    changeOpenRouterModel,
    hasApiKey,
    showFreeModelsOnly,
    toggleShowFreeModelsOnly,
    modelCategories,
    selectedCategory,
    changeCategory
  };
}
