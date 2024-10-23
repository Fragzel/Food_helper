import styles from "../styles/recipe.module.css";
import Like from "../components/Like"
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Recipe(props) {
    return (
        <div className={props.recipeInfos.id_recipe_tasty === 0 ? styles.myRecipesMain : styles.main}>
            <div className={styles.name}>{props.name}</div>

            <img
                className={styles.image}
                src={props.image}
                alt="recipe image"
                onClick={() => props.onImageClick(props)}
            />
            {props.recipeInfos.id_recipe_tasty === 0 ?
                <FontAwesomeIcon icon={faTrash} size={"xl"} cursor={"pointer"} onClick={() => props.deleteRecipe(props.recipeInfos)} /> :
                <Like recipeInfos={props.recipeInfos} handleLike={props.handleLike} />}
        </div>
    );
} // 
export default Recipe;
