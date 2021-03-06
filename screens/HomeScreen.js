import React from 'react'
import { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native'
import { AntDesign, SimpleLineIcons} from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import CustomListItem from '../components/CustomListItem'

import { useState } from 'react'
import { useEffect } from 'react'
import { auth, db } from '../firebase'

const HomeScreen = ({navigation}) => {
    // console.log(auth.currentUser.photoURL);
    const [chats, setChats]= useState([]);

    const signOutUser = ()=>{
        auth.signOut().then(()=>{
            navigation.replace("Login");
        });
    }

    useEffect(()=>{
        const unsubscribe= db.collection('chats').onSnapshot((snapshot)=>
            setChats(
                snapshot.docs.map((doc)=>({
                id: doc.id,
                data: doc.data()
            }))
          )
        );
        return unsubscribe;
    },[])

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Z Chat",
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: {color: 'black'},
            headerTintColor: 'black',
            headerLeft: ()=> 
            (<View style={{ marginLeft: 20}}>
                <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                <Avatar rounded source={{uri:
                    auth?.currentUser?.photoURL}}>
                </Avatar> 
                </TouchableOpacity>

            </View>),
            headerRight: ()=>
            (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20
                    
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <SimpleLineIcons name="pencil" onPress={()=>navigation.navigate("AddChat")} size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            )
        });
    },[navigation]);

    const enterChat=(id, chatName)=>{
        navigation.navigate('Chat',{
            id,
            chatName,
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {
                    chats.map(({id,data: {chatName}})=>(
                        <CustomListItem enterChat={enterChat} key={id} id={id} chatName={chatName} />
                        ))
                }
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        height: '100%'
    }
})
