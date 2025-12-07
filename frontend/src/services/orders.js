import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Get all orders or user orders
export const getOrders = async (endpoint = "") => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Optional: create, update, delete functions
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(API_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
