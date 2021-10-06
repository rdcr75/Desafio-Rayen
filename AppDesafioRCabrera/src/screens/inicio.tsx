import React from 'react'
import { View, Text, Button } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

interface Props extends StrackScreenProps<any, any>{};

export const inicio = ( { navigation }: Props ) => {
    
    return (
        <View>
            <Text>Inicio</Text>
            <Button 
                title="Agregar" 
                onPress={ () => navigation.navigate() } 
            />
        </View>
    )
}
