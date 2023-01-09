import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import Search from './Search';
import styles from './cssModules/Navbar.module.css'
import logo from '../assets/final-peaktrade-logo.png'

const NavBar = () => {

  const [showMenu, setShowMenu] = useState(false)

  const user = useSelector(state => state.session.user);

  console.log(user)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const shortenName = (input) => {
    if (input.length > 15) {
      const firstHalf = input.slice(0, 15);
      return firstHalf + "...";
    } else return input;
  };

  return (
    <div className={styles.bigContainer}>
      <div className={styles.logoSearchContainer}>
        <NavLink to='/main' exact={true} >
          <img src={logo} alt='logo' className={styles.logo} />
        </NavLink>
        <Search />
      </div>
      <div className={styles.accountNavLinks} onClick={openMenu}>
        Account
      </div>
      {showMenu &&
        <div className={styles.dropDownMenu}>
          <div className={styles.nameContainer}>
            {`${shortenName(user.firstName)} ${shortenName(user.lastName)}`}
          </div>
          <LogoutButton />
        </div>
      }
    </div>
  );
}

export default NavBar;
