import styles from "../styles/welcome.module.css";
import { useForm } from "../hook/useForm";
import { Input } from "../components/Input";

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

    const submitSignup = async () => {
        const request = await fetch("http://localhost:3000/users/signUp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(formData)
        });
        const response = await request.json()
        console.log(response)
    }

    return (
        <div className={styles.main}>
            <h1  >Renseignez les champs suivants pour créer votre compte</h1>
            <form onSubmit={handleSubmit(submitSignup)} className={styles.form}>
                {signUpFields.map((field) => (
                    <Input
                        key={field.name}
                        {...field}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                ))}
                <button type="submit" className={styles.submit} >
                    Créer mon compte
                </button>
            </form>
        </div>
    );
}

export default SignUp;
