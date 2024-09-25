import { FC } from 'react';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';

import styles from './Chat.module.scss';
import ChatMessage from './chat-messages/ChatMessage';

interface IIChat {
  data: IChat | IChannel | IGroup;
}

const Chat: FC<IIChat> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <div className="mx-auto w-[60%] flex flex-col gap-3 mt-2">
        {data?.messages && [...data.messages].reverse().map((m: IMessageBase) => (
          <ChatMessage message={m} key={m.createdAt} />
        ))}
      </div>
    </div>
  );
};

export default Chat;
