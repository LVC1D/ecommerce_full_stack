import {useDispatch, useSelector} from 'react-redux';
import { fetchUserById, updateUser } from '../features/userSlice';
import { useEffect, useState } from 'react';
import './UserProfile.css';

function UserProfile() {
    const dispatch = useDispatch();
    const { isLoading, hasError, isSuccess } = useSelector((state) => state.user);
    const {user, isAuth} = useSelector((state) => state.auth);
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (user && isAuth) dispatch(fetchUserById(user?.id));
    }, [dispatch, isAuth, user]);

    const handleUpdate = (e) => {
        e.preventDefault();
        setValidationError('');

        if (!username || username.length < 3) {
            setValidationError('Username must be at least 3 characters long');
            return;
        }

        if (!address || address.length < 6) {
            setValidationError('Address must be at least 6 characters long');
            return;
        }

        dispatch(updateUser({
            userId: user?.id,
            username: username,
            address: address
        }));
    }
    
    return (
        <div className='profile-update-container'>
            {isLoading && <h2 className='message'>Loading...</h2>}
            {hasError && <h2 className='message error'>Something went wrong...</h2>}
            <div>
                <div className='user-info'>
                    <h2>{user?.name}</h2>
                    <h3>{user?.email}</h3>
                </div>
                <div>
                    <h1>Update your profile details below:</h1>
                    <form className='profile-update-form' onSubmit={handleUpdate}>
                        <input type='text' name='username' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type='text' name='address' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        <button type='submit'>Update</button>
                    </form>
                </div>
            </div>
            {validationError && <h2 className='message error'>{validationError}</h2>}
            {isSuccess && <h2 className='message success'>Profile updated!</h2>}
        </div>
    )
}

export default UserProfile;