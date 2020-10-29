import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image
} from 'react-native';

export default function CardCustomerRounded(props) {
    return (
            <View style={ [styles.cardContainer] }>
                <View style={{ width: '20%', flex: 1 }}>
                    <Image
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}
                    />
                </View>
                <View style={{ width: '60%' }}>
                    <Text style={{ fontSize: 18, color: 'black' }} numberOfLines={1}>{ props.customer }</Text>
                    <Text style={{ fontSize: 13, color: '#909090', marginTop: 3 }} numberOfLines={1}>{ props.description }</Text>
                </View>
                <View style={{ width: '20%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#5B5C5E' }}>{ props.amount }</Text>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderBottomWidth: 0,
        backgroundColor: 'white',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        borderRadius: 25,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        height: 50,
        width: '100%',
        elevation: 3,
        borderColor: '#ddd',
        marginTop: 20
    }
});