import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';

export default function BackgroundColor(props) {
    return (
        <View style={{ height: 150, backgroundColor: props.backgroundColor }}>
            <View style={{ flex: 1, flexDirection: 'column-reverse', padding: 20 }}>
                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>{props.title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
});