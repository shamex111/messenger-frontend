import { FC, useState } from 'react';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoMdSend } from 'react-icons/io';

import { IMessageForm } from '@/types/message.types';

import { TSmthType } from '@/socketService';

import styles from './TypingArea.module.scss';
import { useSendMutation } from './useSendMutation';

interface ITypingArea {
  smthId: number;
  type: TSmthType;
}

const TypingArea: FC<ITypingArea> = ({ smthId, type }) => {
  
  const [value, setValue] = useState<string>('');

  const { mutate } = useSendMutation();

  const handleSend = () => {
    if (!value.trim()) return; // Проверка на пустую строку

    let data: IMessageForm = { content: value };

    if (type === 'channel') data.channelId = smthId;
    else if (type === 'group') data.groupId = smthId;
    else if (type === 'chat') data.chatId = smthId;

    mutate(data);
    setValue(''); // Очищаем поле ввода
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(); 
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.typingArea}>
        <input
          type="text"
          className={styles.input}
          placeholder="Сообщение"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown} // Обработчик для клавиши Enter
        />
        <HiOutlinePaperClip className="my-auto text-2xl text-gray cursor-pointer" />
      </div>
      <div className={styles.send} onClick={handleSend}>
        <IoMdSend className="m-auto ml-4 text-[28px]" />
      </div>
    </div>
  );
};

export default TypingArea;
