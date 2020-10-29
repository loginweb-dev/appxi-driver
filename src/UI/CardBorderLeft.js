import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export default function CardBorderLeft(props) {
    return (
        <View style={ [styles.cardContainer, { borderLeftColor: props.borderColor ? props.borderColor : 'black' }] }>
            <View style={{ width: '70%' }}>
                <Text style={{ fontSize: 20, color: props.borderColor ? props.borderColor : 'black' }}>{ props.title }</Text>
                <Text style={{ fontSize: 25, color: '#5B5C5E' }}>{ props.description }</Text>
            </View>
            <View style={{ width: '30%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {props.icon && <Icon name={props.icon} size={40} color={props.borderColor ? props.borderColor : 'black'} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 2,
        borderBottomWidth: 0,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        height: 90,
        width: '100%',
        elevation: 3,
        borderLeftWidth: 10,
        // borderLeftColor: '#2A80DB',
        borderTopColor: '#ddd',
        borderRightColor: '#ddd',
        borderBottomColor: '#ddd',
        padding: 10,
        marginBottom: 10
    }
});