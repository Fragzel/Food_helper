import styles from '../styles/Home.module.css';
import Recipe from '../components/Recipe';
import Like from '../components/Like';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLike } from '../reducers/user';
import Header from '../components/Header';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
  const [recipeList, setRecipeList] = useState([]);
  const [userRecipeList, setUserRecipeList] = useState([])
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
    const request = await fetch(`https://food-helper-o7y8.vercel.app/recipe/${researchInput}/${page}`);
    const response = await request.json();
    response && setRecipeList(response);
  };

  const fetchUserLikedRecipes = async () => {
    try {
      const request = await fetch(`https://food-helper-o7y8.vercel.app/recipe/likeList/${user.username}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      }
      );

      const response = await request.json();
      setUserRecipeList([]);
      setIsOnPage("MyRecipes");
      response.response ? setUserRecipeList(response.response) : setUserRecipeList("No recipes found");
    } catch (error) {
      console.error('Erreur lors du fetch:', error);
    }
  };

  const returnToHome = () => {
    setIsOnPage("Home");

  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchApiRecipes();
    }
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe); // Définit la recette sélectionnée pour l'affichage en lecture
    setEditableRecipe({ ...recipe }); // Initialise les champs modifiables avec les données de la recette
    setIsModalOpen(true);
    setIsEditing(false); // Désactive le mode édition par défaut
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
    const request = await fetch(`https://food-helper-o7y8.vercel.app/recipe/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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
      const request = await fetch(`https://food-helper-o7y8.vercel.app/recipe/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ editableRecipe: editableRecipe, username: user.username }),
      });
      const response = await request.json();
      if (response.success) {
        let updatedRecipeList = response.userId_recipe_tasty.filter(e => e !== editableRecipe.id_recipe_tasty);

        dispatch(updateLike(updatedRecipeList)); // Met à jour les recettes aimées
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

  const deleteRecipe = async (recipe) => {
    const request = await fetch(`https://food-helper-o7y8.vercel.app/recipe/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ recipe: recipe, username: user.username }),
    });
    const response = await request.json();
    dispatch(updateLike(response.userLikedRecipes));
    closeModal()
  }


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
                deleteRecipe={deleteRecipe}
              />
            ))
            : researchInput && <span className={styles.noRecipe}>No recipes found</span>}
        </div>
      )}

      {isOnPage === "MyRecipes" && (
        <div className={styles.content}>
          {userRecipeList !== "No recipes found"
            ? userRecipeList
              .slice()  // Créer une copie de la liste pour ne pas muter l'original
              .reverse()  // Inverser l'ordre des recettes
              .map((recipe, i) => (
                <Recipe
                  key={i}
                  name={recipe.name}
                  image={recipe.image}
                  onImageClick={() => openModal(recipe)}
                  recipeInfos={recipe}
                  handleLike={handleLike}
                  deleteRecipe={deleteRecipe}
                />
              ))
            : <span className={styles.noRecipe}>No liked recipe for this user</span>}

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
                    placeHolder={editableRecipe.name}
                    value={editableRecipe.name}
                    onChange={handleInputChange}
                    className={styles.editableInput}
                  />
                ) : (
                  selectedRecipe.name
                )}
              </h2>
              <img src={selectedRecipe.image} alt={selectedRecipe.name} className={styles.image} />
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
                      <p>Preparation time : {selectedRecipe.prep_time_minutes ? <strong>{selectedRecipe.prep_time_minutes} minutes</strong> : <strong>Non Disponible</strong>} </p>
                      <p>Cook time : {selectedRecipe.cook_time ? <strong>{selectedRecipe.cook_time} minutes</strong> : <strong>Non Disponible</strong>} </p>
                      <p>Total time : {selectedRecipe.total_time ? <strong>{selectedRecipe.total_time} minutes</strong> : <strong>Non Disponible</strong>} </p>
                    </>
                  )}
                </div>

                {!isEditing && selectedRecipe.id_recipe_tasty !== 0 && <Like recipeInfos={selectedRecipe} handleLike={handleLike} />}
                {!isEditing && <FontAwesomeIcon
                  icon={faPen}
                  size={"2x"}
                  style={{ color: "purple", cursor: "pointer" }}
                  onClick={personnalRecipe}
                />}
                {!isEditing && selectedRecipe.id_recipe_tasty === 0 &&
                  <FontAwesomeIcon icon={faTrash}
                    size={"2x"}
                    cursor={"pointer"}
                    onClick={() => deleteRecipe(selectedRecipe)}
                  />}

                {selectedRecipe.price && (
                  <div>
                    <div className={styles.price}></div>
                    {isEditing ? (
                      <>
                        <p>
                          Number of servings :
                          <input
                            type="number"
                            name="num_servings"
                            value={editableRecipe.num_servings || ''}
                            onChange={handleInputChange}
                            className={styles.editableInput}
                          />
                        </p>
                        <p>
                          Total price  :
                          <input
                            type="number"
                            name="price"
                            step="0.01"
                            value={(editableRecipe.price.total / 100).toFixed(2) || ''}
                            onChange={(e) => {
                              const priceInCents = parseFloat(e.target.value) * 100
                              setEditableRecipe((prevRecipe) => ({
                                ...prevRecipe,
                                price: { total: priceInCents }
                              }));
                            }}
                            className={styles.editableInput}
                          />
                        </p>
                      </>
                    ) : (
                      <>
                        <p>Number of servings: <strong>{selectedRecipe.num_servings || 'Non disponible'}</strong></p>
                        <p>Total price: <strong>{(selectedRecipe.price.total / 100).toFixed(2)}€</strong></p>
                      </>
                    )}
                  </div>
                )}
                {isEditing && (
                  <button className={styles.saveButton} onClick={handleSaveRecipe}>
                    Save Changes
                  </button>
                )}
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.ingredients}>
                <h3 className={styles.sectionTitle}>Ingrédients</h3>
                {!isEditing ? (
                  <ul className={styles.ingredientsList}>
                    {selectedRecipe?.ingredients && selectedRecipe.ingredients.length > 0 ? (
                      selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className={styles.ingredientItem}>
                          <span>{ingredient}</span>
                        </li>
                      ))
                    ) : (
                      <li>Aucun ingrédient disponible</li>
                    )}
                  </ul>
                ) : (
                  editableRecipe?.ingredients && editableRecipe.ingredients.length > 0 ? (
                    editableRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className={styles.ingredientContainer}>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            const updatedIngredients = editableRecipe.ingredients.filter((_, i) => i !== index); // Supprimer l'élément
                            setEditableRecipe((prevRecipe) => ({
                              ...prevRecipe,
                              ingredients: updatedIngredients,
                            }));
                          }}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          name={`ingredient-${index}`}
                          value={ingredient || ''}
                          onChange={(e) => {
                            const updatedIngredients = [...editableRecipe.ingredients];
                            updatedIngredients[index] = e.target.value;
                            setEditableRecipe((prevRecipe) => ({
                              ...prevRecipe,
                              ingredients: updatedIngredients,
                            }));
                          }}
                          className={styles.editableIngredientsInput}
                        />
                      </div>
                    ))
                  ) : (
                    <div>Aucun ingrédient disponible</div>
                  )
                )}
                {isEditing && (
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setEditableRecipe((prevRecipe) => ({
                        ...prevRecipe,
                        ingredients: [...(prevRecipe.ingredients || []), ''], // Ajouter un ingrédient vide
                      }));
                    }}
                  >
                    +
                  </button>
                )}
              </div>



              <div className={styles.instructions}>
                <h3 className={styles.sectionTitle}>Instructions</h3>
                {!isEditing ? (
                  <ul className={styles.instructionsList}>
                    {selectedRecipe?.instructions && selectedRecipe.instructions.length > 0 ? (
                      selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className={styles.instructionItem}>
                          <span>{instruction}</span>
                        </li>
                      ))
                    ) : (
                      <li>Aucune instruction disponible</li>
                    )}
                  </ul>
                ) : (
                  editableRecipe?.instructions && editableRecipe.instructions.length > 0 ? (
                    editableRecipe.instructions.map((instruction, index) => (
                      <div key={index} className={styles.instructionContainer}>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            const updatedInstructions = editableRecipe.instructions.filter((_, i) => i !== index); // Supprimer l'instruction
                            setEditableRecipe((prevRecipe) => ({
                              ...prevRecipe,
                              instructions: updatedInstructions,
                            }));
                          }}
                        >
                          −
                        </button>
                        <textarea
                          type="text"
                          name={`instruction-${index}`}
                          value={instruction || ''}
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
                      </div>
                    ))
                  ) : (
                    <div>Aucune instruction disponible</div>
                  )
                )}
                {isEditing && (
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setEditableRecipe((prevRecipe) => ({
                        ...prevRecipe,
                        instructions: [...(prevRecipe.instructions || []), ''], // Ajouter une instruction vide
                      }));
                    }}
                  >
                    +
                  </button>
                )}
              </div>


            </div>

          </div>
        </div>
      )}
    </main>
  );
}



export default Home;
