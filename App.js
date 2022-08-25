import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Login from "./src/components/Login";
import List from "./src/components/List";
import firebase from "./src/services/firebaseConnection";





export default function App() {

  const [newTask, setNewTask] = useState('');

  const [user, setUser] = useState(null); // usuario vai comecar nulo

  const inputRef = useRef(null); // para input tarefas

  const [tasks, setTasks] = useState([]);

  const [key, setKey] = useState('');

  useEffect(() => {

    function getUser() {
      // só vai receber a lista se tiver algum usuario cadastrado
      if (!user) {
        return;
      }
      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
        setTasks([]);
        // pecorrendo o array
        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])
        })

      })
    }

    getUser();

  }, [user])

  // deletando do banco e do app
  function handleDelete(key) {
    firebase.database().ref('tarefas').child(user).child(key).remove()
      .then(() => {
        // depois de deletar do banco, deletar do app
        const findTasks = tasks.filter(item => item.key !== key) // retorna todos os itens menos o que foi clicado
        setTasks(findTasks)// amazena no setTasks
      })
  };

  //add uma nova tarefa *
  function handleAdd() {
    // se não digitou nada, nao faz nada
    if (newTask === '') {
      return;
    }
    // usuario quer editar uma tarefa
    if (key !== '') {
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask // a newtask tem a antiga tarefa amazenada e com o comando update ela vai sobreescrever a antiga tarefa e vai usar o key nome para localizar o campo
      })
        .then(() => {
          // essa funcao serve para identificar o index dentro de um array, nesse caso descobrir 
          // a key dentro do banco e atualizando em tempo real no app
          const taksIndex = tasks.findIndex(item => item.key === key) // findIndex serve para identificar aldo dentro de um array, nesse caso a posicao

          let taskClone = tasks;
          taskClone[taksIndex].nome = newTask

          setTasks([...taskClone])
        })

      Keyboard.dismiss();
      setNewTask('');
      setKey('');
      return; // nesse caso é nessessario para parar a execusao 
    }


    // se nao estiver vazio add // continuacao para adcionar uma NOVA tarefa *
    let tarefa = firebase.database().ref('tarefas').child(user);
    // .child(user) serve para passar o id do usuario que esta logado e assim salvando diretamente no perfil do usuario 
    let chave = tarefa.push().key;
    // criando uma chave aleatoria e unica

    tarefa.child(chave).set({
      nome: newTask
    })
      .then(() => {
        // depois de criada vamos anexar tudo dentro de um objeto aproveitando o then
        const data = {
          key: chave,
          nome: newTask
        };

        // depois adcionamos o objeto dentro do array no setTasks juntos com os antigos 
        // oldtasks é uma funcao anonima

        setTasks(oldTasks => [...oldTasks, data])
      })

    alert('tarefa Adicionada :)');
    Keyboard.dismiss(); // fecha o teclado
    setNewTask('') // depois de gravado limpa o campo de input


  }
  //editar tarefas
  function handleEdit(data) {
    setKey(data.key)
    setNewTask(data.nome) // serve para editar a tarefa selecionada 
    inputRef.current.focus(); // serve para chama o teclado novamente depois de clicar na tareafa
  };
  // cancelar edicao
  function cancelarEdicao() {
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  };

  function sair(user) {

    setUser('');

    if (setUser('')) {
      return <Login changeStatus={(user) => setUser(user)} />
    }
  };



  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />// changestatus serve para passa uma propriedade(user) para um component(login).

    // se nào tiver nada no component user ele vai retornar o campo login, e se tiver vai retorna a tela de tarefas.

    //basicamento se o userState estiver amazenado algo ele retorna a tela de tarefas, caso seja vazio ou nulo ele retorna login.
  }

  return (
    //safeareaview é um campo seguro usado no ios. Não deixa o campo ficar sobre a statusbar, somente depois.
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#e5ad06"
        barStyle="light-content" />


      {
        key.length > 0 && (
          <View style={styles.areaExcluir}>
            <TouchableOpacity onPress={cancelarEdicao}>
              <Feather
                name="x-square"
                size={22}
                color="#FF0000"
              />
            </TouchableOpacity>
            <Text style={styles.txEx}>
              Você está editando uma tarefa !!!
            </Text>
          </View>
        )
      }

      <View style={styles.containerSub}>

        <View style={styles.containerInput}>
          <TextInput
            style={styles.inText}
            placeholder="Digite a sua tarefa"
            value={newTask}
            onChangeText={(text) => setNewTask(text)}
            ref={inputRef} // chama a usuRef para referenciar esse input

          />

          <TouchableOpacity
            style={styles.btAdd}
            onPress={handleAdd}
          >

            <Feather
              name="save"
              color="#180605"
              size={21}
            />
          </TouchableOpacity>

        </View>
        <View style={styles.containerSair}>
          <TouchableOpacity
            style={styles.btSair}
            onPress={sair}
          >
            <MaterialIcons
              name="people-alt"
              color="#e5ad06"
              size={50}
            />
            <Text>
              logout
            </Text>
          </TouchableOpacity>
        </View>


      </View>

      <FlatList

        data={tasks}
        keyExtractor={item => item.key} // extraindo a key
        renderItem={({ item }) => (
          <List
            data={item}   // manda o item para o tasklist
            deleteItem={handleDelete} // propriedade que recebe uma funcao que contem um key
            editItem={handleEdit} // propriedade que recebe uma funcao que contem a data (todos os dados)
          />
        )}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#f2d682",

  },

  containerSub: {
    justifyContent: 'space-between',
  },
  containerSair: {
    backgroundColor: "#f2d682",
    margin: 10,
    alignItems: 'center'
  },
  btSair: {

    alignItems: 'center'
  },
  containerInput: {
    flexDirection: 'row',
  },
  inText: {
    flex: 1,
    height: 60,
    padding: 10,
    borderRadius: 7,
    borderWidth: 2,
    marginBottom: 2,
    backgroundColor: '#fff',
    borderColor: '#e5ad06'
  },
  areaExcluir: {
    flexDirection: 'row'

  },

  btExcluir: {

  },

  txEx: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 15,
    color: '#f44336'

  },
  btAdd: {
    backgroundColor: '#e58800',
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    marginLeft: 4,
    paddingHorizontal: 19,
    borderWidth: 0.50
  },
  tx: {
    fontSize: 25,
    fontWeight: 'bold'
  }
});