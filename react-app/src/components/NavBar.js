import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import Search from './Search';
import styles from './cssModules/Navbar.module.css'

const NavBar = () => {
  return (
    <nav>
      <div className={styles.bigContainer}>
        <div>
          <NavLink to='/' exact={true} activeClassName='active'>
            Home
          </NavLink>
        </div>
        <div>
          <Search />
        </div>
        <div>
          <NavLink to='/login' exact={true} activeClassName='active'>
            Login
          </NavLink>
        </div>
        <div>
          <NavLink to='/sign-up' exact={true} activeClassName='active'>
            Sign Up
          </NavLink>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
