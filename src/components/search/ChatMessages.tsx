
import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Chat, ChatMessage } from '@/types/chat';

interface ChatMessagesProps {
  activeChat: Chat | null;
  isAssistantLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ activeChat, isAssistantLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <AnimatedTransition
        show={activeChat?.messages.length === 0 && !isAssistantLoading}
        animation="fade"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-xl font-medium">Chat with Your Second Brain</h3>
          <p className="text-muted-foreground">
            Ask questions and chat with your notes, documents, and knowledge base.
          </p>
        </div>
      </AnimatedTransition>
      
      <div className="space-y-4">
        {activeChat?.messages.map((message: ChatMessage) => (
          <div 
            key={message.id}
            className={cn(
              "flex gap-3 p-4 rounded-lg",
              message.type === 'user' 
                ? "bg-primary/10 ml-auto max-w-[80%]" 
                : "bg-muted/10 mr-auto max-w-[80%]"
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              message.type === 'user' ? "bg-primary/20" : "bg-secondary/20"
            )}>
              {message.type === 'user' ? (
                <User size={16} className="text-primary" />
              ) : (
                <Bot size={16} className="text-secondary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isAssistantLoading && (
            <div className="flex gap-3 p-4 rounded-lg bg-muted/10 mr-auto max-w-[80%]">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary/20">
                    <Bot size={16} className="text-secondary" />
                </div>
                <div className="flex-1 flex items-center">
                    <div className="typing-indicator">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                </div>
            </div>
        )}

        {activeChat?.messages.length > 0 && activeChat.messages[activeChat.messages.length - 1].type === 'assistant' && !isAssistantLoading && (
          <div className="p-4 glass-panel rounded-xl space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Suggested Results</h3>
            <div className="space-y-3">
              {['Artificial Intelligence', 'Machine Learning', 'Neural Networks'].map((result, index) => (
                <div 
                  key={index}
                  className="p-3 hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <h4 className="font-medium">{result}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Related to your search query
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
