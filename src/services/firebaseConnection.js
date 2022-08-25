import firebase from "firebase";
import 'firebase/auth'; // autentificacao
import 'firebase/database'; // banco de dados

let firebaseConfig = {
  apiKey: "AIzaSyCL4tlcXpH6gckG6PNb_Sc8-UBxf61BL9U",
  authDomain: "tarefasapp-a954a.firebaseapp.com",
  projectId: "tarefasapp-a954a",
  storageBucket: "tarefasapp-a954a.appspot.com",
  messagingSenderId: "1029212151765",
  appId: "1:1029212151765:web:8558d18c68d1f296b7a75c",
  measurementId: "G-RYZZDHPD6K"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
// se nao estiver nenhuma conexao aberta, entao irei inicializar uma conexao

export default firebase;