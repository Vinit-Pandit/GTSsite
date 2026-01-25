import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYLFnqdVLUIPuCky4Mi5gVImsopFY9WH4",
  authDomain: "gtsdatabase-49060.firebaseapp.com",
  databaseURL: "https://gtsdatabase-49060-default-rtdb.firebaseio.com",
  projectId: "gtsdatabase-49060",
  storageBucket: "gtsdatabase-49060.firebasestorage.app",
  messagingSenderId: "248440589844",
  appId: "1:248440589844:web:f324b417bbdca49b436101",
  measurementId: "G-2JGKRQ8L2P"
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
