import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ButtonBlock(props) {
    return (
        <TouchableOpacity style={
            [
                styles.button,
                { backgroundColor: props.color, borderColor: props.borderColor ? props.borderColor : props.color },
                props.style ? props.style : {}
            ] }
            onPress={props.onPress}
        >
            <Text style={[styles.label, { color: props.colorText ? props.colorText : 'white' }]}>{props.icon && <Icon name={props.icon} size={20} />}    {props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 3,
        marginVertical: 5,
        borderWidth: 2
    },
    label: {
        padding: 10, fontSize: 15
    }
});