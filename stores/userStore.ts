import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user-related properties as needed
}

interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;

  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  fetchUsers: () => Promise<void>; // Example async action
  clearError: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
  currentUser: null, // Could be populated after login from NextAuth session
  users: [],
  isLoading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),

  clearError: () => set({ error: null }),

  // Example asynchronous action to fetch users
  // In a real app, this would make an API call
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUsers: User[] = [
        { id: '1', name: 'Alice Wonderland', email: 'alice@example.com' },
        { id: '2', name: 'Bob The Builder', email: 'bob@example.com' },
      ];
      set({ users: mockUsers, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to fetch users:", err);
    }
  },
}));

export default useUserStore;
