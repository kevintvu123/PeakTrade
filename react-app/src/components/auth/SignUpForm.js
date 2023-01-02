import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import styles from '../cssModules/SignUpForm.module.css'

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(firstName, lastName, email, password));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/main' />;
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.leftSignUp}>

      </div>
      <div className={styles.rightSignUp}>
        <div className={styles.signupFormContainer}>
          <div className={styles.signupFormHeader}>Enter your first and last name as they appear on your government ID.</div>
          <form onSubmit={onSignUp}>
            {/* <div>
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div> */}
            <div className={styles.nameContainer}>
              <input
                type='text'
                name='firstName'
                onChange={updateFirstName}
                value={firstName}
                placeholder="First name"
              ></input>
              <input
                type='text'
                name='lastName'
                onChange={updateLastName}
                value={lastName}
                placeholder="Last name"
              ></input>
            </div>
            <div className={styles.emailContainer}>
              <input
                type='text'
                name='email'
                onChange={updateEmail}
                value={email}
                placeholder='Email address'
              ></input>
            </div>
            <div className={styles.nameContainer}>
              <input
                type='password'
                name='password'
                onChange={updatePassword}
                value={password}
                placeholder='Password (min. 10 characters)'
              ></input>
              <input
                type='password'
                name='repeat_password'
                onChange={updateRepeatPassword}
                value={repeatPassword}
                required={true}
                placeholder='Confirm Password'
              ></input>
            </div>
            <button className={styles.signupButton} type='submit'>Sign Up</button>
            <p className={styles.logInContainer}>Already have an account?</p>
            <Link to="/login" className={styles.loginLink}>Log in here</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
