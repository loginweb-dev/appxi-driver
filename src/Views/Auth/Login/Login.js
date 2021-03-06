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
            email: 'jaiko94',
            password: '76880954',
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
                console.log(res);
                this.loginfacebook(res);
            })
            .catch(error => {
                console.log(error);
            })
            
        })
        
    }
    loginfacebook = async (user) => {
        this.setState({loading: true});
        const myquery = await axios.get('https://api.appxi.com.bo/users?email='+user.email+'&username='+user.name);

        if(myquery.data.length > 0 ){
            const token = await axios.post('https://api.appxi.com.bo/auth/local', {
                identifier: user.email,
                password: 'facebook2020'
            });
            // console.log(token);
            AsyncStorage.setItem('SessionUser', JSON.stringify(token));
            this.props.setUser(token);
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabMenu' }],
                key: null,
            })
        }else{
            await axios.post('https://api.appxi.com.bo/auth/local/register', {
                    username: user.name,
                    email: user.email,
                    password: 'facebook2020',
                    phone: user.id,
                });
    
                const token = await axios.post('https://api.appxi.com.bo/auth/local', {
                    identifier: user.name,
                    password: 'facebook2020'
                }) 
                console.log(token.data);
                await axios.post('https://api.appxi.com.bo/drivers',{
                    alias: token.data.user.name,
                    users_permissions_user: token.data.user.id
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
    onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            // console.log(userInfo);
            this.setState({loading: true});
            // console.log('https://api.appxi.com.bo/users?email='+userInfo.user.email);
            const myquery = await axios.get('https://api.appxi.com.bo/users?email='+userInfo.user.email+'&username='+userInfo.user.name);
            // console.log(myquery.data);
            if(myquery.data.length > 0){
                const token = await axios.post('https://api.appxi.com.bo/auth/local', {
                    identifier: userInfo.user.email,
                    password: 'google2020'
                });
                // console.log(token);
                AsyncStorage.setItem('SessionUser', JSON.stringify(token));
                this.props.setUser(token);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                })
            }else{
                console.log(userInfo);
                await axios.post('https://api.appxi.com.bo/auth/local/register', {
                    username: userInfo.user.name,
                    email: userInfo.user.email,
                    password: 'google2020',
                    phone: userInfo.user.id,
                    // avatar: userInfo.user.photo
                });
    
                const token = await axios.post('https://api.appxi.com.bo/auth/local', {
                    identifier: userInfo.user.name,
                    password: 'google2020'
                }) 
                // console.log(token.data);
                await axios.post('https://api.appxi.com.bo/drivers',{
                    alias: token.data.user.name,
                    users_permissions_user: token.data.user.id
                })
    
                AsyncStorage.setItem('SessionUser', JSON.stringify(token));
                this.props.setUser(token);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                })
            }
        // console.log(userInfo);

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
            let res = await axios.post(`${env.API}/auth/local`, {identifier: this.state.email, password: this.state.password})
                            .then(res => res.data)
                            .catch(error => null);    
            // console.log(res); 
            if (res) {
                this.props.setUser(res);
                AsyncStorage.setItem('SessionUser', JSON.stringify(res));
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                });
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
                            label='Email o Nombre'
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