import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { Send } from "lucide-react";

type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function FinanceChat() {
  const { messages, isLoading, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Card className="w-full">
      <div className="p-6 bg-blue-50 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">chat</span>
          Chat with FinanceGuru
        </h3>
        <p className="text-gray-600 mt-1">Ask any questions about your personal finances</p>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4" id="chat-messages">
        {messages.length === 0 ? (
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="material-icons text-blue-600">account_balance</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-w-3xl">
              <p className="text-gray-700">
                Hello! I'm FinanceGuru, your personal finance assistant. I can help you with budgeting, investing, debt management, and more. How can I assist you with your financial journey today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex items-start ${message.isUser ? 'justify-end' : ''}`}>
              {!message.isUser && (
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">account_balance</span>
                  </div>
                </div>
              )}
              <div className={`${message.isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-4 max-w-3xl`}>
                <p className="text-gray-700 whitespace-pre-line">{message.text}</p>
              </div>
              {message.isUser && (
                <div className="flex-shrink-0 ml-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="material-icons text-gray-600">person</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="material-icons text-blue-600">account_balance</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-w-3xl animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <CardContent className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask FinanceGuru a question..."
            className="flex-1 border-gray-200 focus:border-blue-300 rounded-l-md py-3 px-4"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-md py-3 px-4 h-[46px]"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          <span className="material-icons text-xs align-middle">info</span>
          Remember: This advice is informational only. For personalized legal advice, please consult a certified financial planner.
        </p>
      </CardContent>
    </Card>
  );
}
