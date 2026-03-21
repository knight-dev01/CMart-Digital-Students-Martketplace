import api from './api';
import { Conversation, ChatMessage } from '@/types';

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get('/chat/conversations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/chat/messages/?conversation=${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  sendMessage: async (conversationId: number, text: string): Promise<ChatMessage> => {
    try {
      const response = await api.post('/chat/messages/', {
        conversation: conversationId,
        text: text
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  startConversation: async (participantId: number, productId?: number): Promise<Conversation> => {
    try {
      const response = await api.post('/chat/conversations/', {
        participants: [participantId],
        product: productId
      });
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  getOrCreateConversation: async (participantId: number): Promise<Conversation> => {
    try {
      const conversations = await chatService.getConversations();
      const existing = conversations.find((c: Conversation) => 
        c.participants.some((p: any) => p.id === participantId)
      );
      if (existing) return existing;
      return await chatService.startConversation(participantId);
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error);
      throw error;
    }
  }
};
