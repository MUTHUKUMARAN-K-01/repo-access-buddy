
import { useState } from "react";
import { nanoid } from "nanoid";
import { apiRequest } from "../lib/queryClient";

export function useChat() {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Using a default user ID of 1 for demonstration
  const userId = 1;

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
