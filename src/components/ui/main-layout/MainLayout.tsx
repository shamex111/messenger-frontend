import { FC, PropsWithChildren } from 'react'
import Sidebar from './sidebar/SideBar'
import styles from './MainLayout.module.scss'
const MainLayout: FC<PropsWithChildren<unknown>> = ({children}) => {
  return <div className='flex'>
    <div className="flex">
      <div className=''>
      <Sidebar />
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  </div>
}

export default MainLayout