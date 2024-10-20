import { createGlobalStyle } from "styled-components";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./components/AppRouter";
import Footer from "./components/Footer";

const GlobalStyle = createGlobalStyle``;

function App() {
  return (
    <>
      <GlobalStyle />
      <ToastContainer autoClose={5000} closeOnClick theme="colored" />
      <AppRouter />
      <Footer />
    </>
  );
}

export default App;
