import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number>(1); // Default user id for demo, would be from auth context
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history on mount
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/chat/${userId}?limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to load chat history');
        }
        
        const data = await response.json();
        
        // Transform the chat data to our message format
        const formattedMessages = data.map((msg: any) => ({
          id: nanoid(),
          text: msg.message,
          isUser: msg.isUserMessage === 1
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Don't show error toast on initial load to avoid confusion
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

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
        isUserMessage: 1
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
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Remove the optimistically added message on error
      setMessages((prev) => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}
