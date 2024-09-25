import { IAttachment, IMessageChat, IMessageReadUser } from './message.types';

export interface IChat {
  id?:number;
  user1Id: number;
  user2Id: number;
  messages?: IMessageChat[] | null;
  media?: IAttachment[] | null;
  messageReadUser?: IMessageReadUser[] | null;
  type?:'channel' | 'chat' | 'group';
}

export interface IChatForm {
  user1Id: number;
  user2Id: number;
}
