import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat, ChatMessage } from '../contexts/ChatContext';

const ChatBubble: React.FC<{ message: ChatMessage; isOwn: boolean }> = ({ message, isOwn }) => {
    const alignment = isOwn ? 'justify-end' : 'justify-start';
    const bubbleColor = isOwn ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800';

    return (
        <div className={`flex ${alignment} mb-3`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${bubbleColor}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 text-right ${isOwn ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

const ChatWidget: React.FC = () => {
    const { user } = useAuth();
    const { conversations, onlineAdmins, sendMessage } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    // For admin
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const hasUnread = false; // Placeholder for notification logic

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, selectedUser, isOpen]);
    
    // For admin, select the first conversation by default
    useEffect(() => {
        if (user?.type === 'admin' && !selectedUser) {
            const userKeys = Object.keys(conversations);
            if (userKeys.length > 0) {
                setSelectedUser(userKeys[0]);
            }
        }
    }, [user, conversations, selectedUser]);
    

    if (!user) return null;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (user.type === 'user') {
            sendMessage('admin', message);
        } else if (user.type === 'admin' && selectedUser) {
            sendMessage(selectedUser, message);
        }
        setMessage('');
    };

    const renderUserView = () => {
        const myConversation = conversations[user.username] || [];
        const isAdminOnline = onlineAdmins.length > 0;
        
        return (
             <div className="flex flex-col h-full">
                <header className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div>
                        <h3 id="chat-title" className="font-bold text-lg">Hỗ trợ trực tuyến</h3>
                        <div className="flex items-center text-xs text-indigo-200">
                             <span className={`w-2 h-2 rounded-full mr-2 ${isAdminOnline ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                             <span>{isAdminOnline ? 'Admin đang online' : 'Admin đang offline'}</span>
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                    {myConversation.map((msg, index) => (
                        <ChatBubble key={index} message={msg} isOwn={msg.from === user.username} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {renderChatInput()}
            </div>
        );
    };

    const renderAdminView = () => {
        const userList = Object.keys(conversations);
        const currentConversation = selectedUser ? (conversations[selectedUser] || []) : [];

        return (
             <div className="flex h-full">
                {/* User list sidebar */}
                <aside className="w-1/3 bg-slate-100 border-r border-slate-200 flex flex-col">
                    <header className="p-4 border-b">
                        <h3 id="chat-title" className="font-bold text-slate-800">Hội thoại</h3>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        {userList.length > 0 ? userList.map(u => (
                             <button key={u} onClick={() => setSelectedUser(u)} className={`w-full text-left p-4 hover:bg-slate-200 ${selectedUser === u ? 'bg-indigo-100' : ''}`}>
                                 <p className="font-semibold text-slate-700">{u}</p>
                             </button>
                        )) : (
                            <p className="p-4 text-sm text-slate-500">Chưa có hội thoại nào.</p>
                        )}
                    </div>
                </aside>

                {/* Chat area */}
                <main className="w-2/3 flex flex-col">
                    <header className="bg-white p-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">{selectedUser || 'Chọn một hội thoại'}</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                        {selectedUser ? currentConversation.map((msg, index) => (
                            <ChatBubble key={index} message={msg} isOwn={msg.from === 'admin'} />
                        )) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-slate-500">Chọn một người dùng để xem tin nhắn.</p>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                     {selectedUser && renderChatInput()}
                </main>
            </div>
        );
    };

    const renderChatInput = () => (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-lg">
            <div className="flex items-center bg-slate-100 rounded-full">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="w-full bg-transparent px-4 py-2 outline-none text-sm"
                />
                <button type="submit" className="p-2 text-indigo-600 hover:text-indigo-800" aria-label="Send message">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </form>
    );

    const adminWindowSize = "w-[600px] h-[500px]";
    const userWindowSize = "w-full max-w-sm h-[500px]";

    return (
        <div className="fixed bottom-4 right-4 z-[49]">
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className={`fixed bottom-20 right-4 rounded-lg shadow-2xl bg-white overflow-hidden animate-fade-in-up ${user.type === 'admin' ? adminWindowSize : userWindowSize}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="chat-title"
                >
                    {user.type === 'admin' ? renderAdminView() : renderUserView()}
                </div>
            )}

            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {hasUnread && !isOpen && <span className="absolute -top-1 -right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
                {isOpen ? (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;