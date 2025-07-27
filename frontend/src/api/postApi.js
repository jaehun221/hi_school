import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
const BASE_URL = "http://localhost:8090/api";

export const getPosts = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.get(`${BASE_URL}/posts`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const getPost = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.get(`${BASE_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const createPost = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  // author, authorUid도 함께 백엔드로 전송
  return axios.post(`${BASE_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};


export const updatePost = async (id, data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.put(`${BASE_URL}/posts/${id}`, data, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const deletePost = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.delete(`${BASE_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};
