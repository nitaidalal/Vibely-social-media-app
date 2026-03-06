import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [], // list of conversation objects
    selectedConversation: null, // { _id, participant }
    messages: [], // messages of selected conversation
    loading: false,
    unreadSenders: [], // unique sender IDs with unread messages (badge = length)
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Update lastMessage in conversations list
      const idx = state.conversations.findIndex(
        (c) => c._id === action.payload.conversationId,
      );
      if (idx !== -1) {
        state.conversations[idx].lastMessage = action.payload;
        // Move updated conversation to top
        const [conv] = state.conversations.splice(idx, 1); //splice(idx,1)
        state.conversations.unshift(conv); //meaning-> add to beginning of array
      }
    },
    removeMessage: (state, action) => {
      // action.payload = { messageId, conversationId }
      state.messages = state.messages.filter(
        (m) => m._id !== action.payload.messageId,
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addUnreadSender: (state, action) => {
      // action.payload = senderId — only add if not already in the list
      const senderId = action.payload;
      if (senderId && !state.unreadSenders.includes(senderId)) {
        state.unreadSenders.push(senderId);
      }
    },
    removeUnreadSender: (state, action) => {
      // action.payload = senderId — remove only this specific sender from the badge
      state.unreadSenders = state.unreadSenders.filter(
        (id) => id !== action.payload,
      );
    },
    markMessagesSeen: (state, action) => {
      const { conversationId } = action.payload;
      state.messages.forEach((msg) => {
        if (msg.conversationId === conversationId) {
          msg.seen = true;
        }
      });
    },
  },
});

export const {
    setConversations,
    setSelectedConversation,
    setMessages,
    addMessage,
    removeMessage,
    setLoading,
    addUnreadSender,
    removeUnreadSender,
    markMessagesSeen,
} = messageSlice.actions;

export default messageSlice.reducer;
