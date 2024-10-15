import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

function Like(props) {
    const user = useSelector((state) => state.user)
    const hearthColor = user.likedRecipes.length > 0 && (user.likedRecipes.includes(props.recipeInfos.id.toString()) ? { color: "red", cursor: "pointer" } : { color: "black", cursor: "pointer" })
    return (
        <div onClick={() => props.handleLike(props.recipeInfos)}>
            <FontAwesomeIcon icon={faHeart} size={"2x"} style={hearthColor} />
        </div>
    );
}

export default Like;
