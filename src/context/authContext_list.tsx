import React, { createContext, useContext, useEffect, useRef, useState } from "react"; 
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Modalize } from 'react-native-modalize';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Loading } from "../components/Loading";


export const AuthContextList:any= createContext({});

const flags = [
    { caption: 'urgente', color: themas.Colors.red },
    { caption: 'opcional', color: themas.Colors.blueLigth }
];

interface TaskResponse {
    id: number;
    item: number;
    description: string;
    flag: string;
    timeLimit: string;
    createdAt: string;
    updatedAt: string;
}

export const AuthProviderList = (props) => {
    const modalizeRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFlag, setSelectedFlag] = useState('urgente');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [taskList, setTaskList] = useState<any>([]);
    const [taskListBackup,setTaskListBackup]= useState<any>([]);
    const [item,setItem] = useState(0);
    const [loading,setLoading]= useState(false)    

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };

    useEffect(() => {
        get_taskList();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (date) => {
        setSelectedTime(date)
    };

    const handleSave = async () => {        
        const flag = selectedFlag
        const timeLimit = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        ).toISOString()
        onClose();

        try {
            setLoading(true)
            const createTask = await fetch('http://localhost:3030/tasks/create',
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ item: Math.floor(Math.random() * 100000), title, description, flag, timeLimit })
                }
            );

            const getTasks: () => Promise<any> = async () => {
                const url = 'http://localhost:3030/tasks';
                const response: Response = await fetch(url);
                const data = await response.json();
              
                return data;
            };

            const tasks = await getTasks()
            
            setTaskList(tasks);
            setTaskListBackup(tasks);
            setData();
        } catch (error) {
            console.error("Erro ao salvar o item:", error);
            onOpen()
        }finally{
            setLoading(false)
        }
    };

    const filter = async (t:string) => {
        const pesquisa = t.toUpperCase()
    
        const response = await fetch("http://localhost:3030/tasks", {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            }
        })

        const dados = await response.json()

        const novosDados = dados.filter(task =>
            task.title.toUpperCase().includes(pesquisa) ||
            task.description.toUpperCase().includes(pesquisa)
        );

        if (novosDados.length == 0) {
            Alert.alert('Não há tarefas com essa pesquisa', 'My Alert Msg', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
        }

        setTaskList(novosDados)
    }

    const handleEdit = async (itemToEdit:PropCard) => {
        const title = itemToEdit.title
        const description = itemToEdit.description
        const flag = itemToEdit.flag
        const timeLimit = new Date(itemToEdit.timeLimit);
        setTitle(itemToEdit.title);
        setDescription(itemToEdit.description);
        setSelectedFlag(itemToEdit.flag);
        setItem(itemToEdit.item)
        setSelectedDate(timeLimit);
        setSelectedTime(timeLimit);

        const updateTask = await fetch('http://localhost:3030/tasks/update/' + itemToEdit.item,
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ title, description, flag, timeLimit })
            }
        );
        
        get_taskList()
        onOpen(); 
    };
    
    const handleDelete = async (itemToDelete) => {
        try {
            setLoading(true)
            // const storedData = await AsyncStorage.getItem('taskList');
            // const taskList = storedData ? JSON.parse(storedData) : [];
            
            const updatedTaskList = taskList.filter(item => item.item !== itemToDelete.item);

            const response = await fetch('http://localhost:3030/tasks/delete/' + itemToDelete.item, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                }
            });

            setTaskList(updatedTaskList);
            setTaskListBackup(updatedTaskList)
        } catch (error) {
            console.error("Erro ao excluir o item:", error);
        }finally{
            setLoading(false)
        }
    };
    
    async function get_taskList() {
        try {
            const response = await fetch('http://localhost:3030/tasks', {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                }
            });
            
            // Aguarde a resolução de response.json()
            const json = await response.json();
            console.log("Dados recebidos de get_taskList:", json);
            
            setTaskList(json); // Atualize com os dados resolvidos
            setTaskListBackup(json); // Atualize com os dados resolvidos
        } catch (error) {
            console.log("Erro ao buscar a lista de tarefas:", error);
        } finally {
            setLoading(false);
        }
    }

    const _renderFlags = () => {
        return flags.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
                setSelectedFlag(item.caption)
            }}>
                <Flag 
                    caption={item.caption}
                    color={item.color} 
                    selected={item.caption == selectedFlag}
                />
            </TouchableOpacity>
        ));
    };

    const setData = ()=>{
        setTitle('');
        setDescription('');
        setSelectedFlag('urgente');
        setItem(0)
        setSelectedDate(new Date());
        setSelectedTime(new Date());
    }

    const _container = () => {
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === "web" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "web" ? 40 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => onClose()}>
                            <MaterialIcons name="close" size={30} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{item != 0?'Editar tarefa':'Criar tarefa'}</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <AntDesign name="check" size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <Input 
                            title="Título:" 
                            labelStyle={styles.label} 
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Input 
                            title="Descrição:" 
                            numberOfLines={5} 
                            height={100} 
                            multiline 
                            labelStyle={styles.label} 
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}  style={{ width: 200,zIndex:999 }}>
                                <Input 
                                    title="Data limite:" 
                                    labelStyle={styles.label} 
                                    editable={false}
                                    value={selectedDate.toLocaleDateString()}
                                    onPress={() => setShowDatePicker(true)} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}   style={{ width: 100 }}>
                                <Input 
                                    title="Hora limite:" 
                                    labelStyle={styles.label} 
                                    editable={false}
                                    value={selectedTime.toLocaleTimeString()}
                                    onPress={() => setShowTimePicker(true)}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlag}>
                            <Text style={styles.flag}>Flags:</Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                {_renderFlags()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    return (
        <AuthContextList.Provider value={{ onOpen, taskList,handleEdit,handleDelete,taskListBackup,filter}}>
            <Loading loading={loading}/>
            {props.children}
            <Modalize ref={modalizeRef} childrenStyle={{ height: 600 }} adjustToContentHeight={true}>
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    );
};

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        width: '100%',
        height: 40,
        paddingHorizontal: 40,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        width: '100%',
        paddingHorizontal: 20
    },
    label: {
        fontWeight: 'bold',
        color: '#000'
    },
    containerFlag: {
        width: '100%',
        padding: 10
    },
    flag: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});


export const useAuth = () => useContext(AuthContextList);

