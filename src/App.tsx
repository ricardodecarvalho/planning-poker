import { createGlobalStyle } from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import AppRouter from './components/AppRouter';
import useThemeContext from './context/useThemeContext';
import { Helmet } from 'react-helmet-async';

const GlobalStyle = createGlobalStyle``;

function App() {
  const { theme } = useThemeContext();
  return (
    <>
      <Helmet>
        <html lang="en" data-bs-theme={theme} />
      </Helmet>
      <GlobalStyle />
      <ToastContainer autoClose={5000} closeOnClick theme="colored" />
      <AppRouter />
    </>
  );
}

export default App;
