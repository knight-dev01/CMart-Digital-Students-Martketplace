'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { chatService } from '@/services/chat';
import { useAuth } from '@/components/AuthContext';
import { Conversation, ChatMessage } from '@/types';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const searchParams = useSearchParams();
    const convId = searchParams.get('convId');

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await chatService.getConversations();
                setConversations(data);
                
                // If convId is in URL, auto-select it
                if (convId) {
                    const target = data.find((c: Conversation) => c.id === parseInt(convId));
                    if (target) {
                        setSelectedConv(target);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [convId]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (selectedConv) {
            const fetchMessages = async () => {
                const data = await chatService.getMessages(selectedConv.id);
                setMessages(data);
                scrollToBottom();
            };
            fetchMessages();
            interval = setInterval(fetchMessages, 4000);
        }
        return () => clearInterval(interval);
    }, [selectedConv]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;
        try {
            const sent = await chatService.sendMessage(selectedConv.id, newMessage);
            setMessages([...messages, sent]);
            setNewMessage('');
            scrollToBottom();
        } catch (err) {
            alert("Failed to send message.");
        }
    };

    if (loading) return <LoadingScreen message="Opening your inbox..." />;

    return (
        <div className="min-h-screen bg-[var(--background)] pt-20 pb-24 sm:pb-8 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto h-[80vh] bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-emerald-500/5">
                
                {/* Sidebar: Conversation List */}
                <div className={`w-full md:w-80 border-r border-[var(--border-color)] flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
                        <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Inbox</h2>
                        <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg">{conversations.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {conversations.length === 0 ? (
                            <div className="p-12 text-center opacity-40">
                                <p className="text-[10px] font-black uppercase tracking-widest">No chats yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const otherParticipant = conv.participants.find((p: any) => p.username !== user?.username);
                                return (
                                    <button 
                                        key={conv.id}
                                        onClick={() => setSelectedConv(conv)}
                                        className={`w-full p-6 flex items-center gap-4 transition-all border-b border-[var(--border-color)]/50 hover:bg-[var(--foreground)]/5 ${selectedConv?.id === conv.id ? 'bg-[var(--foreground)]/10' : ''}`}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center border-2 border-[var(--background)] shadow-lg overflow-hidden shrink-0">
                                            {otherParticipant?.avatar ? (
                                                <img src={otherParticipant.avatar} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-black uppercase">{otherParticipant?.username?.[0] || '?'}</span>
                                            )}
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-sm font-black text-[var(--foreground)] truncate uppercase tracking-tight">{otherParticipant?.username || 'Buyer'}</p>
                                            <p className="text-[10px] font-medium text-[var(--text-muted)] truncate">{conv.last_message || 'Start chatting...'}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-[var(--background)]/50 ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--card-bg)]">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedConv(null)} className="md:hidden p-2 -ml-2 text-[var(--text-muted)]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white uppercase text-xs">
                                        {selectedConv.participants.find((p: any) => p.username !== user?.username)?.username?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">@{selectedConv.participants.find((p: any) => p.username !== user?.username)?.username}</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Online - Secure Chat</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] hover:text-red-500 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                </button>
                            </div>

                            {/* Conversation Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--text-muted)] flex items-center justify-center">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Start of a secured campus chat</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div key={i} className={`flex flex-col ${msg.sender === user?.username ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`max-w-[85%] px-6 py-4 rounded-[1.8rem] shadow-sm relative group ${msg.sender === user?.username ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] rounded-tl-none'}`}>
                                                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                                {/* Fancy timestamp on hover appearance? maybe not for marketplace */}
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 px-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">{String(msg.sender)} • {msg.timestamp}</span>
                                                {msg.sender === user?.username && (
                                                     <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-8 bg-[var(--card-bg)] border-t border-[var(--border-color)]">
                                <form onSubmit={handleSend} className="relative flex items-center gap-4">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message representing CMart..."
                                        className="flex-1 bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 pr-16 text-xs font-bold outline-none focus:border-emerald-500 transition-all shadow-inner"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-emerald-600 text-white p-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </form>
                                <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-4 text-center">Never share sensitive info like passwords or PINs. Keep payments within CMart.</p>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8 animate-in fade-in duration-700">
                             <div className="relative">
                                <div className="w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] absolute inset-0 -z-10 animate-pulse"></div>
                                <div className="w-24 h-24 bg-[var(--card-bg)] rounded-[2rem] border border-[var(--border-color)] flex items-center justify-center shadow-2xl relative z-10">
                                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                             </div>
                             <div>
                                <h2 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-2">CMart Inbox</h2>
                                <p className="text-[var(--text-muted)] font-medium max-w-xs mx-auto">Select a student or vendor to start your next campus deal.</p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
