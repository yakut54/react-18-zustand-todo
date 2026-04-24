import { store } from "./store";
import { StrictMode } from "react";
import Router from "./app/Router.tsx";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./app/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
