import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket, getSocket } from "../socket/socket";

import { setOnlineUsers, setTypingUser } from "../redux/socketSlice";
import { likePost, addComment } from "../redux/postSlice";
import {likeVibe, addVibeComment} from "../redux/vibeSlice";
import { addNotification } from "../redux/notificationSlice";

import {
  addMessage,
  removeMessage,
  addUnreadSender,
  markMessagesSeen,
  updateConversationLastMessage,
} from "../redux/messageSlice";

const useInitSocket = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { selectedConversation } = useSelector((state) => state.message);

  // ─────────────────────────────────────────────
  // Initialize socket when user logs in
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!userData?._id) return;

    const socket = initSocket(userData._id);

    // Online users update
    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    // Message deleted event
    socket.on("messageDeleted", ({ messageId, conversationId }) => {
      dispatch(removeMessage({ messageId, conversationId }));
    });

    // Typing indicator
    socket.on("typing", ({ senderId }) => {
      dispatch(setTypingUser(senderId));
    });

    socket.on("stopTyping", () => {
      dispatch(setTypingUser(null));
    });

    // Post liked event
    socket.on("postLiked", ({ postId, likes }) => {
      dispatch(likePost({ postId, likes }));
    });

    // Post commented event
    socket.on("postCommented", ({ postId, comments }) => {
      dispatch(addComment({ postId, comments }));
    });

    // Post comment reply event
    socket.on("postCommentReplyAdded", ({ postId, comments }) => {
      dispatch(addComment({ postId, comments }));
    });

    // Post comment edited event
    socket.on("postCommentEdited", ({ postId, comments }) => {
      dispatch(addComment({ postId, comments }));
    });

    // Post comment deleted event
    socket.on("postCommentDeleted", ({ postId, comments }) => {
      dispatch(addComment({ postId, comments }));
    });

    //Vibe liked event
    socket.on("vibeLiked",({vibeId, likes}) => {
      dispatch(likeVibe({vibeId, likes}));
    });

    //Vibe commented event
    socket.on("vibeCommented",({vibeId, comments}) => {
      dispatch(addVibeComment({vibeId, comments}));
    });

    // Vibe comment reply event
    socket.on("vibeCommentReplyAdded", ({ vibeId, comments }) => {
      dispatch(addVibeComment({ vibeId, comments }));
    });

    // Vibe comment edited event
    socket.on("vibeCommentEdited", ({ vibeId, comments }) => {
      dispatch(addVibeComment({ vibeId, comments }));
    });

    // Vibe comment deleted event
    socket.on("vibeCommentDeleted", ({ vibeId, comments }) => {
      dispatch(addVibeComment({ vibeId, comments }));
    });

    // Real-time notification event
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      disconnectSocket();
    };
  }, [userData?._id, dispatch]);

  // ─────────────────────────────────────────────
  // Handle message + seen events
  // ─────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const newMessageHandler = (message) => {
      // Always update the conversation list preview
      dispatch(updateConversationLastMessage(message));

      if (
        selectedConversation &&
        message.conversationId === selectedConversation._id
      ) {
        // Add message to the open chat messages array
        dispatch(addMessage(message));
      } else {
        // Mark sender as having unread messages
        const senderId = message.sender?._id || message.sender;
        dispatch(addUnreadSender(senderId));
      }
    };

    const seenHandler = ({ conversationId }) => {
      dispatch(markMessagesSeen({ conversationId }));
    };

    // remove old listeners
    socket.off("newMessage");
    socket.off("messagesSeen");

    // attach listeners
    socket.on("newMessage", newMessageHandler);
    socket.on("messagesSeen", seenHandler);

    return () => {
      socket.off("newMessage", newMessageHandler);
      socket.off("messagesSeen", seenHandler);
    };
  }, [selectedConversation, dispatch]);
};

export default useInitSocket;
