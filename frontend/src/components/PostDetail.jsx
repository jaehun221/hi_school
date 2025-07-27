import React from "react";

const PostDetail = ({ post }) => {
  if (!post) return <div>게시글이 없습니다.</div>;
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div>작성자: {post.author}</div>
    </div>
  );
};

export default PostDetail;
