<template>
  <div v-if="pizza">
    <div class="pizza-container">
      <div>
        <img
          v-if="pizzaImage"
          :src="pizzaImage.src"
          :alt="pizzaImage.alt"
          class="pizza-image"
        />
      </div>

      <div>
        <h1>{{ pizza.name }}</h1>

        <p class="price-text">Price: {{ pizza.price }} €</p>
        <ul class="ingredients-list">
          <li v-for="ingredient in pizza.ingredients" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>

        <!-- Комментарии -->
        <div v-if="comments.length">
          <h3>Comments: {{ commentCount }}</h3>
          <ul class="comments-list">
            <li
              class="comment-text"
              v-for="comment in comments"
              :key="comment._id"
            >
              <span>
                <b>{{ comment.userId?.username }}</b
                >: {{ comment.text }}
              </span>
              <!-- Кнопка удаления -->
              <button class="del-btn" @click="deleteComment(comment._id)">
                X
              </button>
              <button
                class="edit-btn"
                @click="startEdit(comment._id, comment.text)"
              >
                Edit
              </button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No comments yet. Be the first to comment!</p>
        </div>

        <!-- Форма для добавления/редактирования комментария -->
        <div v-if="isAuthorized">
          <form @submit.prevent="handleSubmit">
            <textarea
              class="textarea"
              v-model="commentText"
              :placeholder="
                isEditing ? 'Update your comment' : 'Write your comment'
              "
              required
            ></textarea>
            <button class="submite-btn" type="submit">
              {{ isEditing ? "Update Comment" : "Submit Comment" }}
            </button>
            <button
              class="cancel-btn"
              v-if="isEditing"
              type="button"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </form>
        </div>
        <div v-else>
          <p>You need to be logged in to leave a comment.</p>
        </div>
      </div>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { pizzaImages } from "@/components/PizzaImages";
import { computed } from "vue";
import { useCommentCountStore } from "@/stores/commentsStore";

export default {
  props: ["id"], // Принимаем ID пиццы из маршрута

  setup(props) {
    const pizza = ref(null);
    const pizzaImage = ref(null); // Изображение пиццы
    const comments = ref([]); // Состояние для хранения комментариев
    const commentText = ref(""); // Текст комментария
    const isAuthorized = ref(false); // Состояние для проверки авторизации
    const isEditing = ref(false); // Флаг редактирования
    const editingCommentId = ref(null); // ID редактируемого комментария
    const commentCountStore = useCommentCountStore();

    const updateCommentCount = () => {
      commentCountStore.updateCommentCount(props.id, comments.value.length);
    };

    // Функция для получения комментариев для этой пиццы
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5800/comments/pizza/${props.id}`
        );
        comments.value = await response.json();
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    //  вычисляемое свойство для подсчёта комментариев
    const commentCount = computed(() => comments.value.length);

    // Функция для удаления комментария
    const deleteComment = async (commentId) => {
      try {
        const token = localStorage.getItem("token"); // Получаем токен
        const response = await fetch(
          `http://localhost:5800/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Передаем токен
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete comment");
        }

        console.log("Comment deleted successfully");

        // Обновляем список комментариев после удаления
        comments.value = comments.value.filter(
          (comment) => comment._id !== commentId
        );
        updateCommentCount();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    };

    // Функция для проверки наличия токена (авторизация)
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
            pizzaId: props.id,
          }),
        });

        const newComment = await response.json();
        console.log("Comment added:", newComment);

        // Очищаем форму
        commentText.value = "";
        comments.value.push(newComment); // Добавляем новый комментарий в список
        updateCommentCount();
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };

    // Функция для обновления комментария
    const updateComment = async () => {
      try {
        const token = localStorage.getItem("token"); // Получаем токен
        const response = await fetch(
          `http://localhost:5800/comments/${editingCommentId.value}`,
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

        // Обновляем комментарий в списке
        const index = comments.value.findIndex(
          (comment) => comment._id === editingCommentId.value
        );
        if (index !== -1) {
          comments.value[index] = updatedComment;
        }

        cancelEdit(); // Сбрасываем режим редактирования
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

    // Загружаем пиццу и комментарии при монтировании компонента
    const fetchPizza = async () => {
      try {
        const response = await fetch(
          `http://localhost:5800/pizzas/${props.id}`
        );
        pizza.value = await response.json();
        pizzaImage.value = pizzaImages.find(
          (image) => image.pizzaId === props.id
        );
        fetchComments(); // Получаем комментарии для пиццы после загрузки пиццы
      } catch (error) {
        console.error("Error fetching pizza:", error);
      }
    };

    // Проверка авторизации при монтировании компонента
    onMounted(() => {
      checkAuthorization(); // Проверяем авторизацию
      fetchPizza(); // Загружаем пиццу и комментарии
    });

    return {
      pizza,
      pizzaImage,
      comments,
      commentText,
      commentCount,
      isAuthorized,
      isEditing,
      editingCommentId,
      submitComment,
      updateComment,
      handleSubmit,
      startEdit,
      cancelEdit,
      deleteComment,
    };
  },
};
</script>

<style scoped>
.pizza-container {
  display: flex;
  /*align-items: center;*/
  justify-content: center;
  margin: 50px;
}
.pizza-image {
  width: 80%;
  height: auto;
  border-radius: 5px;
  border: 2px solid darkgreen;
}
.ingredients-list {
  list-style-type: none;
  padding: 10px;
}
.price-text {
  color: darkgreen;
  margin: 20px;
}
.textarea {
  width: 93%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
}
.comments-list {
  list-style: none;
}
.comment-text {
  background-color: white;
  border: 1px solid darkgray;
  border-radius: 5px;
  margin-block: 10px;
  padding: 10px;
}
.del-btn {
  margin-left: 50px;
  margin-right: 10px;
  padding: 5px;
  background-color: rgb(105, 228, 105);
}
.edit-btn {
  padding: 5px;
  background-color: rgb(105, 228, 105);
}
.submite-btn,
.cancel-btn {
  background-color: rgb(105, 228, 105);
  padding: 5px;
  text-align: center;
  width: 100%;
}
</style>
