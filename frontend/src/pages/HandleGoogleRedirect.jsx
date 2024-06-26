import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkLoginStatus } from '../features/authSlice';

const HandleGoogleRedirect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check login status after Google SSO redirection
    dispatch(checkLoginStatus());
  }, [dispatch]);

  return (
    <div>Redirecting...</div>
  );
};

export default HandleGoogleRedirect;