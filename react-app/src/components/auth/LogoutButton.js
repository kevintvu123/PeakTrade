import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import styles from '../cssModules/Navbar.module.css'
import logoutIcon from '../../assets/logout-icon.png'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
  };

  return (
    <div onClick={onLogout} className={styles.logoutContainer}>
      <img src={logoutIcon} alt='logout Icon' />
      Log out
    </div>
  )
};

export default LogoutButton;
