import styles from '../styles/Profil.module.css';

function Profil() {

    return (<div>

        <div className={styles.content}>
            {recipeList !== "No recipes found" ? recipeList.map((recipe, i) => {
                return (
                    <Recipe
                        key={i}
                        id={recipe.id}
                        name={recipe.name}
                        image={recipe.image}
                        onImageClick={() => openModal(recipe)}
                        recipeInfos={recipe}
                        handleLike={handleLike}
                    />
                );
            }) : (researchInput && <span className={styles.noRecipe} > No recipes found </span>)}
        </div>
    </div>

    )

}

export default Profil;