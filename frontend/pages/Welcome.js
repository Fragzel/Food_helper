import React, { useState } from "react";
import styles from "../styles/welcome.module.css";
import SignUp from "../components/Signup";
import SignIn from "../components/Signin";

function Welcome() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleAuthMode = () => {
    setIsSignUp((prevMode) => !prevMode);
  };


  return (
    <div className={styles.content}>
      <h1 style={styles.h1}>Food_Helper</h1>
      {isSignUp ? <SignIn /> : <SignUp />}
      <button onClick={toggleAuthMode} className={styles.toggleButton} >
        {isSignUp ? "Créer un compte" : "Déjà inscrit ? Connectez-vous"}
      </button>
    </div>
  );
}

export default Welcome;
