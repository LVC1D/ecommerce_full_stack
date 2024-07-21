import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';
import './Login.css';

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
    window.location.href = 'https://ecommerce-full-stack-back.onrender.com/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://ecommerce-full-stack-back.onrender.com/api/auth/facebook';
  };

  useEffect(() => {
    if (isAuth) {
      navigate(ROUTES.HOME);
    }
  }, [isAuth, navigate]);


  return (
    <div>
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
        <div className='login-form'>
          <div className='login-banner'>
            <h1>Login here</h1>
          </div>
          <Form className='login-fields'>
            <Field className='input' type="text" name="username" placeholder="Username" />
              <ErrorMessage name="username" component="div" />

              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" />

              <button id='login' type="submit" disabled={isSubmitting}>
                Login
              </button>
              <div className='sso'>
                <h2>Or login via SSO</h2>
                  <div className='sso-buttons'>
                    <button type="submit" onClick={handleGoogleLogin}>
                      Google
                    </button>
                    <button type="submit" onClick={handleFacebookLogin}>
                      Facebook
                    </button>
                  </div>
              </div>
              {status === 'loading' && <p>Loading...</p>}
              {error && <p>{error}</p>}
            </Form>
        </div>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;