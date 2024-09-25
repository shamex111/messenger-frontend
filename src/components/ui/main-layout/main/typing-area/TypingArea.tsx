import { FC } from 'react';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoMdSend } from 'react-icons/io';

import styles from './TypingArea.module.scss';

interface ITypingArea {}

const TypingArea: FC<ITypingArea> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.typingArea}>
        <input type="text" className={styles.input} placeholder="Сообщение" />
        <HiOutlinePaperClip className="my-auto text-2xl text-gray cursor-pointer" />
      </div>
      <div className={styles.send}>
        <IoMdSend className='m-auto ml-4 text-[28px] '/>
      </div>
    </div>
  );
};

export default TypingArea;
