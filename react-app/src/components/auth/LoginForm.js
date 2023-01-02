import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../store/session';

import styles from '../cssModules/LoginForm.module.css'
import loginImg from '../../assets/RH-login.png'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/main' />;
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.loginImageContainer}>
        <img src={loginImg} alt='loginImage' />
      </div>
      <div className={styles.loginFormBigContainer}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginFormHeader}>Log in to PeakTrade</div>
          <form onSubmit={onLogin} className={styles.loginForm}>
            <div>
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div>
            <div className={styles.loginFormInputDiv}>
              <label htmlFor='email'>Email</label>
              <input
                name='email'
                type='text'
                placeholder='Email'
                value={email}
                onChange={updateEmail}
              />
            </div>
            <div className={styles.loginFormInputDiv}>
              <label htmlFor='password'>Password</label>
              <input
                name='password'
                type='password'
                placeholder='Password'
                value={password}
                onChange={updatePassword}
              />
              <button className={styles.loginButton} type='submit'>Login</button>
            </div>
            <p className={styles.signUpLinkContainer}>Not on PeakTrade? <Link to="/signup" className={styles.signUpLink}>Create an account</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
