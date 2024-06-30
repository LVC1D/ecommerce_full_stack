import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const { status, error, isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
  };

  const handleLogin = (values) => {
    dispatch(loginUser(values));
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://localhost:5173/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `https://localhost:5173/api/auth/facebook`;
  };

  useEffect(() => {
    if (isAuth) {
      navigate(ROUTES.HOME);
    }
  }, [isAuth, navigate]);


  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleLogin(values);
          setSubmitting(false);
        }}
      >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="username" placeholder="Username" />
            <ErrorMessage name="username" component="div" />

            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
            <h2>Or login via SSO</h2>
            <button type="submit" onClick={handleGoogleLogin}>
              Google
            </button>
            <button type="submit" onClick={handleFacebookLogin}>
              Facebook
            </button>
            {status === 'loading' && <p>Loading...</p>}
            {error && <p>{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;