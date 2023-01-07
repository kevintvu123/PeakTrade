import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import styles from './cssModules/Landing.module.css'
import logo from '../assets/final-peaktrade-logo.png'


export default function Landing() {
    const history = useHistory()

    const user = useSelector(state => state.session.user);


    if (user) {
        return <Redirect to='/main' />;
    }

    return (
        <div className={styles.bigContainer}>
            <div className={styles.landingNavBarContainer}>
                <div className={styles.rightNavContainer}>
                    <div className={styles.landingAppName}>
                        <div className={styles.nameContainer}>
                            PeakTrade
                        </div>
                        <img src={logo} alt='App Logo' />
                    </div>
                </div>
                <div className={styles.leftNavContainer}>
                    <button className={styles.loginButton} onClick={() => history.push('/login')}>Log in</button>
                    <button className={styles.signupButton} onClick={() => history.push('/sign-up')}>Sign up</button>
                </div>
            </div>
            <div className={styles.firstContainer}>

            </div>
        </div>
    )
}