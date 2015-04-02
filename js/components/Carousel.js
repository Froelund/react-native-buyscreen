'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  View
} = React;


var PAGE_CHANGE_DELAY = 4000;

/**
 * Animates pages in loop
*/
var Carousel = React.createClass({
    propTypes:{
        children: React.PropTypes.node.isRequired,
        delay: React.PropTypes.number
    },
    mixins: [TimerMixin],
    getDefaultProps: function() {
      return {delay: PAGE_CHANGE_DELAY};
    },
    getInitialState: function(){
      return {currentPage: 0};
    },
    componentDidMount:function(){
      this._setUpTimer();
    },
    _onScroll: function(event) {
      clearTimeout(this.timer);
    },
    _onScrollEnd: function(event) {
      this._setUpTimer();
      this._calculateCurrentPage(event.nativeEvent.contentOffset.x);
    },
    _setUpTimer: function() {
      clearTimeout(this.timer);
      this.timer = this.setTimeout(this._animateNextPage, this.props.delay);
    },
    _animateNextPage: function() {
      var k = this.state.currentPage;
      if (++k > this.props.children.length - 1) {
          k = 0;
      }
      this.setState({currentPage: k});
      this.refs.scrollView.scrollTo(0, k*width);
      this._setUpTimer();
    },
    _calculateCurrentPage: function(offset) {
      var page = Math.floor((offset - width/2) / width) + 1;
      this.setState({currentPage: page});
    },
    //TODO: add `dots` for displaying current page (like pageControl)
    render: function(){
        return <ScrollView
          ref='scrollView'
          onScroll={this._onScroll}
          scrollEventThrottle={100}
          onMomentumScrollEnd={this._onScrollEnd}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          bounces={false}
          contentContainerStyle={[styles.horizontalScroll, {width:width*this.props.children.length}]}
        >
          {this.props.children}
        </ScrollView>
    }
});

var styles = StyleSheet.create({
  horizontalScroll: {
    height: height,
    position:'absolute'
  }
});

module.exports = Carousel;