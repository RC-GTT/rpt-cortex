import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat, ChatMessage } from '@/types/chat';
import { generateId, createNewChat as createNewChatUtil } from '@/utils/chatUtils';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  // Initialize with a sample chat on first render
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = createNewChatUtil();
      setChats([newChat]);
      setActiveChat(newChat);
    }
  }, []);

  // Create a new chat
  const createNewChat = () => {
    const newChat = createNewChatUtil();
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  // Delete a chat
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    // If we deleted the active chat, set the first available chat as active
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(updatedChats.length > 0 ? updatedChats[0] : null);
    }
    
    // If no chats left, create a new one
    if (updatedChats.length === 0) {
      createNewChat();
    }
  };

  // Edit chat title
  const startEditingTitle = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setIsEditingTitle(chatId);
      setEditTitle(chat.title);
    }
  };

  const saveTitle = (chatId: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, title: editTitle || 'Untitled Chat' };
      }
      return chat;
    });
    setChats(updatedChats);
    setIsEditingTitle(null);
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && activeChat) {
      const userMessage: ChatMessage = {
        id: generateId(),
        type: 'user',
        content: searchQuery,
        timestamp: new Date()
      };
      
      let chatWithUserMessage = activeChat;

      const updatedChats = chats.map(chat => {
        if (chat.id === activeChat.id) {
          let updatedTitle = chat.title;
          if (chat.messages.length === 0) {
            updatedTitle = searchQuery.length > 25 
              ? `${searchQuery.substring(0, 22)}...` 
              : searchQuery;
          }
          
          chatWithUserMessage = {
            ...chat,
            title: updatedTitle,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date()
          };
          return chatWithUserMessage;
        }
        return chat;
      });
      
      setChats(updatedChats);
      setActiveChat(chatWithUserMessage);
      setSearchQuery('');
      setIsAssistantLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke('gemini-search', {
          body: { prompt: userMessage.content },
        });

        if (error) {
          throw error; // Throw the original error to be caught below
        }

        const aiMessage: ChatMessage = {
          id: generateId(),
          type: 'assistant',
          content: data.response || "Sorry, I couldn't get a response. Please try again.",
          timestamp: new Date()
        };

        const finalChats = updatedChats.map(chat => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, aiMessage],
              updatedAt: new Date()
            };
          }
          return chat;
        });

        setChats(finalChats);
        const finalActiveChat = finalChats.find(chat => chat.id === activeChat.id);
        if (finalActiveChat) {
          setActiveChat(finalActiveChat);
        }

      } catch (err: any) {
        console.error("Error invoking gemini-search:", err);
        const description = err.context?.message || err.message || "An unknown error occurred.";
        toast({
          title: "Error",
          description: `Failed to get AI response: ${description}`,
          variant: "destructive",
        });
        const errorMessage: ChatMessage = {
          id: generateId(),
          type: 'assistant',
          content: "Sorry, I encountered an error. Please check the function logs and your API key.",
          timestamp: new Date()
        };
        const chatsWithEror = updatedChats.map(chat => {
            if (chat.id === activeChat.id) {
                return { ...chat, messages: [...chat.messages, errorMessage] };
            }
            return chat;
        });
        setChats(chatsWithEror);
        setActiveChat(chatsWithEror.find(c => c.id === activeChat.id) || null);

      } finally {
        setIsAssistantLoading(false);
      }
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex">
      {/* Sidebar with chat history */}
      <ChatSidebar 
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        showSidebar={showSidebar}
        isEditingTitle={isEditingTitle}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        startEditingTitle={startEditingTitle}
        saveTitle={saveTitle}
      />
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header with toggle */}
        <div className="border-b py-2 px-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            <SearchIcon size={18} />
          </Button>
          <h2 className="font-medium">
            {activeChat?.title || 'Universal Search'}
          </h2>
        </div>
        
        {/* Chat messages area */}
        <ChatMessages activeChat={activeChat} isAssistantLoading={isAssistantLoading} />
        
        {/* Input area */}
        <ChatInput 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSubmit={handleSubmit}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </div>
    </div>
  );
};

export default Search;
