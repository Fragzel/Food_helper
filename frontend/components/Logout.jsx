import React from 'react';
import { useRouter } from 'next/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "../styles/logout.module.css"
import { useDispatch } from 'react-redux';
import { updateUserRedux } from '../reducers/user';


const Logout = () => {
    const router = useRouter()
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(updateUserRedux({ username: "", token: "", likedRecipes: [] }))
        router.push('/Welcome');
    };

    return (
        <FontAwesomeIcon icon={faRightFromBracket} className={styles.logOut} onClick={handleLogout} />

    );
};

export default Logout;
