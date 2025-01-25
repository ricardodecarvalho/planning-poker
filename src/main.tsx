import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ModalProvider } from "./components/Modal";
import { UserProvider } from "./context/UserContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <UserProvider>
        <ThemeProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </UserProvider>
    </ModalProvider>
  </StrictMode>
);
