import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function SelectDropDownAlt(props) {

    return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <View style={{ width: '100%' }}>
                <Text style={{ color: '#B7B7B7', fontWeight: 'bold' }}>{props.label}</Text>
                <Picker
                    selectedValue={ props.value }
                    style={{height: 40}}
                    onValueChange={ props.onValueChange }>
                    {
                        props.items.map(item => <Picker.Item key={item.id} label={item.label} value={item.value} />)
                    }
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex:1,
    },
});