import {
  IAttachment,
  IMessageChannel,
  IMessageReadChannel
} from './message.types';
import { IChannelNotifications } from './notifications.types';

export interface IChannel {
  id?: number;
  name: string;
  description: string;
  avatar: string;
  members?: IChannelMember[];
  roles?: IChannelRole[];
  messages?: IMessageChannel[] | null;
  media?: IAttachment[] | null;
  private: boolean;
  groupId?: number;
  MessageReadChannel?: IMessageReadChannel[] | null;
  ChannelNotification?: IChannelNotifications[];
  type?: 'channel' | 'chat' | 'group';
  count?:number
  qtyUsers: number;
}
export interface IChannelEdit {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  channelId: number;
}

interface baseSet {
  userId: number;
  channelId: number;
}

export interface IChannelMember {
  userId: number;
  channelId: number;
  channelRoleId: number;
  isMuted: boolean;
  ChannelNotification?: IChannelNotifications[];
}

export interface IAddMember extends baseSet {}

export interface IDeleteMember extends baseSet {}

export interface IChannelRole {
  name: string;
  channelId: number;
  permissionNames: string[];
}

export interface IRemoveRole extends baseSet {}

export interface IAssignRole extends baseSet {
  roleName: string;
}

export interface IEditRole {
  newRoleName: string;
  roleName: string;
  newPermissions: string[];
  channelId: number;
}

export interface IDeleteRole {
  roleName: string;
  channelId: number;
}

export interface IChangeNotifications {
  isMuted: boolean;
  channelId: number;
}

export interface IChannelForm {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
}
