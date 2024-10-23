import styles from "../styles/welcome.module.css";
import { useForm } from "../hook/useForm";
import { Input } from "../components/Input";
import { useDispatch } from 'react-redux';
import { updateUserRedux } from '../reducers/user';
import { useRouter } from 'next/router';

const signInFields = [
    {
        name: "username",
        required: true

    },
    {
        name: "password",
        type: "password",
        required: true
    },
];

function SignIn() {
    const { handleChange, formData, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const router = useRouter()


    const submitSignin = async () => {
        const request = await fetch("https://food-helper-o7y8.vercel.app/users/signIn", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(formData)
        });
        const response = await request.json()


        if (response.result) {
            dispatch(updateUserRedux({ token: response.token, username: formData.username, likedRecipes: response.id_tasty_recipes }))
            router.push("/Home")
        }

    };

    return (
        <div className={styles.main}>
            <form onSubmit={handleSubmit(submitSignin)} className={styles.form}>
                {signInFields.map((field) => (
                    <Input
                        key={field.name}
                        {...field}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                ))}
                <button type="submit" className={styles.submit}>
                    Se connecter
                </button>
            </form>
        </div>
    );
}

export default SignIn;
