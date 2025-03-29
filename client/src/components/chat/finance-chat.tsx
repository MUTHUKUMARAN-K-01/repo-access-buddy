import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat, AIModel, AIModelOption } from "@/hooks/use-chat";
import { Loader, Send, Search, Filter, Star, Bot, Key, Sparkles } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function FinanceChat() {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    selectedModel, 
    changeModel,
    filteredModels,
    availableModels,
    isLoadingModels,
    selectedOpenRouterModel,
    changeOpenRouterModel,
    hasApiKey,
    showFreeModelsOnly,
    toggleShowFreeModelsOnly,
    modelCategories,
    selectedCategory,
    changeCategory
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    sendMessage(newMessage);
    setNewMessage("");
  };
  
  // Filter models by search query
  const searchFilteredModels = filteredModels.filter(model => {
    if (model.id === 'local') return true;
    if (!searchQuery) return true;
    
    return model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           model.id.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get free models count for display
  const freeModelsCount = availableModels.filter(m => m.id !== 'local' && m.isFree).length;

  return (
    <Card className="w-full">
      <div className="p-6 bg-blue-50 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="material-icons mr-2">chat</span>
                Chat with FinanceGuru
              </h3>
              <p className="text-gray-600 mt-1">Ask any questions about your personal finances</p>
            </div>
            
            {/* API Key Status */}
            {hasApiKey ? (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex gap-1 items-center">
                <Key className="h-3 w-3" />
                API Key Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 flex gap-1 items-center">
                <Key className="h-3 w-3" />
                No API Key
              </Badge>
            )}
          </div>
          
          {/* Model Selector */}
          <div className="mt-4">
            <Tabs defaultValue="local" value={selectedModel} onValueChange={(value) => changeModel(value as AIModel)}>
              <TabsList className="w-full">
                <TabsTrigger value="local" className="flex-1 gap-2">
                  <Bot className="h-4 w-4" />
                  <span>Local AI</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="openrouter" 
                  className="flex-1 gap-2"
                  disabled={!hasApiKey}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>OpenRouter Models</span>
                  {freeModelsCount > 0 && (
                    <Badge variant="outline" className="ml-1 bg-green-50 text-green-800 border-green-200">
                      {freeModelsCount} Free
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="local" className="mt-2">
                <div className="text-sm text-gray-600">
                  Using FinanceGuru's built-in language model for basic financial questions. No external API calls.
                </div>
              </TabsContent>
              
              <TabsContent value="openrouter" className="mt-2">
                {hasApiKey ? (
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                      {/* Search input */}
                      <div className="relative w-full md:w-auto flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search models..."
                          className="pl-8 pr-4"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
                        />
                      </div>
                      
                      {/* Filters */}
                      <div className="flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Filter className="h-4 w-4" />
                              <span>{selectedCategory}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Categories</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {modelCategories.map(category => (
                              <DropdownMenuItem 
                                key={category}
                                onClick={() => changeCategory(category)}
                                className={selectedCategory === category ? "bg-accent" : ""}
                              >
                                {category}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            id="free-only"
                            checked={showFreeModelsOnly}
                            onCheckedChange={toggleShowFreeModelsOnly}
                          />
                          <Label htmlFor="free-only" className="text-sm cursor-pointer flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" /> 
                            Free Only
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Model selection grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto">
                      {isLoadingModels ? (
                        <div className="col-span-full flex items-center justify-center p-4">
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading models...</span>
                        </div>
                      ) : searchFilteredModels.length === 0 ? (
                        <div className="col-span-full text-center p-4 text-gray-500">
                          No models match your search criteria.
                        </div>
                      ) : (
                        searchFilteredModels
                          .filter(model => model.id !== 'local')
                          .map(model => (
                            <Button
                              key={model.id}
                              variant={selectedOpenRouterModel === model.id ? "default" : "outline"}
                              className="justify-start overflow-hidden"
                              onClick={() => changeOpenRouterModel(model.id)}
                            >
                              <div className="truncate flex items-center gap-2">
                                {model.isFree && <Star className="h-3 w-3 flex-shrink-0 text-yellow-500" />}
                                <span className="truncate">
                                  {model.name}
                                </span>
                              </div>
                            </Button>
                          ))
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-2">
                      Selected: <span className="font-semibold">{
                        availableModels.find(m => m.id === selectedOpenRouterModel)?.name ||
                        selectedOpenRouterModel.split('/').pop()
                      }</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center border rounded-md bg-yellow-50">
                    <p className="text-amber-800">
                      OpenRouter API key is required to use AI models. 
                      Please add an environment secret named <code>OPENROUTER_API_KEY</code>.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
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
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">
            <span className="material-icons text-xs align-middle">info</span>
            Remember: This advice is informational only. For personalized legal advice, please consult a certified financial planner.
          </p>
          <p className="text-xs text-gray-500">
            <span className="material-icons text-xs align-middle">smart_toy</span>
            Using {selectedModel === 'local' ? 'Local AI' : 
              selectedModel === 'openrouter' ? 
                `OpenRouter: ${selectedOpenRouterModel.split('/').pop()}` : 
                'Unknown'} model
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
