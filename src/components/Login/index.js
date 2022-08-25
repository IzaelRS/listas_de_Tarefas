import React, { useState } from "react";
import {
     View,
     Text,
     StyleSheet,
     SafeAreaView,
     StatusBar,
     TextInput,
     TouchableOpacity
} from "react-native";

import firebase from "../../services/firebaseConnection";


export default function Login({ changeStatus }) //mandando a propriedade para userStates
{

     const [email, setEmail] = useState('');
     const [password, SetPassoword] = useState('');
     const [type, setType] = useState('login'); // texto dinamico 

     function handleLogin() {
          //verificando que tipo de funcao
          if (type === 'login') {
               //login usuario
               const user = firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((user) => {
                         changeStatus(user.user.uid)// chamando a propriedade passando somente o id do usuario
                    })
                    .catch((erro) => {
                         console.log(erro);
                         alert('Algo deu errado :( ')
                    })
          } else {
               //cadastrar usuario
               const user = firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                         changeStatus(user.user.uid)
                    })
                    .catch((erro) => {
                         console.log(erro);
                         alert('Algo deu errado em seu cadastro :( ');
                         return;
                    })
          }

     }

     return (
          //safeareaview é um campo seguro usado no ios. Não deixa o campo ficar sobre a statusbar, somente depois.
          <SafeAreaView style={styles.container}>

               <StatusBar
                    backgroundColor="#e5ad06"
                    barStyle="light-content" />

               <TextInput
                    placeholder="Digite o seu email"
                    style={styles.input}
                    value={email}
                    keyboardType={'email-address'}// tipo de teclado
                    onChangeText={(text) => setEmail(text)} // o que digitar vai colocar dentro do setEmail
               />

               <TextInput
                    placeholder="Digite a sua senha"
                    style={styles.input}
                    value={password}
                    keyboardType={'number-pad'}// tipo de teclado
                    onChangeText={(text) => SetPassoword(text)} // o que digitar vai colocar dentro do setPassword
               />

               <TouchableOpacity
                    // style={[styles.areaLoginA, {backgroundColor: type === 'login' ? '****' : '****'}]}
                    style={type === 'login' ? styles.areaLoginA : styles.areaLoginC}
                    onPress={handleLogin}>
                    <Text style={styles.btAcessar}>
                         {type === 'login' ? 'Acessar' : 'Cadastrar'} {/* deixando o texto dinamico */}
                    </Text>

               </TouchableOpacity>

               <TouchableOpacity onPress={() => setType(type => type === 'login' ? 'cadastrar' : 'login')} >
                    {/* esse onpress serve para alterar os dois botoes, assim serve para mudar de login para cadastrar fazendo tipo um loop*/}

                    <Text style={styles.btCriar} >
                         {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
                    </Text>
               </TouchableOpacity >

          </SafeAreaView >
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          paddingTop: 50,
          paddingHorizontal: 10,
          backgroundColor: "#f2d682"
     },
     input: {
          marginBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 7,
          height: 50,
          padding: 10,
          borderWidth: 1,
          borderColor: '#e5ad06'
     },
     areaLoginA: {
          justifyContent: 'center',
          padding: 15,
          position: 'relative', // pode deixar flutuante ou fixo
          borderRadius: 10,
          backgroundColor: '#ffc71f',
          marginTop: 30,
          marginBottom: 20

     },
     areaLoginC: {
          justifyContent: 'center',
          padding: 15,
          position: 'relative', // pode deixar flutuante ou fixo
          borderRadius: 10,
          backgroundColor: '#e58800',
          marginTop: 30,
          marginBottom: 20

     },
     btAcessar: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          height: 30,
          lineHeight: 35 // pode mover o texto em vertical

     },
     btCriar: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 15
     },
});