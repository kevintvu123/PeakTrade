import OwnedStocks from './OwnedStocks'

import styles from '../cssModules/Homepage.module.css'

export default function Homepage() {

    return (
        <>
            <div className={styles.bodyContainer}>
                <div className={styles.mainContainer}>
                    <div className={styles.leftHalfContainer}>
                        <div className={styles.portfolioValueContainer}>
                            
                        </div>
                    </div>
                    <div className={styles.rightHalfContainer}>
                        <OwnedStocks />
                    </div>
                </div>
            </div>
        </>
    )
}