import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import Preview from "./pages/preview";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={route}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
