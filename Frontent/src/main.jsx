import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loginReducer from "./store/loginSlice.js";
import placeReducer from "./store/placesSlice.js";
import statesReducer from './store/statesSlice.js'
import favoriteReducer from "./store/favoriteSlice.js";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    loginReducer: loginReducer,
    places: placeReducer,
    states: statesReducer,
    favorites: favoriteReducer,
}
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  </StrictMode>
);