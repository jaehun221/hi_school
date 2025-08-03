import React, { useState } from "react";
import CommentForm from "./CommentForm";

const CommentReplies = ({
  children,
  depth,
  ...props
}) => (
  <div style={{ marginTop: 8 }}>
    {(children ?? []).map(child => (
      <CommentItem key={child.id} comment={child} depth={depth} {...props} />
    ))}
  </div>
);

const CommentItem = ({
  comment,
  depth,
  onEdit,
  onDelete,
  darkMode,
  currentUser,
  editingCommentId,
  onSubmitReply,
  replyTo,
  setReplyTo
}) => (
  <div style={{ marginLeft: depth * 24, marginBottom: 12 }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: darkMode ? "#181e24" : "#f7fafd",
      borderRadius: 7,
      padding: "12px 18px",
      fontSize: 16,
      boxShadow: darkMode
        ? "0 1px 4px rgba(20,40,80,0.08)"
        : "0 1px 4px rgba(60,120,160,0.04)"
    }}>
      <div style={{ width: "100%" }}>
        <span style={{
          color: darkMode ? "#8ec6ff" : "#236B8E",
          fontWeight: "bold",
          marginRight: 10
        }}>
          {comment.authorNickname ? comment.authorNickname : (comment.author || "익명")}
        </span>
        <span style={{ color: darkMode ? "#b3e5fc" : "#999", fontSize: 14 }}>
          {comment.createdAt && comment.createdAt.split("T")[0]}
        </span>
        <div style={{
          color: darkMode ? "#c3eafc" : "#222",
          marginTop: 2,
          whiteSpace: "pre-line"
        }}>
          {comment.content}
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 6 }}>
          {currentUser && comment.authorUid === currentUser.uid && (
            <>
              <button
                onClick={() => onEdit(comment)}
                style={{
                  background: darkMode ? "#2e3a4a" : "#e2f0ff",
                  color: darkMode ? "#b3e5fc" : "#236B8E",
                  border: "none",
                  borderRadius: 5,
                  padding: "6px 18px",
                  minWidth: 65,
                  height: "40px",
                  fontSize: 15,
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginRight: 2,
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >수정</button>
              <button
                onClick={() => onDelete(comment.id)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  padding: "6px 18px",
                  minWidth: 65,
                  height: "40px",
                  fontSize: 15,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >삭제</button>
            </>
          )}
          <button
            onClick={() => setReplyTo(comment.id)}
            style={{
              background: darkMode ? "#222" : "#f0f0f0",
              color: darkMode ? "#b3e5fc" : "#236B8E",
              border: "none",
              borderRadius: 5,
              padding: "4px 13px",
              fontSize: 13,
              cursor: "pointer"
            }}
          >답글</button>
        </div>
        {replyTo === comment.id && (
          <div style={{ marginTop: 10 }}>
            <CommentForm
              onSubmit={async (data) => {
                await onSubmitReply({ ...data, parentId: comment.id });
                setReplyTo(null);
              }}
              darkMode={darkMode}
              onCancel={() => setReplyTo(null)}
              parentId={comment.id}
              initialValue={{
                author: comment.author,
                authorUid: comment.authorUid,
                authorNickname: comment.authorNickname
              }}
            />
          </div>
        )}
      </div>
    </div>
    <CommentReplies
      children={comment.children ?? []}
      depth={depth + 1}
      onEdit={onEdit}
      onDelete={onDelete}
      darkMode={darkMode}
      currentUser={currentUser}
      editingCommentId={editingCommentId}
      onSubmitReply={onSubmitReply}
      replyTo={replyTo}
      setReplyTo={setReplyTo}
    />
  </div>
);

const CommentList = ({
  comments,
  onEdit,
  onDelete,
  darkMode = false,
  currentUser,
  editingCommentId,
  onSubmitReply = () => {}
}) => {
  const [replyTo, setReplyTo] = useState(null);

  return (
    <div>
      {(comments ?? []).map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
          darkMode={darkMode}
          currentUser={currentUser}
          editingCommentId={editingCommentId}
          onSubmitReply={onSubmitReply}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
        />
      ))}
    </div>
  );
};

export default CommentList;
