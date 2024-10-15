import styles from '../styles/Home.module.css';
import Recipe from '../components/Recipe';
import Like from '../components/Like';
import { useState } from 'react';
import Logout from '../components/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateLike } from '../reducers/user';



function Home() {
  const [recipeList, setRecipeList] = useState([]);
  const [researchInput, setResearchInput] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isOnPage, setIsOnPage] = useState("Home")


  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()


  const fetchRecipeList = async () => {

    const request = await fetch(`http://localhost:3000/recipe/${researchInput}/${page}`);
    const response = await request.json();
    response && setRecipeList(response)
  };
  const fetchLikedRecipeList = async () => {
    try {
      console.log(user.username); // Vérifie si l'username est correct
      const request = await fetch(`http://localhost:3000/recipe/likeList/${user.username}`);
      const response = await request.json();
      console.log(response); // Affiche la réponse du serveur
    } catch (error) {
      console.error('Erreur lors du fetch:', error); // Affiche les erreurs du fetch
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchRecipeList();
    }
  };
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };
  const handleModalClick = (event) => {
    if (event.target.className === styles.modal) {
      closeModal();
    }
  };
  const handleLike = async (recipe) => {

    const request = await fetch(`http://localhost:3000/recipe/like`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: recipe, username: user.username })
      });
    const response = await request.json();
    console.log(response)
    dispatch(updateLike(response.userLikedRecipes));
  }

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      fetchRecipeList();
    }
  }, [page])
  if (isOnPage === "Home") {

    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <h1 className={styles.name}>Bienvenue sur Food_Helper</h1>
            </div>
            <p className={styles.username}>Hello {user.username}</p>
            <button onClick={() => { fetchLikedRecipeList() }}>Profil</button>
            <Logout />
          </div>
          <input
            className={styles.researchRecipe}
            placeholder='Rechercher une recette'
            onChange={(e) => setResearchInput(e.target.value)}
            value={researchInput}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
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
        <div className={styles.buttons}>
          {page > 0 && <button className={styles.button} onClick={() => { setPage(page - 80) }}>Previous</button>}
          {recipeList.length > 0 && <button className={styles.button} onClick={() => { setPage(page + 80) }}>Next</button>}
        </div>
        {isModalOpen && selectedRecipe && (
          <div className={styles.modal} onClick={handleModalClick}>
            <div className={styles.modalContent}>
              <div className={styles.leftSection}>
                <h2 className={styles.recipeTitle}>{selectedRecipe.name}</h2>
                <img src={selectedRecipe.image} alt={selectedRecipe.name} />
                <div className={styles.details}>
                  <div className={styles.timeInfo}>
                    {selectedRecipe.prep_time_minutes ? <p>Preparation time: <strong>{selectedRecipe.prep_time_minutes} minutes </strong> </p> : <p>Preparation time : <strong>Non disponible </strong></p>}
                    {selectedRecipe.cook_time ? <p>Cook time: <strong>{selectedRecipe.cook_time} minutes </strong> </p> : <p>Cook time : <strong>Non disponible </strong></p>}
                    {selectedRecipe.total_time_minutes ? <p>Total time: <strong> {selectedRecipe.total_time_minutes} minutes </strong> </p> : <p>Total time: <strong>Non disponible </strong></p>}
                  </div>
                  <Like recipeInfos={selectedRecipe} handleLike={handleLike} />
                  {selectedRecipe.price && (
                    <div className={styles.price}>
                      <p>Number of serving:<strong> {selectedRecipe.num_servings || 'Non disponible'}</strong></p>
                      <p>Total price: <strong>{(selectedRecipe.price.total / 100).toFixed(2)}€</strong></p>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.ingredients}>
                  <h3 className={styles.sectionTitle}>Ingrédients</h3>
                  <ul className={styles.ingredientsList}>
                    {Array.isArray(selectedRecipe.ingredients) && selectedRecipe.ingredients.length > 0 ? (
                      selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))
                    ) : (
                      <li>Ingrédients non disponibles</li>
                    )}
                  </ul>
                </div>
                <div className={styles.instructions}>
                  <h3 className={styles.sectionTitle}>Instructions</h3>
                  <ul className={styles.instructionsList}>
                    {Array.isArray(selectedRecipe.instructions) && selectedRecipe.instructions.length > 0 ? (
                      selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))
                    ) : (
                      <li>Instructions non disponibles</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  } else if (isOnPage === "Profil") {
    return (
      <main>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <h1 className={styles.name}>Bienvenue sur Food_Helper</h1>
            </div>
            <p className={styles.username}>Hello {user.username}</p>
            <Logout />
          </div>
          <input
            className={styles.researchRecipe}
            placeholder='Rechercher une recette'
            onChange={(e) => setResearchInput(e.target.value)}
            value={researchInput}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
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
      </main>


    )
  };
}

export default Home;
