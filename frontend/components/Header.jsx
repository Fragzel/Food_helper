import styles from '../styles/Header.module.css';

import Logout from './Logout';

function Header(props) {

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.titleContainer}>
                    {props.isOnPage === "Home" ? <h1 className={styles.title}> Home</h1> : <h1 className={styles.title}> My recipes</h1>}

                </div>

                {props.isOnPage === "Home" && <button className={styles.buttons} onClick={props.fetchUserLikedRecipes}>My recipes</button>}
                {props.isOnPage !== "Home" && <button className={styles.buttons} onClick={props.returnToHome}>Home</button>}

                <Logout />
            </div>
            {props.isOnPage === "MyRecipes" ? <></> : <input
                className={styles.researchRecipe}
                placeholder='Rechercher une recette'
                onChange={(e) => props.setResearchValue(e.target.value)}
                value={props.value}
                onKeyDown={props.handleSearchKeyDown}
            />
            }
        </div >
    )
}
export default Header;