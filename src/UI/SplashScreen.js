import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

// Configurations
import { env } from '../config/env.js';

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true
        }
        this.bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {
        const SessionUser = await AsyncStorage.getItem('SessionUser');
        let user = SessionUser ? JSON.parse(SessionUser) : {};
        setTimeout(()=>{
            this.setState({
                isLoading: false
            }, () => {
                console.log(user);
                this.props.setUser(user);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: user.id ? 'TabMenu' : 'Login' }],
                    key: null,
                });
            });
        }, 2300);
    };

    render(){
        return (
            <View style={ style.container }>
                <Image 
                    source={{uri: 'https://mystorage.loginweb.dev/storage/Projects/appxi/icon-512x512.png'}}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.title}>{env.appName}</Text>
                <View style={style.footer}>
                    <Text style={style.footerText}>Powered by <Text style={style.footerTextAutor}>{env.autor}</Text></Text>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Config.color.backgroundSplash,
    },
    logo: {
        flexDirection: 'column',
        width: 200,
        height: 200,
        marginBottom: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom:10,
        // color: Config.color.backgroundSplashText
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30
    },
    footerText: {
        textAlign: 'center',
        fontSize: 15,
        // color: Config.color.backgroundSplashText
    },
    footerTextAutor: {
        fontWeight: 'bold'
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

export default connect(null, mapDispatchToProps)(SplashScreen);