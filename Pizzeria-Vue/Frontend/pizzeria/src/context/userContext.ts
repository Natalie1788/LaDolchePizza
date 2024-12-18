import { reactive, provide, inject } from "vue";

interface User {
  id: string;
  username: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const userSymbol = Symbol("user");

// Передаем контекст
export const useUserProvider = () => {
  const state = reactive<UserState>({
    user: null,
    setUser(user) {
      state.user = user;
    },
    clearUser() {
      state.user = null;
    },
  });

  provide(userSymbol, state);
};

// Инжектим контекст и получаем userId
export const useUser = () => {
  const context = inject(userSymbol) as UserState | undefined;

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
