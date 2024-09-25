import { FC } from 'react';

import styles from './SideInfoBar.module.scss';

interface ISideInfoBar {
  isInfoBarOpen: any;
}

const SideInfoBar: FC<ISideInfoBar> = ({ isInfoBarOpen }) => {
  return <div className={`${styles.wrapper} ${isInfoBarOpen ? styles.wrapperOpen : undefined}`}></div>;
};

export default SideInfoBar;
