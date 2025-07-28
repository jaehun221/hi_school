import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
const BASE_URL = "http://localhost:8090/api";

// 게시글 목록 (페이지네이션 지원)
export const getPosts = async (page = 1, size = 20) => {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const idToken = await user.getIdToken();
  console.log("token:", idToken); // 이 값이 실제로 출력되는지 확인!
  return axios.get(`${BASE_URL}/posts`, {
    params: { page, size },
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
