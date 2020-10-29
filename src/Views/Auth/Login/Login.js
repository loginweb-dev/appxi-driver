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
            fetch(`https://graph.facebook.com/me?fields=id,name,email,avatart&access_token=${data.accessToken}`)
            .then(res => res.json())
            .then(res => {
                let user = {
                    id: res.id,
                    name: res.name,
                    email: res.email ? res.email : `${res.id}@loginweb.dev`,
                    codePhone: '+591',
                    numberPhone: '',
                    avatar: `http://graph.facebook.com/${res.id}/picture?type=large`,
                    type: 'facebook'
                }
                
                this.props.setUser(user);
                AsyncStorage.setItem('SessionUser', JSON.stringify(user));
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                });
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

     async handleLogin(){
        this.setState({loading: true});
         try {
            const { data } = await axios.post('https://appxiapi.loginweb.dev/auth/local', {
                identifier: this.state.email,
                password: this.state.password
            })
            let miavatar = data.user.driver.avatar ? data.user.driver.avatar.url : null;
            let user = {
                id: data.user.id,
                username: data.user.username ,
                email: data.user.email,
                name: data.user.driver.first_name,
                driver: data.user.driver,
                phone: data.user.phone,
                avatar: `https://appxiapi.loginweb.dev${miavatar}`,
                jwt: data.jwt
            }
    
            AsyncStorage.setItem('SessionUser', JSON.stringify(user));
            this.props.setUser(user);
            this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'TabMenu' }],
                  key: null,
             });
         } catch (error) {
            ToastAndroid.showWithGravity(
                'Error en credenciales Intenta de nuevo',
                ToastAndroid.SHORT,
                ToastAndroid.TOP
            );
            this.setState({loading: false, password: ''});
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