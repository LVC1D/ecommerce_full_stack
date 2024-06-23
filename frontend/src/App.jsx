import {Provider} from 'react-redux';
import {Route, RouterProvider, createRoutesFromElements, createBrowserRouter} from 'react-router-dom';
import {store} from './store';
import Root from './components/Root';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Products from './components/Products';
import ROUTES from './routes';
import './App.css'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path={ROUTES.HOME} element={<Root/>}>
    <Route index element={<Products/>}/>
    <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
    <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
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
