import styles from "../styles/welcome.module.css";
import { useForm } from "../hook/useForm";
import { Input } from "../components/Input";
import { useDispatch } from 'react-redux';
import { updateUserRedux } from '../reducers/user';
import { useRouter } from 'next/router';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const signUpFields = [
    {
        name: "username",
        required: true
    },
    {
        name: "email",
        type: "email",
        required: true
    },
    {
        name: "password",
        type: "password",
        required: true
    },
    {
        name: "confirmPassword",
        type: "password",
        required: true
    },
];

function SignUp() {
    const { handleChange, formData, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const submitSignup = async () => {
        try {
            const request = await fetch(`${siteUrl}users/signUp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const response = await request.json();

            if (response.result) {
                // Mise à jour de l'utilisateur dans Redux
                dispatch(updateUserRedux({
                    token: response.token,
                    username: formData.username,
                    likedRecipes: []
                }));

                // Redirection vers la page /home
                router.push("/Home");
            } else {
                console.error("Erreur lors de la création du compte", response.error);
            }
        } catch (error) {
            console.error("Erreur réseau ou serveur", error);
        }
    };

    return (
        <div className={styles.main}>
            <h1>Renseignez les champs suivants pour créer votre compte</h1>
            <form onSubmit={handleSubmit(submitSignup)} className={styles.form}>
                {signUpFields.map((field) => (
                    <Input
                        key={field.name}
                        {...field}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                ))}
                <button type="submit" className={styles.submit}>
                    Créer mon compte
                </button>
            </form>
        </div>
    );
}

export default SignUp;
