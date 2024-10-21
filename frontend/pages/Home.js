import styles from '../styles/Home.module.css';
import Recipe from '../components/Recipe';
import Like from '../components/Like';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLike } from '../reducers/user';
import Header from '../components/Header';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
  const [recipeList, setRecipeList] = useState([]);
  const [researchInput, setResearchInput] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Utilisé pour afficher la recette sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isOnPage, setIsOnPage] = useState("Home");
  const [isEditing, setIsEditing] = useState(false); // Gérer le mode édition
  const [editableRecipe, setEditableRecipe] = useState(null); // Gérer les champs modifiables

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchApiRecipes = async () => {
    const request = await fetch(`http://localhost:3000/recipe/${researchInput}/${page}`);
    const response = await request.json();
    setRecipeList([]);
    response && setRecipeList(response);
  };

  const fetchUserLikedRecipes = async () => {
    try {
      const request = await fetch(`http://localhost:3000/recipe/likeList/${user.username}`);
      const response = await request.json();
      setRecipeList([]);
      setIsOnPage("MyRecipes");
      response.response ? setRecipeList(response.response) : setRecipeList("No recipes found");
    } catch (error) {
      console.error('Erreur lors du fetch:', error);
    }
  };

  const returnToHome = () => {
    setRecipeList([]);
    setIsOnPage("Home");
    setPage(0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchApiRecipes();
    }
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe); // Définit la recette sélectionnée pour l'affichage en lecture
    setEditableRecipe(null); // Réinitialise les champs modifiables
    setIsModalOpen(true);
    setIsEditing(false); // Désactive le mode édition par défaut
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null); // Réinitialise la recette sélectionnée
  };

  const handleModalClick = (event) => {
    if (event.target.className === styles.modal) {
      closeModal();
    }
  };

  const handleLike = async (recipe) => {
    const request = await fetch(`http://localhost:3000/recipe/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe: recipe, username: user.username })
    });
    const response = await request.json();
    dispatch(updateLike(response.userLikedRecipes));
  };

  const setResearchValue = (value) => {
    setResearchInput(value);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      fetchApiRecipes();
    }
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSaveRecipe = async () => {
    // Enregistrer les modifications dans le backend
    try {
      const request = await fetch(`http://localhost:3000/recipe/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editableRecipe: editableRecipe, username: user.username, token: user.token }),
      });
      const response = await request.json();
      if (response.success) {
        setSelectedRecipe(editableRecipe); // Met à jour la recette avec les modifications
        setIsEditing(false); // Désactive le mode édition après la sauvegarde
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const personnalRecipe = () => {
    setEditableRecipe({ ...selectedRecipe }); // Cloner la recette actuelle pour l'édition
    setIsEditing(true); // Activer le mode édition
  };

  return (
    <main className={isOnPage === "Home" ? styles.mainHome : styles.mainMyrecipes}>
      <Header handleSearchKeyDown={handleSearchKeyDown} setResearchValue={setResearchValue} returnToHome={returnToHome} fetchUserLikedRecipes={fetchUserLikedRecipes} isOnPage={isOnPage} />
      {isOnPage === "Home" && (
        <div className={styles.content}>
          {recipeList !== "No recipes found"
            ? recipeList.map((recipe, i) => (
              <Recipe
                key={i}
                name={recipe.name}
                image={recipe.image}
                onImageClick={() => openModal(recipe)}
                recipeInfos={recipe}
                handleLike={handleLike}
              />
            ))
            : researchInput && <span className={styles.noRecipe}>No recipes found</span>}
        </div>
      )}

      {isOnPage === "MyRecipes" && (
        <div className={styles.content}>
          {recipeList !== "No recipes found"
            ? recipeList.map((recipe, i) => (
              <Recipe
                key={i}
                name={recipe.name}
                image={recipe.image}
                onImageClick={() => openModal(recipe)}
                recipeInfos={recipe}
                handleLike={handleLike}
              />
            ))
            : researchInput && <span className={styles.noRecipe}>No recipe liked</span>}
        </div>
      )}
      <div className={styles.buttons}>
        {page > 0 && <button className={styles.button} onClick={() => setPage(page - 80)}>Previous</button>}
        {recipeList.length > 79 && <button className={styles.button} onClick={() => setPage(page + 80)}>Next</button>}
      </div>

      {isModalOpen && selectedRecipe && (
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <div className={styles.leftSection}>
              <h2 className={styles.recipeTitle}>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editableRecipe.name}
                    onChange={handleInputChange}
                    className={styles.editableInput}
                  />
                ) : (
                  selectedRecipe.name
                )}
              </h2>
              <img src={selectedRecipe.image} alt={selectedRecipe.name} />
              <div className={styles.details}>
                <div className={styles.timeInfo}>
                  {isEditing ? (
                    <>
                      <p>
                        Preparation time:
                        <input
                          type="number"
                          name="prep_time_minutes"
                          value={editableRecipe.prep_time_minutes || ''}
                          onChange={handleInputChange}
                          className={styles.editableInput}
                        />
                      </p>
                      <p>
                        Cook time:
                        <input
                          type="number"
                          name="cook_time"
                          value={editableRecipe.cook_time || ''}
                          onChange={handleInputChange}
                          className={styles.editableInput}
                        />
                      </p>
                      <p>
                        Total time:
                        <input
                          type="number"
                          name="total_time_minutes"
                          value={editableRecipe.total_time_minutes || ''}
                          onChange={handleInputChange}
                          className={styles.editableInput}
                        />
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Preparation time: <strong>{selectedRecipe.prep_time_minutes} minutes</strong></p>
                      <p>Cook time: <strong>{selectedRecipe.cook_time} minutes</strong></p>
                      <p>Total time: <strong>{selectedRecipe.total_time_minutes} minutes</strong></p>
                    </>
                  )}
                </div>
                <Like recipeInfos={selectedRecipe} handleLike={handleLike} />
                <FontAwesomeIcon
                  icon={faPen}
                  size={"2x"}
                  style={{ color: "purple", cursor: "pointer", marginLeft: "10px" }}
                  onClick={personnalRecipe}
                />
                {selectedRecipe.price && (
                  <div>
                    <div className={styles.price}></div>
                    <p>Number of servings: <strong>{selectedRecipe.num_servings || 'Non disponible'}</strong></p>
                    <p>Total price: <strong>{(selectedRecipe.price.total / 100).toFixed(2)}€</strong></p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.ingredients}>
                <h3 className={styles.sectionTitle}>Ingrédients</h3>
                <ul className={styles.ingredientsList}>
                  {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                    selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {isEditing ? (
                          <input
                            type="text"
                            name={`ingredient-${index}`}
                            value={editableRecipe.ingredients[index]}
                            onChange={(e) => {
                              const updatedIngredients = [...editableRecipe.ingredients];
                              updatedIngredients[index] = e.target.value;
                              setEditableRecipe((prevRecipe) => ({
                                ...prevRecipe,
                                ingredients: updatedIngredients,
                              }));
                            }}
                            className={styles.editableInput}
                          />
                        ) : (
                          ingredient
                        )}
                      </li>
                    ))
                  ) : (
                    <li>Ingrédients non disponibles</li>
                  )}
                </ul>
              </div>
              <div className={styles.instructions}>
                <h3 className={styles.sectionTitle}>Instructions</h3>
                <ul className={styles.instructionsList}>
                  {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                    selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index}>
                        {isEditing ? (
                          <input
                            type="text"
                            name={`instruction-${index}`}
                            value={editableRecipe.instructions[index]}
                            onChange={(e) => {
                              const updatedInstructions = [...editableRecipe.instructions];
                              updatedInstructions[index] = e.target.value;
                              setEditableRecipe((prevRecipe) => ({
                                ...prevRecipe,
                                instructions: updatedInstructions,
                              }));
                            }}
                            className={styles.editableInput}
                          />
                        ) : (
                          instruction
                        )}
                      </li>
                    ))
                  ) : (
                    <li>Instructions non disponibles</li>
                  )}
                </ul>
              </div>
            </div>
            {isEditing && (
              <button className={styles.saveButton} onClick={handleSaveRecipe}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}



export default Home;
