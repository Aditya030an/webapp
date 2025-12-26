const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default fetchApi;
