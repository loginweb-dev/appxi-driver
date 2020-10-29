import React, { Component } from 'react';
import { SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    Modal,
    Dimensions
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

// UI
import CardRace from "../../UI/CardRace";
import ClearFix from "../../UI/ClearFix";
import CardCustomerRounded from "../../UI/CardCustomerRounded";

// Config
import { env } from '../../config/env';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class RaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialLat : env.location.latitude,
            initialLon: env.location.longitude,
            region: {
                latitude: env.location.latitude,
                longitude: env.location.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: screenWidth / (screenHeight - 130) * 0.0422
            },
            mapShow: false
        }
    }

    componentDidMount(){
        
    }

    getCurrentLocation(){
        Geolocation.getCurrentPosition(position => {
            this.setState({
                region: {
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                markerOpacity: 1,
                buttonEditVisible: true,
                markerTitle: 'Ubicación actual',
                markerDescription: 'Ubicación obtenida según tu GPS.',
            });

            // Change map center
            this.map.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            });
        });
    }

    getRace = () => {
        this.setState({mapShow: true})
        this.getCurrentLocation();
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    <CardRace
                        customer='Juan perez'
                        avatar=''
                        description='Calle 18 de nov. nro 567'
                        amount='25 Bs.'
                        onPress={this.getRace}
                    />
                    <CardRace
                        customer='Jorge Parada'
                        avatar=''
                        description='Av. del mar esq Nicolas Suarez'
                        amount='20 Bs.'
                        onPress={this.getRace}
                    />
                    <CardRace
                        customer='María Nosa'
                        avatar=''
                        description='Calle Moxos esq Beni'
                        amount='17 Bs.'
                        onPress={this.getRace}
                    />
                    <ClearFix height={50} />
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={this.state.mapShow}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({mapShow: false})}
                >
                    <View>
                        <View style={styles.header}>
                            <CardCustomerRounded
                                customer='Juan perez'
                                avatar=''
                                description='Calle 18 de nov. nro 567'
                                amount='25 Bs.'
                            />
                        </View>
                        <MapView
                            ref={map => {this.map = map}}
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={this.state.region}
                        >
                            <Marker
                                coordinate={
                                    { 
                                        latitude: this.state.region.latitude,
                                        longitude: this.state.region.longitude
                                    }
                                }
                                title='Location'
                                description='Location description'
                                opacity={1}
                            >
                                <Image
                                    source={require('../../assets/images/marker.png')}
                                    style={{ width: 50, height: 50 }}
                                />
                            </Marker>
                        </MapView>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    map: {
        height: screenHeight,
        width: screenWidth,
    },
    header: {
        width: screenWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        zIndex:1,
        paddingHorizontal: 10
    },
});