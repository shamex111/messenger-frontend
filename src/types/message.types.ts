export interface IMessageBase {
  content: string;
  senderId: number;
  isRead: boolean;
  createdAt?:string;
  media?: IAttachment[] | null;
}

export interface IMessageChat extends IMessageBase {
  readUsers?: IMessageReadUser[] | null;
  chatId: number;
}

export interface IMessageGroup extends IMessageBase {
  readGroups?: IMessageReadGroup[] | null;
  groupId: number;
}

export interface IMessageChannel extends IMessageBase {
  readChannels?: IMessageReadChannel[] | null;
  channelId: number;
}

export interface IAttachment {
  url: string;
  type: 'image' | 'video';
  messageId: number;
  chatId?: number;
  groupId?: number;
  channelId?: number;
}

export interface IMessageReadUser {
  messageId: number;
  userId: number;
  personalChatId: number;
}

export interface IMessageReadGroup {
  messageId: number;
  memberId: number;
  groupId: number;
}

export interface IMessageReadChannel {
  messageId: number;
  memberId: number;
  channelId: number;
}

export interface IMessageForm {
  content: string;
  chatId?: number;
  groupId?: number;
  channelId?: number;
}

export interface IMessageEdit {
  content:string
}