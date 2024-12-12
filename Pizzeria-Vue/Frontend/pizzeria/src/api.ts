import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5800", // Замените на ваш URL бэкенда
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

/*export const getPizzas = async () => {
  try {
    const response = await apiClient.get("/pizzas");
    return response.data;
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    throw error;
  }
};*/
