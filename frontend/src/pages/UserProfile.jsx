import {useDispatch, useSelector} from 'react-redux';
import { fetchUserById, updateUser } from '../features/userSlice';
import { useEffect } from 'react';

function UserProfile() {
    const dispatch = useDispatch();
    const { isLoading, hasError, isSuccess } = useSelector((state) => state.user);
    const {user, isAuth} = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && isAuth) dispatch(fetchUserById(user?.id));
    }, [dispatch, isAuth, user]);

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(updateUser({
            userId: user?.id,
            username: document.querySelector('input[name="username"]').value,
            address: document.querySelector('input[name="address"]').value
        }));
    }
    
    return (
        <div>
            {isLoading && <h2>Loading...</h2>}
            {hasError && <h2>Something went wrong...</h2>}
            <div>
                <h2>{user?.name}</h2>
                <h3>{user?.email}</h3>
            </div>
            <h1>Update your profile details below:</h1>
            <form onSubmit={handleUpdate}>
                <input type='text' name='username' placeholder='Username' />
                <input type='text' name='address' placeholder='Address' />
                <button type='submit'>Update</button>
            </form>
            {isSuccess && <h2>Profile updated!</h2>}
        </div>
    )
}

export default UserProfile;