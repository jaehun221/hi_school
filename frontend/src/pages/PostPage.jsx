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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    getPost(id).then((res) => setPost(res.data));
    getComments(id).then((res) => setComments(res.data));
  }, [id]);

  // 작성자인지 확인
  const isAuthor = currentUser && post && post.authorUid === currentUser.uid;

  // 게시글 삭제
  const handleDeletePost = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deletePost(id).then(() => navigate("/"));
    }
  };

  // 댓글 추가
  const handleAddComment = (data) => {
    addComment(id, {
      ...data,
      authorUid: currentUser.uid,
      authorNickname: currentUser.displayName || currentUser.email // 또는 닉네임 필드
    }).then(() =>
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

  if (!post) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: darkMode ? "#b3e5fc" : "#236B8E",
        fontSize: 20
      }}>
        불러오는 중...
      </div>
    );
  }

  return (
    <div
      style={{
        background: darkMode ? "#121212" : "#f5f9fa",
        minHeight: "100vh",
        padding: "38px 0",
        fontFamily: "sans-serif"
      }}
    >
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: darkMode ? "#23272f" : "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "38px 40px 36px 40px"
      }}>
        {/* 게시글 상세 */}
        <PostDetail post={post} />

        {/* 게시글 삭제/수정 버튼 (작성자만) */}
        {isAuthor && (
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button
              onClick={handleDeletePost}
              style={{
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "7px 20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 15,
                marginRight: 6
              }}
            >
              게시글 삭제
            </button>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div style={{
          marginTop: 44,
          background: darkMode ? "#20242a" : "#f9f9f9",
          borderRadius: 8,
          padding: "24px 18px 22px 18px",
          boxShadow: darkMode ? "0 1px 3px rgba(20,40,80,0.11)" : "0 1px 3px rgba(180,200,255,0.07)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18
          }}>
            <h3 style={{
              color: darkMode ? "#5fd3f3" : "#236B8E",
              fontSize: 20,
              margin: 0
            }}>댓글</h3>
            {/* 다크모드 스위치 */}
            <label style={{ fontSize: 15, cursor: "pointer" }}>
              <span role="img" aria-label="다크모드" style={{ marginRight: 4 }}>🌙</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(v => !v)}
                style={{ marginRight: 2 }}
              />다크모드
            </label>
          </div>
          <CommentList
            comments={comments}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            darkMode={darkMode}
            currentUser={currentUser}
          />
          <div style={{
            marginTop: 30,
            padding: "18px 8px 0 8px",
            borderTop: darkMode ? "1px solid #1c2833" : "1px solid #e4e7ed"
          }}>
            <h4 style={{
              margin: 0,
              color: darkMode ? "#5fd3f3" : "#236B8E",
              fontWeight: "bold"
            }}>댓글 작성</h4>
            {editingComment ? (
              <CommentForm
                onSubmit={handleUpdateComment}
                initialValue={editingComment}
                darkMode={darkMode}
                onCancel={() => setEditingComment(null)}
              />
            ) : (
              <CommentForm
                onSubmit={handleAddComment}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
