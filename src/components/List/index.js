import React from "react";
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     TouchableWithoutFeedback
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function List({ data, deleteItem, editItem }) // extrando a propriedade 
{
     return (


          <View style={styles.container}>

               <TouchableOpacity
                    style={styles.btnLixo}
                    onPress={() => deleteItem(data.key)}
               >
                    <Feather
                         name="trash-2"
                         color="#180605"
                         size={25}
                    />
               </TouchableOpacity>


               <View style={styles.subContainer}>
                    {/* botao sem opacidade*/}
                    <TouchableWithoutFeedback
                         onPress={() => editItem(data)} >
                         <Text style={styles.list}>
                              * {data.nome}
                         </Text>
                    </TouchableWithoutFeedback>

               </View>

          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#e58800',
          alignItems: 'center',
          marginBottom: 15,
          padding: 15,
          borderRadius: 6,
          borderWidth: 2,

     },

     btnLixo: {
          justifyContent: 'center',
          marginRight: 15,
          position: 'relative'

     },
     subContainer: {
          paddingRight: 10
     },
     list: {
          paddingRight: 8,
          fontSize: 17,
          fontWeight: 'bolt'
     }
})