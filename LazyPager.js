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

var LazyPager = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.currentPage !== this.state.currentPage;
  },

  getDefaultProps() {
    return {
      pages: [],
      retainPagesCount: 5,
      edgeHitWidth: 30,
      renderPage: (index, data) => {
        let color = ['red', 'green', 'blue'][Math.floor(Math.random()*3)];
        return data ? (
          <View 
            collapsable={false}
            key={"page" + index}
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
        ) : null;
      }
    }
  },

  getInitialState() {
    return {
      currentPage: 0,
      scrollValue: new Animated.Value(0)
    };
  },

  componentWillMount() {
    var release = (e, gestureState) => {
      var relativeGestureDistance = gestureState.dx / deviceWidth,
        //lastPageIndex = this.props.children.length - 1,
        vx = gestureState.vx,
        newPage = this.state.currentPage;

      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= 0.5)) {
        newPage = newPage + 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 0.5)) {
        newPage = newPage - 1;
      }

      this.props.hasTouch && this.props.hasTouch(false);
      //this.goToPage(Math.max(0, Math.min(newPage, this.props.children.length - 1)));
      let page = Math.max(0, Math.min(newPage, this.props.pages.length - 1));
      console.log("To data index: ", newPage, ", calculated page: ", page); 
      this.goToPage(page);
    }

    this._panResponder = PanResponder.create({
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if ((gestureState.moveX <= this.props.edgeHitWidth ||
               gestureState.moveX >= deviceWidth - this.props.edgeHitWidth) &&
                 this.props.locked !== true) {
            this.props.hasTouch && this.props.hasTouch(true);
          return true;
          }
        }
      },

      // Touch is released, scroll to the one that you're closest to
      onPanResponderRelease: release,
      onPanResponderTerminate: release,

      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        var dx = gestureState.dx;
        //var lastPageIndex = this.props.children.length - 1;

        // This is awkward because when we are scrolling we are offsetting the underlying view
        // to the left (-x)
        var offsetX = dx - (this.state.currentPage * deviceWidth);
        this.state.scrollValue.setValue(-1 * offsetX / deviceWidth);
        console.log("offsetX", offsetX, " scrollpage", (-1 * offsetX / deviceWidth));
      },
    });
  },

  componentDidMount(){
    return;

    setInterval(() => {
      this.setState({
        currentPage: this.state.currentPage + 1,
      });
    }, 2000);
  },

  _getDataRangeByPage(page){
    let renderRangeStart = page > Math.floor(this.props.retainPagesCount/2)-1 ? page - Math.floor(this.props.retainPagesCount/2) : 0;
    //let renderRangeEnd = renderRangeStart + this.props.retainPagesCount-1;
    let renderRangeEnd = page + Math.floor(this.props.retainPagesCount/2);
    if (renderRangeEnd >= this.props.pages.length) {
      renderRangeEnd = this.props.pages.length-1;
    }
    return {
      renderRangeStart,
      renderRangeEnd,
    };
  },

  renderPages() {
    let currentPage = this.state.currentPage;
    let {renderRangeStart, renderRangeEnd} = this._getDataRangeByPage(currentPage);

    let pages = [];
    pages.push(<View key={"padding" + currentPage} collapsable={false} style={{width:deviceWidth * renderRangeStart}}></View>);

    /*
     
    for(let i=3;i<=currentPage;i++){
      pages.push(<View key={"padding" + i} collapsable={false} style={{width:deviceWidth}}></View>);
    }
    console.log(renderRangeStart, renderRangeEnd, currentPage, ", left:", deviceWidth * renderRangeStart);

    */
    for (let i=renderRangeStart; i<=renderRangeEnd; i++){
      pages.push(
        this.props.renderPage(i, this.props.pages[i])
      );
    }
    return pages;
  },

  goToPage(pageNumber) {
    this.props.onChangeTab && this.props.onChangeTab({
      i: pageNumber, ref: this.props.children[pageNumber]
    });

    Animated.spring(this.state.scrollValue, {toValue: pageNumber, friction: 10, tension: 50}).start();

    if (pageNumber == this.state.currentPage){
      return;
    }
    /*
    */
    InteractionManager.runAfterInteractions(()=>{
      this.setState({
        currentPage: pageNumber
      });
    });
  },

  render() {
    var sceneContainerStyle = {
      //width: deviceWidth * this.props.children.length,
      // Retain centain views for resource lazyloading and view transitions.
      width: deviceWidth * this.props.retainPagesCount,
      flex: 1,
      flexDirection: 'row'
    };

    var translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, -deviceWidth]
    });

    return (
      <View 
        //collapsable={false}
        /*
        renderToHardwareTextureAndroid={true}
        needsOffscreenAlphaCompositing={true}
        */
        style={{flex: 1}}>
        <Animated.View
        /*
        collapsable={false}
        renderToHardwareTextureAndroid={true}
        needsOffscreenAlphaCompositing={true}
        */
        style={[sceneContainerStyle, {transform: [{translateX}]}]}
          {...this._panResponder.panHandlers}>
          {/*this.props.children*/}
          {this.renderPages()}
        </Animated.View>
      </View>
    );
  }
});

module.exports = LazyPager;
