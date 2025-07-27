import React, { useState } from "react";
import { createPost } from "../api/postApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 인증 유저 정보

  const handleSubmit = (e) => {
    e.preventDefault();
    // 닉네임과 uid를 자동으로 입력
    createPost({
      title,
      content,
      author: currentUser.displayName,  // 닉네임(구글/이메일 가입 등에서 지정)
      authorUid: currentUser.uid,       // 고유 uid
    }).then(() => navigate("/"));
  };

  return (
    <div>
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* 작성자 입력란은 아예 제거 */}
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
