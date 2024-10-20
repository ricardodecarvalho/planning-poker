import { createGlobalStyle } from "styled-components";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./components/AppRouter";
import Footer from "./components/Footer";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f8f9fa;
  }
`;

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
