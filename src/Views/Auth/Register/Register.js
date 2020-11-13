import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { env } from "../../../config/env";
// UI
import BackgroundColor from "../../../UI/BackgroundColor";
import TextInputAlt from "../../../UI/TextInputAlt";
import ButtonBlock from "../../../UI/ButtonBlock";
import ClearFix from "../../../UI/ClearFix";
import SelectDropDownAlt from "../../../UI/SelectDropDownAlt";

import {showMessage} from "react-native-flash-message";
import { CheckBox } from 'react-native';

// ----------  REUX ------------------------
import { connect } from 'react-redux';

// List picker
const types = [
    {
        id: 1,
        label: 'A',
        value: 'A'
    },
    {
        id: 2,
        label: 'B',
        value: 'B'
    },
    {
        id: 3,
        label: 'C',
        value: 'C'
    }
]

class Register extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            loading: false,
            username:'jaiko94',
            // email:'jaiko94.rm@gmail.com',
            // password:'Password',
            phone:'76880954',
            language: 'A',
            experience: '1',
            checked: false,
            brand: 'HONDA',
            model: '2020'
        }
    }
    
    componentDidMount(){
        // console.log(AsyncStorage.getItem('SessionUser'))
    }
    sendForm = async ()=>{
        this.setState({loading: true});
        
        const myquery = await axios.get('https://api.appxi.com.bo/users?username='+this.state.username+'&phone='+this.state.phone);
        // console.log(myquery.data);
        if(myquery.data.length > 0 ){
            showMessage({
                message: "Error en los Datos ",
                description: "Nombre o Telefono, Ya se encuentra REGISTRADOS EN APPXI",
                type: "default",
                icon: 'info'
            });
            this.setState({loading: false});
        }else{

            if(!this.state.checked){
                showMessage({
                    message: "Error en Condiciones ",
                    description: "Tienes que aceptar las condiciones de uso",
                    type: "default",
                    icon: 'info'
                });
                this.setState({loading: false});
            }else{
                await axios.post('https://api.appxi.com.bo/auth/local/register', {
                    username: this.state.username,
                    email: this.state.username+'@appxi.com.bo',
                    password: this.state.phone,
                    phone: this.state.phone,
                });
    
                const token = await axios.post('https://api.appxi.com.bo/auth/local', {
                    identifier: this.state.username,
                    password: this.state.phone
                }) 
                
                let newdrive = await axios.post('https://api.appxi.com.bo/drivers',{
                    alias: token.data.user.username,
                    users_permissions_user: token.data.user.id,
                    category: this.state.language,
                    experience: this.state.experience
                })
                
                await axios.post('https://api.appxi.com.bo/driver-vehicles',{
                    brand: this.state.brand,
                    modelo: this.state.model
                })
                
                AsyncStorage.setItem('SessionUser', JSON.stringify(token));
                this.props.setUser(token);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                })
            }
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundColor
                    title='Registrarse (pre registro)'
                    backgroundColor='trabsparent'
                />
                <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={ styles.form }>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <TextInputAlt
                                    label='Nombre (alias)'
                                    placeholder='Tu nombre completo'
                                    autoCapitalize='words'
                                    onChangeText={text => this.setState({username: text})}
                                    value={this.state.username}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <TextInputAlt
                                    label='Número de celular'
                                    placeholder='Tu número de celular'
                                    keyboardType='phone-pad'
                                    onChangeText={text => this.setState({phone: text})}
                                    value={this.state.phone}
                                />
                            </View>
                        </View>
                        
               
                        {/* <TextInputAlt
                            label='Contraseña'
                            placeholder='Tu contraseña'
                            password
                            onChangeText={text => this.setState({password: text})}
                            value={this.state.password}
                        /> */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <SelectDropDownAlt
                                    label='Categoria de Conducir'
                                    value={this.state.language}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({language: itemValue})
                                    }
                                    items={types}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <TextInputAlt
                                    label='Experiencia de Chofer'
                                    placeholder='experiencia en anios'
                                    onChangeText={text => this.setState({experience: text})}
                                    value={this.state.experience}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <TextInputAlt
                                    label='Marca del Vehiculo'
                                    placeholder='experiencia en anios'
                                    onChangeText={text => this.setState({brand: text})}
                                    value={this.state.brand}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <TextInputAlt
                                    label='Modelo del Vehiculo'
                                    placeholder='experiencia en anios'
                                    onChangeText={text => this.setState({model: text})}
                                    value={this.state.model}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                            <CheckBox
                                value={this.state.checked}
                                onValueChange={() => this.setState({ checked: !this.state.checked })}
                            />
                            <Text style={{ marginRight: 20 }}> Aceptas las Condiciones y uso de APPXI ?</Text>
                        </View>
                               
                        {/* <TextInputAlt
                            label='Email (opcional)'
                            placeholder='Tu email o celular'
                            keyboardType='email-address'
                            onChangeText={text => this.setState({email: text})}
                            value={this.state.email}
                        /> */}
                        <View style={{ margin: 20, marginTop: 30 }}>
                            <ButtonBlock
                                title={this.state.loading ? 'Enviando...' : 'Registrame'}
                                color='white'
                                borderColor='#3b5998'
                                colorText='#3b5998'
                                onPress={this.sendForm}
                                // onPress={this.sendForm.bind(this)}
                            />
                        </View>
                        <ClearFix height={50} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A80DB'
    },
    form:{
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    }
});

//---------------- REDUX ------------------------
const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUser : (newUser) => dispatch({
            type: 'SET_USER',
            payload: newUser
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Register);