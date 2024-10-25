var express = require('express');
var router = express.Router();
const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


router.post('/signUp', async (req, res) => {
    const { username, password, email } = req.body;

    const searchedUser = await User.findOne({ username });
    if (searchedUser !== null) {
        return res.status(400).json({ result: false, error: "L'utilisateur existe déjà" });
    }

    const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '15min' });

    const hash = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        token,
        password: hash
    });
    await newUser.save();

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000
    });

    res.status(201).json({ result: true, message: "Utilisateur créé avec succès" });
});

router.post("/signIn", async (req, res) => {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '15min' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000
    });


    res.json({ result: true, message: "Connexion réussie", id_tasty_recipes: user.id_tasty_recipes });
});

module.exports = router;
