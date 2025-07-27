import React, { useEffect, useState } from "react";
import { getPost, deletePost } from "../api/postApi";
import { getComments, addComment, updateComment, deleteComment } from "../api/commentApi";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import PostDetail from "../components/PostDetail";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

  // 게시글/댓글 데이터 불러오기
  useEffect(() => {
    getPost(id).then((res) => setPost(res.data));
    getComments(id).then((res) => setComments(res.data));
  }, [id]);

  // 작성자인지 확인 (작성자만 삭제/수정 가능)
  const isAuthor = currentUser && post && post.authorUid === currentUser.uid;

  // 게시글 삭제
  const handleDeletePost = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deletePost(id).then(() => navigate("/"));
    }
  };

  // 댓글 추가
  const handleAddComment = (data) => {
    addComment(id, data).then(() =>
      getComments(id).then((res) => setComments(res.data))
    );
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    deleteComment(id, commentId).then(() =>
      getComments(id).then((res) => setComments(res.data))
    );
  };

  // 댓글 수정 진입
  const handleEditComment = (comment) => {
    setEditingComment(comment);
  };

  // 댓글 수정 저장
  const handleUpdateComment = (data) => {
    updateComment(id, editingComment.id, data).then(() => {
      setEditingComment(null);
      getComments(id).then((res) => setComments(res.data));
    });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <PostDetail post={post} />
      {/* 작성자만 게시글 삭제 버튼 노출 */}
      {isAuthor && (
        <button onClick={handleDeletePost} style={{ color: "red" }}>
          게시글 삭제
        </button>
      )}

      <h3>댓글</h3>
      <CommentList
        comments={comments}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
      />
      <h4>댓글 작성</h4>
      {editingComment ? (
        <CommentForm
          onSubmit={handleUpdateComment}
          initialValue={editingComment}
        />
      ) : (
        <CommentForm onSubmit={handleAddComment} />
      )}
    </div>
  );
};

export default PostPage;
