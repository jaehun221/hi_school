import { useEffect, useState } from "react";
import { getPost, updatePost } from "../api/postApi";
import { useNavigate, useParams } from "react-router-dom";

const EditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ title: "", author: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id).then((res) => setPost(res.data));
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePost(id, post).then(() => navigate(`/posts/${id}`));
  };

  return (
    <div>
      <h2>글 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="제목"
          value={post.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="작성자"
          value={post.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="내용"
          value={post.content}
          onChange={handleChange}
          required
        />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default EditPostPage;
