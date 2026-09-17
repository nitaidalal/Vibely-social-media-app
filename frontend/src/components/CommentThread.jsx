import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/api";
import { FaUserLarge } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import moment from "moment";

// ✅ Confirmation Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-xl p-6 max-w-sm mx-4">
        <h2 className="text-lg font-bold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-hover hover:bg-border text-text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-danger hover:bg-red-600 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
const CommentItem = ({
  comment,
  postAuthorId,
  level = 0,
  getReplies,
  countReplies,
  expandedReplies,
  setExpandedReplies,
  replyingToId,
  setReplyingToId,
  replyContent,
  setReplyContent,
  editingId,
  setEditingId,
  editContent,
  setEditContent,
  replyInputRef,
  editInputRef,
  loading,
  handleAddReply,
  handleEditComment,
  handleDeleteComment,
  isCommentAuthor,
  canDelete,
}) => {
  const replies = getReplies(comment._id);
  const totalReplies = countReplies(comment._id);
  const isExpanded = expandedReplies[comment._id];

  const shouldHideDeletedComment = comment.isDeleted && replies.length === 0;
  if (shouldHideDeletedComment) {
    return null;
  }


  return (
    <div style={{ marginLeft: `${level * 24}px` }} className="space-y-2 ">
      <div
        className={`border border-border rounded-xl p-3 transition-colors duration-150 ${
          comment.isDeleted
            ? "bg-surface/60"
            : "bg-surface hover:bg-surface-hover"
        }`}
      >
        {!comment.isDeleted ? (
          <>
            {/* Normal Comment Header */}
            <div className="flex items-start gap-2.5 mb-2">
              <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border-2 border-primary/50 bg-linear-to-r from-primary to-accent flex items-center justify-center">
                {comment.author?.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserLarge className="text-text-primary text-xs" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-text-primary text-sm truncate">
                      {comment.author?.username}
                    </p>

                    <p className="text-text-muted text-xs whitespace-nowrap">
                      {moment(comment.createdAt).fromNow()}
                    </p>

                    {comment.editedAt && (
                      <span className="text-text-muted text-xs italic">
                        (edited)
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {isCommentAuthor(comment) && (
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="p-1.5 cursor-pointer hover:bg-surface-hover rounded-lg transition-colors text-text-secondary hover:text-primary"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                    )}

                    {canDelete(comment, postAuthorId) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1.5 cursor-pointer hover:bg-red-500/15 rounded-lg transition-colors text-text-secondary hover:text-danger"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Mode */}
            {editingId === comment._id ? (
              <div className="mb-2">
                <textarea
                  ref={editInputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-surface-hover border border-border rounded-lg p-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Edit your comment..."
                  rows={1}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={loading || !editContent.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-hover hover:bg-border text-text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Content */
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                {comment.content}
              </p>
            )}

            {/* Reply Button */}
            {level < 2 && (
              <button
                onClick={() =>
                  setReplyingToId(
                    replyingToId === comment._id ? null : comment._id,
                  )
                }
                className="text-primary text-sm font-semibold hover:underline cursor-pointer"
              >
                {replyingToId === comment._id ? "Cancel" : "Reply"}
              </button>
            )}
          </>
        ) : (
          <div className="py-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border-2 border-primary/50 bg-linear-to-r from-primary to-accent flex items-center justify-center">
                {comment.author?.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserLarge className="text-text-primary text-xs" />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text-primary text-sm">
                    {comment.author?.username}
                  </p>

                  <p className="text-text-muted text-xs">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>

                <p className="text-text-muted italic text-sm">
                  This comment was deleted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {replyingToId === comment._id && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
          <textarea
            ref={replyInputRef}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg p-2.5 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            placeholder="Write a reply..."
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddReply}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading || !replyContent.trim()}
            >
              Reply
            </button>
            <button
              onClick={() => {
                setReplyingToId(null);
                setReplyContent("");
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-hover hover:bg-border text-text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {totalReplies > 0 && (
        <div className="mt-2">
          <button
            onClick={() =>
              setExpandedReplies((prev) => ({
                ...prev,
                [comment._id]: !isExpanded,
              }))
            }
            className="flex items-center gap-1 text-primary text-sm font-medium hover:underline transition-colors mb-2 cursor-pointer"
          >
            {isExpanded ? "▼" : "▶"}
            <span>
              {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
            </span>
          </button>

          {isExpanded && (
            <div className="space-y-2">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postAuthorId={postAuthorId}
                  level={level + 1}
                  getReplies={getReplies}
                  countReplies={countReplies}
                  expandedReplies={expandedReplies}
                  setExpandedReplies={setExpandedReplies}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  replyInputRef={replyInputRef}
                  editInputRef={editInputRef}
                  loading={loading}
                  handleAddReply={handleAddReply}
                  handleEditComment={handleEditComment}
                  handleDeleteComment={handleDeleteComment}
                  isCommentAuthor={isCommentAuthor}
                  canDelete={canDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentThread = ({
  comments,
  postId,
  postAuthorId,
  vibeId,
  isVibe = false,
  onCommentUpdate,
}) => {
  const { userData } = useSelector((state) => state.user);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, commentId: null });
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  const topLevelComments = comments?.filter((c) => !c.parentCommentId ) || [];

  const getReplies = (commentId) => {
    return (
      comments?.filter(
        (c) => c.parentCommentId?.toString() === commentId.toString(),
      ) || []
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };
  useEffect(() => {
    if (replyingToId && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingToId]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      // ✅ Move cursor to the end of the text
      const length = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(length, length-1);
    }
  }, [editingId]);

  const countReplies = (commentId) => {
    const directReplies = getReplies(commentId);
    return directReplies.reduce(
      (count, reply) => count + 1 + countReplies(reply._id),
      0,
    );
  };

  const handleAddReply = async () => {
    if (!replyContent.trim()) return;
    try {
      setLoading(true);
      const endpoint = isVibe
        ? `/vibes/comment/${vibeId}/reply/${replyingToId}`
        : `/posts/comment/${postId}/reply/${replyingToId}`;
      const response = await axiosInstance.post(
        endpoint,
        { content: replyContent },
        { withCredentials: true },
      );
      if (onCommentUpdate)
        onCommentUpdate(response.data[isVibe ? "vibe" : "post"]);
      setReplyContent("");
      setReplyingToId(null);
      toast.success("Reply added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      setLoading(true);
      const endpoint = isVibe
        ? `/vibes/comment/${vibeId}/${commentId}`
        : `/posts/comment/${postId}/${commentId}`;
      const response = await axiosInstance.patch(
        endpoint,
        { content: editContent },
        { withCredentials: true },
      );
      if (onCommentUpdate)
        onCommentUpdate(response.data[isVibe ? "vibe" : "post"]);
      setEditingId(null);
      setEditContent("");
      toast.success("Comment updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeleteConfirm({ isOpen: true, commentId });
  };

  const confirmDelete = async () => {
    const commentId = deleteConfirm.commentId;
    try {
      setLoading(true);
      const endpoint = isVibe
        ? `/vibes/comment/${vibeId}/${commentId}`
        : `/posts/comment/${postId}/${commentId}`;
      const response = await axiosInstance.delete(endpoint, { withCredentials: true });
      if (onCommentUpdate)
        onCommentUpdate(response.data[isVibe ? "vibe" : "post"]);
      toast.success("Comment deleted");
      setDeleteConfirm({ isOpen: false, commentId: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  const isCommentAuthor = (comment) => userData?._id === comment.author._id;
  const canDelete = (comment, postAuthorId) =>
    userData?._id === comment.author._id || userData?._id === postAuthorId;

  // Shared props passed down to every CommentItem
  const sharedProps = {
    getReplies,
    countReplies,
    expandedReplies,
    setExpandedReplies,
    replyingToId,
    setReplyingToId,
    replyContent,
    setReplyContent,
    editingId,
    setEditingId,
    editContent,
    setEditContent,
    replyInputRef,
    editInputRef,
    loading,
    handleAddReply,
    handleEditComment,
    handleDeleteComment,
    isCommentAuthor,
    canDelete,
  };

  return (
    <div className="space-y-3">
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Comment?"
        message="This action cannot be undone. Are you sure you want to delete this comment?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, commentId: null })}
        loading={loading}
      />
      {topLevelComments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-muted text-sm">No comments yet</p>
          <p className="text-text-muted text-xs mt-1">
            Be the first to comment!
          </p>
        </div>
      ) : (
        topLevelComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postAuthorId={postAuthorId}
            {...sharedProps}
          />
        ))
      )}
    </div>
  );
};

export default CommentThread;
