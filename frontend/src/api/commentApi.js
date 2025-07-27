import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
const BASE_URL = "http://localhost:8090/api";

export const getComments = async (postId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.get(`${BASE_URL}/posts/${postId}/comments`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const addComment = async (postId, data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.post(`${BASE_URL}/posts/${postId}/comments`, data, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const updateComment = async (postId, commentId, data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.put(`${BASE_URL}/posts/${postId}/comments/${commentId}`, data, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};

export const deleteComment = async (postId, commentId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  return axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
};
