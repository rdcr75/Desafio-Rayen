import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { inicio } from "../screens/inicio";
import { agregar } from "../screens/agregar";
import { detalle } from "../screens/detalle";
import { modificar } from "../screens/modificar";

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="inicio" component={ inicio } />
            <Stack.Screen name="agregar" component={ agregar } />
            <Stack.Screen name="detalle" component={ detalle } />
            <Stack.Screen name="modificar" component={ modificar } />
        </Stack.Navigator>
    );
}