import {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setUser, checkLoginStatus } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import * as Yup from 'yup';
import { createCart, fetchCartByIds } from '../features/cartSlice';
import './Register.css';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { isAuth, user, status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const registrationRef = useRef(false);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    name: '',
    address: '',
  };

  // useEffect(() => {
  //   if (isAuth) {
  //     navigate(ROUTES.HOME);
  //   }
  // }, [isAuth, navigate])

  // const handleRegister = async (values) => {
  //   await dispatch(registerUser(values)).unwrap();
  //   await dispatch(checkLoginStatus()).unwrap();

  // };

  useEffect(() => {
    const handleUserRegistration = async () => {
      if (registrationSuccess && user && !registrationRef.current) {
        registrationRef.current = true; // Mark the registration process as initiated
        try {
          await dispatch(createCart(user.id));
          await dispatch(fetchCartByIds(user.id));
          navigate(ROUTES.HOME);
        } catch (error) {
          console.error("Error creating cart or fetching cart:", error);
          registrationRef.current = false; // Reset if there's an error
        }
      }
    };

    handleUserRegistration();
  }, [registrationSuccess, user, dispatch, navigate]);

  const handleRegister = async (values) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      await dispatch(checkLoginStatus()).unwrap();
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleRegister(values); // or handleLogin(values) depending on the form
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <div className='register-form'>
          <div className='banner'>
            <h1>Register here</h1>
          </div>
          <Form className='fields'>
            <Field className="input" type="text" name="username" placeholder="Username" />
            <ErrorMessage name="username" component="div" />

            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" />

            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" />

            <Field type="text" name="address" placeholder="Address" />
            <ErrorMessage name="address" component="div" />

            <button id='register' type="submit" disabled={isSubmitting}>
              Register
            </button>
            {/* Login button can be added similarly */}
            {status === 'loading' && <p>Loading...</p>}
            {error && <p>{error}</p>}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default RegisterPage;