import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';

// Components
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

// UI
import CardBorderLeft from "../../UI/CardBorderLeft";
import ClearFix from "../../UI/ClearFix";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    <CardBorderLeft
                        title='Carreras realizadas'
                        description='10'
                        icon='car-sport-sharp'
                        borderColor='#2A80DB'
                    />
                    <CardBorderLeft
                        title='Distancia recorrida'
                        description='7 Km.'
                        icon='ios-map'
                        borderColor='#69CB39'
                    />
                    <CardBorderLeft
                        title='Monto acumulado'
                        description='340 Bs.'
                        icon='ios-cash-outline'
                        borderColor='#E44F42'
                    />
                    <LineChart
                        data={{
                            labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Dom"],
                            datasets: [
                                {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width-20}
                        height={180}
                        yAxisLabel="Bs."
                        chartConfig={{
                            backgroundGradientFrom: "#156095",
                            backgroundGradientTo: "#3E97D5",
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#2A65A9"
                            }
                        }}
                        bezier
                        style={{
                            borderRadius: 10
                        }}
                    />
                    <ClearFix height={50} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingHorizontal: 10
    }
});