import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getProducts = () => API.get("/api/products");
export const addProduct = (data) => API.post("/api/products", data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
