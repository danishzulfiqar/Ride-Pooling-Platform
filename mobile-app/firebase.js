import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_GOOGLE_API_KEY",
  authDomain: "RidePool",
  databaseURL: "https://your-firebase-project-default-rtdb.firebaseio.com",
  projectId: "your-firebase-project",
  storageBucket: "your-firebase-project.appspot.com",
  messagingSenderId: "947991865853",
  appId: "1:947991865853:web:c45847b66466a431191194",
  measurementId: "G-1G0W7QGJRP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
