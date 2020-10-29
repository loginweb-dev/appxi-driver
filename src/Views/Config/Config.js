import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions
}
from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage } from "react-native-flash-message";
import { connect } from 'react-redux';

// UI
import Card from "../../UI/Card";
import TextInputAlt from "../../UI/TextInputAlt";
import ButtonBlock from "../../UI/ButtonBlock";
import ClearFix from "../../UI/ClearFix";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formShow: false
        }
    }

    submitForm = () => {
        showMessage({
            message: "Perfil actualizado",
            description: "Sus Datos han sido actualizados.",
            type: "info",
            icon: 'info'
        });
        this.setState({formShow: false})
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    <Card>
                        <TouchableOpacity onPress={ () => this.setState({formShow: true}) }>
                            <View style={ [styles.cardContainer] }>
                                <View style={{ width: '40%', flex: 1 }}>
                                    <Image
                                        style={{ width: 80, height: 80, borderRadius: 40 }}
                                        source={{ uri: this.props.user.avatar }}
                                    />
                                </View>
                                <View style={{ width: '60%', paddingLeft: 30 }}>
                                    <Text style={{ fontSize: 18, color: 'black' }} numberOfLines={1}>{ this.props.user.name }</Text>
                                    <Text style={ styles.textMuted } numberOfLines={1}>{ this.props.user.email }</Text>
                                    <Text style={ styles.textMuted } numberOfLines={1}>{ this.props.user.phone }</Text>
                                </View>
                                <View style={{ width: '5%', flex: 1, alignItems: 'center', flexDirection: 'row-reverse' }}>
                                    <Icon name="chevron-forward" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={ [styles.cardContainer, { marginTop: 20, borderTopColor: '#F5F5F5', borderTopWidth: 2, paddingTop: 10 } ] }>
                            <Counter amount='12' label='Carreras' />
                            <Counter amount='4,5' label='Puntos' />
                            <Counter amount='1,2 K' label='Monto' />
                        </View>
                    </Card>
                    <ClearFix height={50} />
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={this.state.formShow}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({formShow: false})}
                >
                    <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontSize: 20, marginHorizontal: 20, marginBottom: 20 }}>Editar Perfil</Text>
                            <Image
                                style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 10 }}
                                source={{ uri: this.props.user.avatar }}
                            />
                        </View>
                        <View style={ styles.form }>
                            <TextInputAlt
                                label='Nombre completo'
                                placeholder='Tu nombre completo'
                                autoCapitalize='words'
                            />
                            <TextInputAlt
                                label='Número de celular'
                                placeholder='Tu número de celular'
                                keyboardType='phone-pad'
                            />
                            <TextInputAlt
                                label='Email'
                                placeholder='Tu email o celular'
                                keyboardType='email-address'
                            />
                            <TextInputAlt
                                label='Contraseña'
                                placeholder='Tu contraseña'
                                password
                            />
                            <View style={{ margin: 20, marginTop: 30 }}>
                                <ButtonBlock
                                    title='Editar'
                                    color='white'
                                    borderColor='#3b5998'
                                    colorText='#3b5998'
                                    onPress={ this.submitForm }
                                />
                            </View>
                        </View>
                        <ClearFix height={50} />
                    </ScrollView>
                </Modal>
            </SafeAreaView>
        )
    }
}

const Counter = (props) => {
    return(
        <View style={{ width: '33.3%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, color: '#5B5C5E' }}>{ props.amount }</Text>
            <Text style={{ fontSize: 15, color: '#5B5C5E' }}>{ props.label }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    textMuted: {
        fontSize: 13,
        color: '#9A9A9A',
        marginTop: 3
    },
    form:{
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    }
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Config);