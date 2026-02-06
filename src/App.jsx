import Header from "./components/Header";
import Footer from "./components/footer/Footer";
import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import SkeletonProducts from "./components/SkeletonProducts";

function App() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
      {navigation.state === "loading" ? <SkeletonProducts /> : <Outlet />}
      <Footer />
    </>
  );
}

export default App;
