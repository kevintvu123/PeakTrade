import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import Search from './Search';
import styles from './cssModules/Navbar.module.css'
import logo from '../assets/RH-logo.png'

const NavBar = () => {
  return (
    <div className={styles.bigContainer}>
      <div className={styles.logoSearchContainer}>
        <NavLink to='/main' exact={true} >
          <img src={logo} alt='logo' className={styles.logo} />
        </NavLink>
        <Search />
      </div>
      <div className={styles.accountNavLinks}>
        <LogoutButton />
      </div>
    </div>
  );
}

export default NavBar;
