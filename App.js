import React, { useCallback, useState, useEffect } from 'react'; 
import {View, Text, StyleSheet, TouchableOpacity, Button,
   SafeAreaView, FlatList, Modal, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import  TarefaLista from './src/components/TarefaLista';

 
export default function App(){
  const [tarefa,setTarefa] = useState([]);
  const [open,setOpen] = useState(false);
  const [input, setInput] = useState('');

    useEffect(()=>{
     async function loadTasks(){
       const taskStronge = await AsyncStorage.getItem('@task');

       if(taskStronge){
         setTarefa(JSON.parse(taskStronge));
       }
     }

     loadTasks();
    },[]);

    useEffect(()=>{
     async function salvandoTask(){
       await AsyncStorage.setItem('@task',JSON.stringify(tarefa));
     }

     salvandoTask();
    },[tarefa])

  function Add(){
    if(input === '')return;

    const data = {
      key: input,
      tarefa: input
    };

    setTarefa([...tarefa,data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data)=>{
    const find = tarefa.filter(r => r.key !== data.key);
    setTarefa(find);
  })

  const handleUpdate = useCallback((data)=>{
    setOpen(true);
    const find = tarefa.filter(r => r.key !== data.key);
    setTarefa(find);

  })
  
  return(
    //Inicio -> onde fica o titulo
    <SafeAreaView style={styles.conteiner}>
        <View>
          <Text style={styles.title}>Mural da Avisos</Text>
        </View>
       
       
        {/*Conecta com o .scr/index.js para aparece os avisos na tela  */}
        <FlatList
        showsHorizontalScrollIndicator={false}
        data={tarefa}
        keyExtractor={(item)=> String(item.key)}
        renderItem={({item})=> <TarefaLista data={item} 
        handleDelete={handleDelete} 
        handleUpdate ={handleUpdate}/>}
        />
        
        
        {/*Espaço feito para a area emm que vai criar as novas tarefas */}
        <Modal transparent={false} visible={open}>
          <SafeAreaView style={styles.conteiner}>
          
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style=  {styles.retorno}> Voltar </Text>
            </TouchableOpacity>

            
            <Text style={styles.title}>Novo Aviso</Text>
          
            
            
            <View style={styles.corpo}>
              <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="Digite aqui ?"
              value={input}
              onChangeText={(texto)=> setInput(texto)}
              style={styles.input}
              maxLength={250}
              />
            </View>

            

            <TouchableOpacity style={styles.corpoBtn} onPress={Add}>
              <Text style={styles.btn}>Cadastrar</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        
        
        {/*Inicio dos comandos para o botão lateral */}
        <TouchableOpacity style={styles.botao}>
          <Button
          style={styles.btnText}
          color='#001a33'
          title="+"
          onPress={() => setOpen(true)}
          />
        </TouchableOpacity>

      
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
conteiner:{
flex: 1,
backgroundColor:'#35AAFF',
},
title:{
fontSize: 25,
fontStyle: 'italic',
textAlign:'center',
marginTop: 10,
},
botao:{
  position:'absolute',
  width:60,
  height:60,
  right: 10,
  bottom: 25,
  top:545,
  zIndex:9,
},
corpo:{
  marginTop: 15,
},
input:{
  fontSize:15,
  marginLeft:10,
  marginRight: 10,
  marginTop: 30,
  backgroundColor:'#FFF',
  padding: 9,
  height: 85,
  textAlignVertical: 'top',
  color:'#000',
  borderRadius: 5
},
btn:{
  backgroundColor:'#001a33',
  marginTop: 10,
  justifyContent:'center',
  textAlign: 'center',
  marginLeft: 10,
  marginRight: 10,
  height: 40,
  color:'#FFF',
  borderRadius: 5,
  fontSize: 20
},
retorno:{
  fontSize: 20,
  marginTop: 10,
}
});
