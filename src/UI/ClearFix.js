import React from 'react';
import {
    View
} from 'react-native';


export default function ClearFix(props) {
    return (
        <View style={{ height: props.height ? props.height : 10 }}>
        </View>
    );
}