import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';

// UI
import BackgroundColor from "../../../UI/BackgroundColor";
import TextInputAlt from "../../../UI/TextInputAlt";
import ButtonBlock from "../../../UI/ButtonBlock";
import ClearFix from "../../../UI/ClearFix";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
// ----------  REUX ------------------------
import { connect } from 'react-redux';


class Register extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            loading: false,
            username:'jaiko94',
            email:'jaiko94.rm@gmail.com',
            password:'Password',
            phone:'76880951',
            confirmed: true     
        }
    }
    
    componentDidMount(){
        // console.log(AsyncStorage.getItem('SessionUser'))
    }
    sendForm = async ()=>{
        this.setState({loading: true});
        console.log('hola');
        let login = {
            username: this.state.username,
            email:this.state.email,
            password:this.state.password,
            phone: this.state.phone,
            confirmed:true
        }

         await axios.post('https://appxiapi.loginweb.dev/users', login);

        //------------  recuperar Token ----------------
        const { data } = await axios.post('https://appxiapi.loginweb.dev/auth/local', {
            identifier: this.state.email,
            password: this.state.password
        }) 
        //    console.log(data);

        await axios.post('https://appxiapi.loginweb.dev/drivers',{
            first_name: this.state.username,
            user_id:  data.user.id
        })

        let user = {
            id: data.user.id,
            username: data.user.username ,
            email: data.user.email,
            phone: data.user.phone,
            name: data.user.username,
            driver: data.user.driver,
            // avatar: `https://appxiapi.loginweb.dev${miavatar}`,
            jwt: data.jwt
        }
        console.log(user);
        AsyncStorage.setItem('SessionUser', JSON.stringify(user));
        this.props.setUser(user);
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'TabMenu' }],
            key: null,
        })
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundColor
                    title='Registrarse'
                    backgroundColor='trabsparent'
                />
                <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={ styles.form }>
                        <TextInputAlt
                            label='Nombre completo'
                            placeholder='Tu nombre completo'
                            autoCapitalize='words'
                            onChangeText={text => this.setState({username: text})}
                            value={this.state.username}
                        />
                        <TextInputAlt
                            label='Número de celular'
                            placeholder='Tu número de celular'
                            keyboardType='phone-pad'
                            onChangeText={text => this.setState({phone: text})}
                            value={this.state.phone}
                        />
                        <TextInputAlt
                            label='Email'
                            placeholder='Tu email o celular'
                            keyboardType='email-address'
                            onChangeText={text => this.setState({email: text})}
                            value={this.state.email}
                        />
                        <TextInputAlt
                            label='Contraseña'
                            placeholder='Tu contraseña'
                            password
                            onChangeText={text => this.setState({password: text})}
                            value={this.state.password}
                        />
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