import React,{createContext,useContext,useEffect,useRef} from "react";
import { Modalize} from 'react-native-modalize';
import {TouchableOpacity,Text, Dimensions, View,StyleSheet} from 'react-native';
import {MaterialIcons,AntDesign} from '@expo/vector-icons';
import { Input } from "../components/Input";
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
export const AuthContextList:any= createContext({});


const flags = [
    {
        caption:'Urgente',
        color:themas.Colors.red
    },
    {
        caption:'Opcional',
        color:themas.Colors.blueLigth
    }
]

export const AuthProviderList = (props:any):any=>{

    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = ()=>{
        modalizeRef.current?.close();
    }

    useEffect(()=>{
        modalizeRef.current?.open();
    },[])


    const _renderFlags = ()=>{
        const vet:any = [ ]

        flags.map((item,index)=>{
            vet.push(<Flag caption={item.caption} color={item.color} key={index}/>)
        })

        return vet
    }

    const _container = () =>{
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>onClose()}>
                        <MaterialIcons 
                            name="close"
                            size={30}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Criar tarefa</Text>
                    <TouchableOpacity>
                        <AntDesign 
                            name="check"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <Input
                        title="Titulo:"
                        labelStyle={styles.label}
                    />
                    <Input
                        title="Descrição:"
                        numberOfLines={5}
                        height={100}
                        multiline
                        labelStyle={styles.label}
                    />
                    <View style={{width:'40%'}}>
                        <Input
                            title="Tempo limite:"
                            labelStyle={styles.label}
                        />
                    </View>
                    <View style={styles.containerFlag}>
                        <Text style={styles.flag}>Flags:</Text>
                        <View style={{flexDirection:'row',gap:10,marginTop:10}}>
                            {_renderFlags()}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
   

    return(
        <AuthContextList.Provider value={{onOpen}}>
            {props.children}
            <Modalize 
                ref={modalizeRef}
                modalHeight={Dimensions.get('window').height/1.3}
            >
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    );
};

export const styles = StyleSheet.create({
    container:{
        width:'100%',
    },
    header:{
        width:'100%',
        height:40,
        paddingHorizontal:40,
        flexDirection:'row',
        marginTop:20,
        justifyContent:'space-between',
        alignItems:'center',
        // backgroundColor:'red'
    },
    title:{
        fontSize:20,
        fontWeight:'bold'
    },
    content:{
        width:'100%',
        paddingHorizontal:20
    },
    label:{
        fontWeight:'bold',
        color:'#000'
    },
    containerFlag:{
        width:'100%',
        padding:10
    },
    flag:{
        fontSize:14,
        fontWeight:'bold'
    }
    
})

export const useAuth= () => useContext(AuthContextList)