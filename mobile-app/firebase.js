import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_GOOGLE_API_KEY",
  authDomain: "todoapp-672a1.firebaseapp.com",
  projectId: "todoapp-672a1",
  storageBucket: "todoapp-672a1.appspot.com",
  messagingSenderId: "561686728350",
  appId: "1:561686728350:web:f15ed867404aa8796db58f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }