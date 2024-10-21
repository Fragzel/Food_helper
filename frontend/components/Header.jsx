import styles from '../styles/Header.module.css';

import { useDispatch, useSelector } from 'react-redux';
import Logout from './Logout';

function Header(props) {
    const user = useSelector((state) => state.user)
    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.titleContainer}>
                    {props.isOnPage === "Home" ? <h1 className={styles.name}> Home</h1> : <h1 className={styles.name}> My recipes</h1>}

                </div>
                <p className={styles.username}>Hello {user.username}</p>
                <button onClick={props.fetchUserLikedRecipes}>My recipes</button>
                <button onClick={props.returnToHome}>Home</button>

                <Logout />
            </div>
            <input
                className={styles.researchRecipe}
                placeholder='Rechercher une recette'
                onChange={(e) => props.setResearchValue(e.target.value)}
                value={props.value}
                onKeyDown={props.handleSearchKeyDown}
            />
        </div>
    )
}
export default Header;