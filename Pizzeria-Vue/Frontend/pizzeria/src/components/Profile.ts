import { ref } from "vue";

const userProfile = ref(null);
const error = ref<string | null>(null);
const loading = ref(true);

async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    error.value = "User is not authenticated";
    loading.value = false;
    return;
  }

  try {
    const response = await fetch("http://localhost:5800/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }

    userProfile.value = await response.json();
  } catch (err: any) {
    error.value = err.message || "An error occurred";
  } finally {
    loading.value = false;
  }
}

export { userProfile, fetchUserProfile, error };
