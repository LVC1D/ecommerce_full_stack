import {Outlet} from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginStatus, setUser } from "../features/authSlice";

export default function Root() {
  const dispatch = useDispatch();
  const {isAuth} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth === undefined) {
      dispatch(setUser());
    }
  })
  
  return (
    <>
      <Header />
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}