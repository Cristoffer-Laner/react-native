import React,{ useState } from "react";
import { style } from "./styles";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import {MaterialIcons} from '@expo/vector-icons';
import {Text, View,StatusBar,FlatList, TouchableOpacity} from 'react-native'
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { Button } from "../../components/Button";

type PropCard = {
    item:number,
    title:string,
    description:string,
    flag:'Urgente'|'Opcional'
}

const data:any = [
    {
        item:0,
        title:'Realizar a lição de casa!',
        description:'página 10 a 20',
        flag:'Urgente'
    },
    {
        item:1,
        title:'Passear com cachorro!',
        description:'página 10 a 20',
        flag:'Opcional'
    },
    {
        item:2,
        title:'Sair para tomar açaí!',
        description:'página 10 a 20',
        flag:'Opcional'
    }
]

export default function List (){
    const _renderCard = (data:PropCard,index:number) => {
        return (
            <TouchableOpacity key={data.item} style={style.card}>
                <View style={style.rowCard}>
                    <View style={style.rowCardLeft}>
                        <Ball color="red"/>
                        <View>
                            <Text style={style.titleCard}>{data.title}</Text>
                            <Text style={style.descriptionCard}>{data.description}</Text>
                        </View>
                    </View>
                    <Flag caption={data.flag} color={data.flag === 'Opcional' ? themas.Colors.blueLigth : themas.Colors.red}/>
                </View>
            </TouchableOpacity>
        )
    }
    
    return(
        <View style={style.container}>
            {/* <StatusBar  barStyle="light-content"/> */}
            <View style={style.header}>
                <Text style={style.greeting}>Bom dia, <Text style={{fontWeight:'bold'}}>Cristoffer L.</Text></Text>
                <View style={style.boxInput}>
                    <Input 
                        IconLeft={MaterialIcons}
                        iconLeftName="search"
                    />
                </View>
            </View>
            <View style={style.boxList}>
                <FlatList 
                    data={data}
                    style={{marginTop:40,paddingHorizontal:30}}
                    keyExtractor={(item,index)=>item.number}
                    renderItem={({item,index})=>{return(_renderCard(item,index))}}
                />
            </View>
        </View>
    )
}