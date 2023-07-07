import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBjnTdBhCuU-l9fBid9_TGoOo1E3AfQiYM",
//   authDomain: "my-vue-project-5d45e.firebaseapp.com",
//   projectId: "my-vue-project-5d45e",
//   storageBucket: "my-vue-project-5d45e.appspot.com",
//   messagingSenderId: "861979389653",
//   appId: "1:861979389653:web:d030bdf3d99d96e711bc5c"
// };

// if (location.hostname === "localhost") {
//     connectAuthEmulator(getAuth(), "http://localhost:5173");
//   }
// initializeApp(firebaseConfig);
const app = createApp(App)

app.use(router)



app.mount('#app')

