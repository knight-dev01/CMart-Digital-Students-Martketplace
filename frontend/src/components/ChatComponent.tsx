import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '@/services/chat';

export const ChatOverlay = ({ isOpen, onClose, selectedUser }: { isOpen: boolean, onClose: () => void, selectedUser?: any }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [conversationId, setConversationId] = useState<number | null>(null);

    // Initial load and conversation creation
    React.useEffect(() => {
        if (isOpen && selectedUser) {
            const initChat = async () => {
                try {
                    // Try to find an existing conversation or create a new one
                    // For now, we'll try to fetch all conversations and find the one with this user
                    const conversations = await chatService.getConversations();
                    const existing = conversations.find((c: any) => 
                        c.participants.some((p: any) => p.username === selectedUser.username)
                    );

                    if (existing) {
                        setConversationId(existing.id);
                        setMessages(existing.messages || []);
                    } else if (selectedUser.id) {
                        const newConv = await chatService.startConversation(selectedUser.id);
                        setConversationId(newConv.id);
                        setMessages([]);
                    }
                } catch (err) {
                    console.error("Chat init error:", err);
                }
            };
            initChat();
        }
    }, [isOpen, selectedUser]);

    // Simple Polling for new messages
    React.useEffect(() => {
        let interval: any;
        if (isOpen && conversationId) {
            interval = setInterval(async () => {
                const newMsgs = await chatService.getMessages(conversationId);
                if (newMsgs.length !== messages.length) {
                    setMessages(newMsgs);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isOpen, conversationId, messages.length]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!message.trim() || !conversationId) return;
        try {
            const sentMsg = await chatService.sendMessage(conversationId, message);
            setMessages([...messages, sentMsg]);
            setMessage('');
        } catch (err) {
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--card-bg)] w-full max-w-lg h-[90vh] sm:h-[600px] rounded-t-[3rem] sm:rounded-[3rem] border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-[var(--border-color)] bg-emerald-600 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
                            <span className="text-white font-black uppercase text-sm">{selectedUser?.username?.[0] || 'C'}</span>
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-tight text-sm">Chatting with {selectedUser?.username || 'CMart Team'}</h2>
                            <p className="text-emerald-100 text-[8px] font-bold uppercase tracking-widest">Always keep transactions within CMart</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === user?.username ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] px-6 py-4 rounded-[1.5rem] shadow-sm ${msg.sender === user?.username ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-tl-none'}`}>
                                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2 mx-1">{msg.time} • {msg.sender}</span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
                    <div className="relative flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a secure message..."
                            className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 pr-16 text-xs font-bold outline-none focus:border-emerald-500 transition-all shadow-inner"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
