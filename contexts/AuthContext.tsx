import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type SubscriptionPlan = '1-month' | '3-month' | '6-month';

interface User {
    username: string;
    type: 'admin' | 'user';
    className?: string;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionExpiry?: string; // YYYY-MM-DD
}

interface StoredUser extends User {
    password?: string; // Password should be handled securely in a real app
    fullName?: string;
}

interface AuthContextType {
    user: User | null;
    users: StoredUser[];
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    addUser: (newUser: StoredUser) => Promise<void>;
    deleteUser: (username: string) => Promise<void>;
    updateUserSubscription: (username: string, plan: SubscriptionPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUsers = (): StoredUser[] => {
    try {
        const storedUsers = localStorage.getItem('app_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
    }
    // Default admin user if storage is empty or invalid
    return [{ username: 'admin', password: 'admin@##', type: 'admin', fullName: 'Administrator' }];
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<StoredUser[]>(getStoredUsers);

     useEffect(() => {
        try {
            localStorage.setItem('app_users', JSON.stringify(users));
        } catch (e) {
            console.error("Failed to save users to localStorage", e);
        }
    }, [users]);


    const login = async (username: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundUser = users.find(u => u.username === username && u.password === password);
                if (foundUser) {
                    setUser({ 
                        username: foundUser.username, 
                        type: foundUser.type, 
                        className: foundUser.className,
                        subscriptionPlan: foundUser.subscriptionPlan,
                        subscriptionExpiry: foundUser.subscriptionExpiry
                    });

                    // Track login event for statistics
                    try {
                        const loginsRaw = localStorage.getItem('app_logins');
                        const logins = loginsRaw ? JSON.parse(loginsRaw) : [];
                        logins.push(username);
                        localStorage.setItem('app_logins', JSON.stringify(logins));
                    } catch (e) {
                        console.error("Failed to record login for statistics", e);
                    }

                    resolve();
                } else {
                    reject(new Error('Tên đăng nhập hoặc mật khẩu không hợp lệ.'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
    };
    
    const addUser = async (newUser: StoredUser): Promise<void> => {
         return new Promise((resolve, reject) => {
            if (users.some(u => u.username === newUser.username)) {
                return reject(new Error('Tên đăng nhập đã tồn tại.'));
            }
            setUsers(prevUsers => [...prevUsers, newUser]);
            resolve();
        });
    };

    const deleteUser = async (usernameToDelete: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (user?.username === usernameToDelete) {
                return reject(new Error("Bạn không thể xóa chính mình."));
            }
            
            const userToDeleteData = users.find(u => u.username === usernameToDelete);
            if (!userToDeleteData) {
                 return reject(new Error("Người dùng không tồn tại."));
            }
            
            const adminUsers = users.filter(u => u.type === 'admin');
            if (userToDeleteData.type === 'admin' && adminUsers.length <= 1) {
                return reject(new Error("Không thể xóa quản trị viên cuối cùng."));
            }

            setUsers(prevUsers => prevUsers.filter(u => u.username !== usernameToDelete));
            resolve();
        });
    };

    const updateUserSubscription = async (username: string, plan: SubscriptionPlan): Promise<void> => {
        return new Promise((resolve, reject) => {
            const userIndex = users.findIndex(u => u.username === username);
            if (userIndex === -1) {
                return reject(new Error("User not found."));
            }
            
            const expiryDate = new Date();
            switch (plan) {
                case '1-month':
                    expiryDate.setMonth(expiryDate.getMonth() + 1);
                    break;
                case '3-month':
                    expiryDate.setMonth(expiryDate.getMonth() + 3);
                    break;
                case '6-month':
                    expiryDate.setMonth(expiryDate.getMonth() + 6);
                    break;
                default:
                    return reject(new Error("Invalid plan."));
            }
            
            const expiryDateString = expiryDate.toISOString().split('T')[0];

            setUsers(prevUsers => {
                const newUsers = [...prevUsers];
                const updatedUser = {
                    ...newUsers[userIndex],
                    subscriptionPlan: plan,
                    subscriptionExpiry: expiryDateString,
                };
                newUsers[userIndex] = updatedUser;
                return newUsers;
            });
            
            // If the updated user is the current user, update the context's user state as well
            if (user?.username === username) {
                setUser(prevUser => prevUser ? { ...prevUser, subscriptionPlan: plan, subscriptionExpiry: expiryDateString } : null);
            }

            resolve();
        });
    };


    return (
        <AuthContext.Provider value={{ user, users, login, logout, addUser, deleteUser, updateUserSubscription }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};