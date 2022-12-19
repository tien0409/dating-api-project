export type CallPayload = {
  receiverId: string;
  conversationId: string;
  callType: 'video-call' | 'audio-call';
};
