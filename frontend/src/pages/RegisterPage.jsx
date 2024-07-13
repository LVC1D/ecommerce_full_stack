import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { isAuth, status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const initialValues = {
    username: '',
    email: '',
    password: '',
    name: '',
    address: '',
  };

  useEffect(() => {
    if (isAuth) {
      navigate(ROUTES.HOME);
    }
  }, [isAuth, navigate])

  const handleRegister = (values) => {
    dispatch(registerUser(values));
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
        <Form>
          <Field type="text" name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />

          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />

          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />

          <Field type="text" name="name" placeholder="Name" />
          <ErrorMessage name="name" component="div" />

          <Field type="text" name="address" placeholder="Address" />
          <ErrorMessage name="address" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
          {/* Login button can be added similarly */}
          {status === 'loading' && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </Form>
      )}
    </Formik>
  );
};

export default RegisterPage;