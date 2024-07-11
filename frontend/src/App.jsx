import {Provider} from 'react-redux';
import {Route, RouterProvider, createRoutesFromElements, createBrowserRouter} from 'react-router-dom';
import {store} from './store';
import Root from './components/Root';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Products from './components/Products';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import UserProfile from './pages/UserProfile';
import CartItems from './pages/CartItems';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import ROUTES from './routes';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
import './App.css';

// const loadStripePromise = loadStripe('pk_test_51PRwp300S9GEcTS4vjzkKyI6tJYHChAXPBEG3Gu64COTqlATyKlibDv4eYyJZ5YkPeaS6q5fQncD4QkWJuK9zWU500SCWXlrmq');

const router = createBrowserRouter(createRoutesFromElements(
  <Route path={ROUTES.HOME} element={<Root/>}>
    <Route index element={<Products/>}/>
    <Route path={ROUTES.PRODUCT(':productId')} element={<ProductDetails/>}/>
    <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
    <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
    <Route path={ROUTES.ORDERS} element={<Orders/>}/>
    <Route path={ROUTES.PROFILE(':userId')} element={<UserProfile/>} />
    <Route path={ROUTES.CART(':cartId')} element={<CartItems/>}/>
    <Route path={ROUTES.SUCCESS} element={<Success/>}/>
    <Route path={ROUTES.CANCEL} element={<Cancel/>}/>
  </Route>
))

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  );
}

export default App
