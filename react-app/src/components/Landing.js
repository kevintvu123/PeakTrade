import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

import styles from './cssModules/Landing.module.css'
import logo from '../assets/final-peaktrade-logo.png'
import video from '../assets/RH-landing-video.mp4'


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
                    <div className={styles.linkContainer}>
                        <a className={styles.anchorTag} href='https://github.com/kevintvu123' target="_blank" rel="noreferrer">
                            Github
                        </a>
                        <a className={styles.anchorTag} href='https://www.linkedin.com/in/kevintvu123/' target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                        <a className={styles.anchorTag} href='mailto:kevintvu123@gmail.com' target="_blank" rel="noreferrer">
                            Email
                        </a>
                    </div>
                </div>
                <div className={styles.leftNavContainer}>
                    <button className={styles.loginButton} onClick={() => history.push('/login')}>Log in</button>
                    <button className={styles.signupButton} onClick={() => history.push('/sign-up')}>Sign up</button>
                </div>
            </div>
            <div className={styles.firstContainer}>
                <video className={styles.landingVideo} muted autoPlay playsInline src={video} />
            </div>
            <div className={styles.videoFooterContainer}>
                <div>
                    Earn a 1% match.
                </div>
                <div>
                    No employer necessary.
                </div>
            </div>
        </div>
    )
}