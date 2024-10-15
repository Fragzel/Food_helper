import styles from "../styles/recipe.module.css";
import Like from "../components/Like"

function Recipe(props) {

    return (
        <div className={styles.main}>
            <div className={styles.name}>{props.name}</div>

            <img
                className={styles.image}
                src={props.image}
                alt="recipe image"
                onClick={() => props.onImageClick(props)}
            />
            <Like recipeInfos={props.recipeInfos} handleLike={props.handleLike} />
        </div>
    );
} // 
export default Recipe;
