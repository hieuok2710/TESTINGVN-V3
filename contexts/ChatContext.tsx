import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CHAT_STORAGE_KEY = 'app_chat_data';

export interface ChatMessage {
    from: string; // username or 'admin'
    to: string; // username or 'admin'
    text: string;
    timestamp: number;
}

interface ChatData {
    conversations: { [username: string]: ChatMessage[] };
    onlineAdmins: string[];
    onlineUsers: string[];
}

interface ChatContextType {
    conversations: { [username: string]: ChatMessage[] };
    onlineAdmins: string[];
    onlineUsers: string[];
    sendMessage: (to: string, text: string) => void;
    getUnreadCount: (username?: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const getStoredChatData = (): ChatData => {
    try {
        const storedData = localStorage.getItem(CHAT_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error("Failed to parse chat data from localStorage", e);
    }
    return { conversations: {}, onlineAdmins: [], onlineUsers: [] };
};

const saveChatData = (data: ChatData) => {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save chat data to localStorage", e);
    }
};


export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [chatData, setChatData] = useState<ChatData>(getStoredChatData);

    const handleStorageChange = useCallback((event: StorageEvent) => {
        if (event.key === CHAT_STORAGE_KEY) {
            setChatData(getStoredChatData());
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [handleStorageChange]);
    
    // Manage online status
    useEffect(() => {
        const updateOnlineStatus = (status: 'online' | 'offline') => {
            if (!user) return;
            
            const currentData = getStoredChatData();
            const { username, type } = user;

            if (type === 'admin') {
                const admins = new Set(currentData.onlineAdmins);
                if (status === 'online') admins.add(username);
                else admins.delete(username);
                currentData.onlineAdmins = Array.from(admins);
            } else {
                 const users = new Set(currentData.onlineUsers);
                if (status === 'online') users.add(username);
                else users.delete(username);
                currentData.onlineUsers = Array.from(users);
            }
            saveChatData(currentData);
        };

        if (user) {
            updateOnlineStatus('online');
        }

        const handleBeforeUnload = () => {
            updateOnlineStatus('offline');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (user) {
                updateOnlineStatus('offline');
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user]);

    const sendMessage = (to: string, text: string) => {
        if (!user || !text.trim()) return;

        const from = user.type === 'admin' ? 'admin' : user.username;

        const newMessage: ChatMessage = {
            from,
            to,
            text: text.trim(),
            timestamp: Date.now(),
        };

        const currentData = getStoredChatData();
        
        const conversationKey = user.type === 'admin' ? to : user.username;

        if (!currentData.conversations[conversationKey]) {
            currentData.conversations[conversationKey] = [];
        }
        currentData.conversations[conversationKey].push(newMessage);
        
        setChatData(currentData);
        saveChatData(currentData);
    };

    const getUnreadCount = (username?: string) => {
        // This is a placeholder for potential future unread message tracking logic.
        return 0;
    };
    
    return (
        <ChatContext.Provider value={{ 
            conversations: chatData.conversations,
            onlineAdmins: chatData.onlineAdmins,
            onlineUsers: chatData.onlineUsers,
            sendMessage,
            getUnreadCount,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
