var express = require('express');
var router = express.Router();
const User = require("../models/users")
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

router.post('/signUp', async (req, res) => {
    const { username, password, email } = req.body

    const searchedUser = await User.findOne({ username })
    if (searchedUser !== null) {
        res.json({ result: false, error: "L'utilisateur existe déjà" })
        return
    }

    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hash
    })
    newUser.save()

    res.status(201).json({ result: true, message: "Utilisateur créé avec succès" });

})

router.post("/signIn", async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ result: true, token, id_tasty_recipes: user.id_tasty_recipes });
})

module.exports = router;
