import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { TranslationContainer } from 'react-i18n-lite'

import { ModalProvider } from "./components/Modal";
import { UserProvider } from "./context/UserContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import App from "./App.tsx";
import locales from "./locales";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <UserProvider>
        <ThemeProvider>
          <HelmetProvider>
            <TranslationContainer locales={locales} defaultLanguage="en-US">
              <App />
            </TranslationContainer>
          </HelmetProvider>
        </ThemeProvider>
      </UserProvider>
    </ModalProvider>
  </StrictMode>
);
