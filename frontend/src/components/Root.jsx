import {Outlet} from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { checkLoginStatus } from "../features/authSlice";

export default function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);
  
  return (
    <>
      <Header />
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}