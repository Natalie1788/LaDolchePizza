<template>
  <div v-if="isAuthorized">
    <form @submit.prevent="handleSubmit">
      <textarea
        v-model="commentText"
        :placeholder="isEditing ? 'Update your comment' : 'Write your comment'"
        required
      ></textarea>
      <button type="submit">
        {{ isEditing ? "Update Comment" : "Submit Comment" }}
      </button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
    </form>
  </div>
  <div v-else>
    <p>You need to be logged in to leave a comment.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  props: ["pizzaId"], // Получаем ID пиццы, для которой оставляем комментарий
  setup(props) {
    const commentText = ref(""); // Текст комментария
    const isAuthorized = ref(false); // Состояние для проверки авторизации
    const isEditing = ref(false); // Флаг редактирования
    const editingCommentId = ref(null); // ID редактируемого комментария

    // Функция для проверки наличия токена
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      isAuthorized.value = !!token;
    };

    // Функция для отправки нового комментария
    const submitComment = async () => {
      try {
        const token = localStorage.getItem("token"); // Получаем токен
        const response = await fetch("http://localhost:5800/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
          },
          body: JSON.stringify({
            text: commentText.value,
            pizzaId: props.pizzaId,
          }),
        });

        const newComment = await response.json();
        console.log("Comment added:", newComment);

        // Очищаем форму
        commentText.value = "";
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };

    // Функция для обновления комментария
    const updateComment = async () => {
      try {
        const token = localStorage.getItem("token"); // Получаем токен
        const response = await fetch(
          `http://localhost:5800/comments/${editingCommentId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
            },
            body: JSON.stringify({
              text: commentText.value,
            }),
          }
        );

        const updatedComment = await response.json();
        console.log("Comment updated:", updatedComment);

        // Сбрасываем режим редактирования
        cancelEdit();
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    };

    // Функция для отправки комментария (создание или обновление)
    const handleSubmit = () => {
      if (isEditing.value) {
        updateComment();
      } else {
        submitComment();
      }
    };

    // Функция для начала редактирования
    const startEdit = (commentId, text) => {
      isEditing.value = true;
      editingCommentId.value = commentId;
      commentText.value = text;
    };

    // Функция для отмены редактирования
    const cancelEdit = () => {
      isEditing.value = false;
      editingCommentId.value = null;
      commentText.value = "";
    };

    // Проверка авторизации при монтировании компонента
    onMounted(() => {
      checkAuthorization(); // Проверяем авторизацию
    });

    return {
      commentText,
      submitComment,
      updateComment,
      handleSubmit,
      isAuthorized,
      isEditing,
      editingCommentId,
      startEdit,
      cancelEdit,
    };
  },
};
</script>
