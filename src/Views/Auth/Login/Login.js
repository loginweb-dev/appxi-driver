import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    Alert,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

// Firebase
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

// UI
import BackgroundColor from "../../../UI/BackgroundColor";
import TextInputAlt from "../../../UI/TextInputAlt";
import ButtonBlock from "../../../UI/ButtonBlock";
import axios from 'axios';
import { env } from "../../../config/env";


GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '932613022200-34onbha0rj13ef7gkl8kvoldtrea7gm4.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'jaiko94.rm@gmail.com',
            password: 'Password',
            loading: false,
            checked: true,
            userInfo:{},
            showPassword: false
        }
    }

    onFacebookButtonPress = async () => {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        AccessToken.getCurrentAccessToken()
        .then((data) => {
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            // Sign-in the user with the credential
            auth().signInWithCredential(facebookCredential);

            // Get information from Facebook API 
            fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`)
            .then(res => res.json())
            .then(res => {
                let user = {
                    first_name: res.name,
                    last_name: '',
                    email: res.email ? res.email : `${res.id}@loginweb.dev`,
                    password: 'password',
                    confirmed: true
                }
                this.handleLoginSocial(user);
            })
            .catch(error => {
                console.log(error);
            })
            
        })
        
    }

    onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let user = {
                id: userInfo.user.id,
                name: userInfo.user.name,
                email: userInfo.user.email,
                codePhone: '+591',
                numberPhone: '',
                avatar: userInfo.user.photo,
                type: 'google'
            }
            this.props.setUser(user);
            AsyncStorage.setItem('SessionUser', JSON.stringify(user));
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabMenu' }],
                key: null,
            });
        } catch (error) {
            console.log(error)
        }
    }
    handleLoginSocial(credential){
        let url = `${env.API}/customers/auth/social`;
        axios.post(url, credential)
        .then(res => {
            // console.log(res.data)
            this.successLogin(res.data);
        })
        .catch(error => console.log(error))
    }
    async handleLogin(){

        this.setState({loading: true});

        if (this.state.email && this.state.password) {

            let url = `${env.API}/auth/local`;

            let credential = {
                identifier: this.state.email,
                password: this.state.password    
            }
            let res = await axios.post(url, credential)
                            .then(res => res.data)
                            .catch(error => null);     
            if (res) {
                let miavatar = res.user.drive.avatar ? res.user.drive.avatar.url : null;
                let user = {
                    id: res.user.id,
                    name: res.user.first_name,
                    last_name: res.user.last_name,
                    email: res.user.email,
                    codePhone: '+591',
                    numberPhone: res.user.phone,
                    avatar: `https://appxiapi.loginweb.dev${miavatar}`,
                    type: 'dashboard',
                    jwt: res.user.jwt
                }
                this.successLogin(user);
            }else{
                showMessage({
                    message: "Credenciales incorrectos",
                    description: "Su email y/o contrasela no están registrados.",
                    type: "warning",
                    icon: 'warning'
                });
            }   
        }else{
            showMessage({
                message: "Error de validación",
                description: "Debe ingresar un email y contraseña válidos.",
                type: "warning",
                icon: 'warning'
            });        
        }
    } 
    
    successLogin(user){
        this.props.setUser(user);
        AsyncStorage.setItem('SessionUser', JSON.stringify(user));
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'TabMenu' }],
            key: null,
        });
    } 

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundColor
                    title='Login'
                    backgroundColor='transparent'
                />
                <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                    
                    <View style={ styles.form }>
                        <TextInputAlt
                            label='Email'
                            placeholder='Tu email o celular'
                            keyboardType='email-address'
                            value={this.state.email}
                            onChangeText={text => this.setState({email: text})}
                        />
                        <TextInputAlt
                            label='Contraseña'
                            placeholder='Tu contraseña'
                            password
                            showPassword={this.state.showPassword}
                            value={this.state.password}
                            onChangeText={text => this.setState({password: text})}
                            // onShowPassword={() => this.setState({showPassword: !this.state.showPassword})}
                        />
                        <View style={{ margin: 20 }}>
                            <ButtonBlock
                                title={this.state.loading ? 'Enviando...' : 'Login'}
                                color='white'
                                borderColor='#3b5998'
                                colorText='#3b5998'
                                onPress={() => this.handleLogin()}
                            />
                        </View>
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: '#B7B7B7' }}>O inicia sesión con tus redes sociales</Text>
                        </View>
                        <View style={{ padding: 30, paddingTop: 20}}>
                            <ButtonBlock
                                icon='ios-logo-facebook'
                                title='Login con Facebook'
                                color='#3b5998'
                                onPress={ this.onFacebookButtonPress }
                            />
                            <ButtonBlock
                                icon='ios-logo-google'
                                title='Login con Google'
                                color='red'
                                onPress={ this.onGoogleButtonPress }
                            />
                            <ButtonBlock
                                title='Registrarse'
                                color='transparent'
                                colorText='#45A4C0'
                                style={{ marginTop: 15 }}
                                onPress={() => this.props.navigation.navigate('Register')}
                            />
                        </View>
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

const mapDispatchToProps = (dispatch) => {
    return {
        setUser : (user) => dispatch({
            type: 'SET_USER',
            payload: user
        })
    }
}

export default connect(null, mapDispatchToProps)(Login);