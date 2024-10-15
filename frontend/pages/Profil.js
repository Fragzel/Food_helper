function Profil() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    return (
        <></>


    )


}

export default Profil;