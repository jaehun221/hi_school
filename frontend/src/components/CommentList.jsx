import React from "react";

const CommentList = ({ comments, onEdit, onDelete }) => (
  <ul>
    {comments.map((comment) => (
      <li key={comment.id}>
        <b>{comment.author}</b>: {comment.content}
        {onEdit && <button onClick={() => onEdit(comment)}>수정</button>}
        {onDelete && <button onClick={() => onDelete(comment.id)}>삭제</button>}
      </li>
    ))}
  </ul>
);

export default CommentList;
