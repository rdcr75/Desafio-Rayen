//import android.os.Bundle;
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, FlatList } from 'react-native';
//import { StackNavigator } from './src/navigator/StackNavigator';

export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      loading: false,
      tutorial: [],
      url: 'https://rayentutorialtestapp.azurewebsites.net/'
    }
  }

  componentDidMount(){
    this.peticionGet();
  }

  peticionGet = () => {
    this.setState({loading:true})

    fetch(this.state.url + "tutorials")
    .then(res => res.json())
    .then(res => {
      this.setState({
        tutorial: res,
        url: res.next,
        loading: false
      })
    });
  };

  render(){
    
    if(this.state.loading){
      return (
        <View style={styles.container}>
          <Text>Descargando Tutoriales</Text>
        </View>
      );
    }
    /* 
    return(
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    );
    /*
    return(
      <View><Text>TESTING</Text></View>
    );
    */
       
    return (
      
      <View style={{flex:1, paddingTop:50, paddingLeft:5}}>
        <Text>Tutoriales</Text>
        <FlatList 
          data={this.state.tutorial} 
          renderItem={ ({item}) => <Text>{item.nombre} - {item.profesor} - {item.fecha}</Text> } 
          keyExtractor={(item, index) => item.id.toString()}
        />
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
