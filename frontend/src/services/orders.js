import axios from "axios";

const API_URL = "http://localhost:5000"; // your backend URL

// Get all orders
export const getOrders = async () => {
  try {
    const token = localStorage.getItem("token"); // if you use JWT
    const response = await axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
