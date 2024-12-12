import { defineStore } from "pinia";

interface CommentCountState {
  commentCounts: Record<string, number>; // Счётчики комментариев по ID пиццы
}

export const useCommentCountStore = defineStore("commentCount", {
  state: (): CommentCountState => ({
    commentCounts: {},
  }),
  getters: {
    getCommentCount:
      (state) =>
      (pizzaId: string): number => {
        return state.commentCounts[pizzaId] || 0;
      },
  },
  actions: {
    updateCommentCount(pizzaId: string, count: number) {
      this.commentCounts[pizzaId] = count;
    },
  },
});
