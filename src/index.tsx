/* @refresh reload */
import { render } from "solid-js/web";
import { initializeApp } from "firebase/app";

import "./index.css";
import { App } from "./App";
import { getAuth } from "firebase/auth";
import { RootLayout } from "./RootLayout";

const firebaseConfig = {
  apiKey: "AIzaSyBswjhGeyBUEhQGpbRSfd4b6nWjjpGgtz4",
  authDomain: "taskjournal-e3f94.firebaseapp.com",
  projectId: "taskjournal-e3f94",
  storageBucket: "taskjournal-e3f94.appspot.com",
  messagingSenderId: "853613213908",
  appId: "1:853613213908:web:36f550ce8664877d94e341",
  measurementId: "G-5FF1LPJNNK",
};

const firebaseApp = initializeApp(firebaseConfig);

getAuth(firebaseApp);

const root = document.getElementById("root");

render(
  () => (
    <RootLayout>
      <App />
    </RootLayout>
  ),
  root!
);
