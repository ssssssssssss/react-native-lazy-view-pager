'use strict';

var React = require('react-native');
var {
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
  InteractionManager,
  Image,
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var Page = React.createClass({
  /*
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.key !== this.props.key;
  },
  */
  getInitialState() {
    return {
      display:false,
    };
  },
  componentDidMount(){
    console.log("Page mount", this.props.key);
    this.setState({
      display: true
    });
  },
  render(){
    let color = ['red', 'green', 'blue'][Math.floor(Math.random()*3)];
    let data = this.props.data;
    console.log("render data", this.props.data);
    return (this.state.display && data) ? (
      <View 
        collapsable={false}
        /*needsOffscreenAlphaCompositing={true}*/
        /*renderToHardwareTextureAndroid={true}*/
        style={{
          width:deviceWidth, 
          backgroundColor:color, 
        }}>
      <ScrollView style={{
        flex:1,
      }} contentContainerStyle={{
        //flex:1,
        justifyContent:'center',
        alignItems:'center',
      }}>
        <View>
          <Image source={{uri: "http://7xlz1k.com2.z0.glb.qiniucdn.com/@/com/iyunwang/iphone.png"}} style={{width:240, height:1200}}>
            <Text>{JSON.stringify(data)}</Text>
          </Image>
        </View>
      </ScrollView>
      </View>
    ) : null},
});

module.exports = Page;
