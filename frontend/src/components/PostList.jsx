import React from "react";
import { Link } from "react-router-dom";

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <div>게시글이 없습니다.</div>;
  }
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
