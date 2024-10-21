var express = require('express');
var router = express.Router();
const Recipe = require('../models/recipe')
const User = require("../models/users")

router.get('/likeList/:username', async (req, res) => {
  try {
    let findUser = await User.findOne({ username: req.params.username });
    if (!findUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (findUser.likedRecipes.length > 0) {
      const userLikedRecipes = await findUser.populate('likedRecipes');

      res.json({ response: userLikedRecipes.likedRecipes });
    } else {
      res.json({ message: 'No recipes found' });
    }
  } catch (error) {
    console.error('Erreur :', error); // Log error
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
});

router.get('/:research/:page', async (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '552977fdb5msh35c32ffc375114dp117394jsn3c8138ceca0f',
      'x-rapidapi-host': 'tasty.p.rapidapi.com'
    }
  };

  const recipesInfos = [];

  try {
    const request = await fetch(`https://tasty.p.rapidapi.com/recipes/list?from=${req.params.page}&size=1000&q=${req.params.research}`, options);

    if (!request.ok) {
      const errorText = await request.text();
      console.error('API Error:', errorText);
      return res.status(request.status).send('Error fetching recipe list from API');
    }

    const response = await request.json();

    if (!response.results || response.results.length === 0) {

      return res.json("No recipes found")
    } else {
      for (const recipe of response.results) {

        // Liste des ingrédients avec leurs dosages
        let ingredientsList = [];
        if (recipe.sections && recipe.sections.length > 0) {
          recipe.sections.forEach(section => {
            section.components.forEach(component => {
              const ingredientName = component.ingredient ? component.ingredient.name : 'Ingrédient non spécifié';

              const measurements = component.measurements.map(measure => {
                if (measure.quantity && measure.unit && measure.unit.display_singular) {
                  return `${measure.quantity} ${measure.unit.display_singular}`;
                } else if (measure.quantity) {
                  return `${measure.quantity}`;
                }
                return 'Quantité non spécifiée';
              }).join(', ');

              // Combine ingredient and measurements
              ingredientsList.push(`${ingredientName}: ${measurements}`);
            });
          });
        }

        // Étapes de préparation
        let instructionsList = [];
        if (recipe.instructions && recipe.instructions.length > 0) {
          recipe.instructions.forEach((instruction, index) => {
            instructionsList.push(`Étape ${index + 1}: ${instruction.display_text}`);
          });
        }

        // Construire l'objet de la recette
        recipesInfos.push({
          id_recipe_tasty: recipe.id,
          name: recipe.name,
          image: recipe.thumbnail_url,
          ingredients: ingredientsList,
          instructions: instructionsList,
          prep_time_minutes: recipe.prep_time_minutes || null,
          cook_time: recipe.cook_time_minutes || null,
          total_time_minutes: recipe.total_time_minutes || null,
          num_servings: recipe.num_servings,
          price: {
            total: recipe.price ? recipe.price.total : null,
            portion: recipe.price ? recipe.price.portion : null
          }
        });
      }

      // Retourner la liste des recettes
      return res.json(recipesInfos);
    }

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/like', async (req, res) => {
  try {
    const { recipe, username } = req.body;

    const existingRecipe = await Recipe.findOne({ id_recipe_tasty: recipe.id_recipe_tasty });

    let savedRecipe;
    if (existingRecipe) {
      savedRecipe = existingRecipe; // Utiliser la recette existante
    } else {
      const newRecipe = new Recipe({
        id_recipe_tasty: recipe.id_recipe_tasty,
        name: recipe.name,
        image: recipe.image,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cook_time: recipe.cook_time,
        prep_time_minutes: recipe.prep_time_minutes,
        num_servings: recipe.num_servings,
        price: {
          total: recipe.price.total,
          portion: recipe.price.portion,
        },
      });
      savedRecipe = await newRecipe.save(); // Sauvegarder la nouvelle recette
    }

    const findUser = await User.findOne({ username: username });

    if (!findUser.likedRecipes) {
      findUser.likedRecipes = [];
    }
    if (!findUser.id_tasty_recipes) {
      findUser.id_tasty_recipes = [];
    }
    const userRecipes = findUser.likedRecipes;


    if (!userRecipes.includes(savedRecipe._id)) {
      findUser.likedRecipes.push(savedRecipe._id);
      findUser.id_tasty_recipes.push(savedRecipe.id_recipe_tasty)
    } else {
      const newLikedRecipe = findUser.likedRecipes.filter(e => e.toString() !== savedRecipe._id.toString());
      findUser.likedRecipes = newLikedRecipe;


      const newLikedRecipeTasty = findUser.id_tasty_recipes.filter(e => e !== savedRecipe.id_recipe_tasty);
      findUser.id_tasty_recipes = newLikedRecipeTasty;
      await Recipe.deleteOne({ _id: savedRecipe._id })
    }

    const userUpdate = await findUser.save();

    if (!userUpdate) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Recette sauvegardée avec succès et mise à jour dans les favoris de l'utilisateur",
      userLikedRecipes: findUser.id_tasty_recipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ userLikedRecipes: [] });
  }
});

router.put('/update', async (req, res) => {
  console.log(req.body.editableRecipe);
  const { editableRecipe, username, token } = req.body;

  try {
    const findUser = await User.findOne({ username: username, token: token });
    if (!findUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }
    editableRecipe = {
      id_recipe_tasty: editableRecipe.id_recipe_tasty,
      name: editableRecipe.name,
      image: editableRecipe.image,
      ingredients: editableRecipe.ingredients,
      instructions: editableRecipe.instructions,
      cook_time: editableRecipe.cook_time,
      prep_time_minutes: editableRecipe.prep_time_minutes,
      num_servings: editableRecipe.num_servings,
      price: {
        total: editableRecipe.price.total,
        portion: editableRecipe.price.portion,
      },
    };
    savedRecipe = await editableRecipe.save();





  } catch (error) {
    console.error(error);
    res.status(500).json({ userLikedRecipes: [] });
  }

})


module.exports = router;