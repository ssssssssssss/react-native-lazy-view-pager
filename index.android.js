/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Pager = require("./LazyPager");
var Page = require("./Page");

var navi = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Pager edgeHitWidth={200} pages={[
          "page0             page0",
          "page1             page1",
          "page2             page2",
          "page3             page3",
          "page4             page4",
          "page5             page5",
          "page6",
          "page7",
          "page8",
          "page9",
          "page10",
          "page11",
          "page12",
          "page13",
        ]}
        renderPage = {(index, page) => {
          return (<Page key={"page"+index} data={page}/>);
        }}>
        </Pager>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('navi', () => navi);
