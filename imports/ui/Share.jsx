import React, { Component, PropTypes } from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ReactGridLayout = require('react-grid-layout');
// Paint component - represents a single todo item
export default class Share extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: [],
      currentBreakpoint: 'lg',
      mounted: false,
      layouts: {lg: this.props.initialLayout},
    };

  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
            : <span className="text">{i}</span>
          }
        </div>);
    });
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange(layout, layouts) {
    //this.props.onLayoutChange(layout, layouts);
    this.setState({layout: layout});
  }

  onNewLayout() {
    this.setState({
      layouts: {lg: generateLayout()}
    });
  }

  render() {
    return (
      <div>
        <div>Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <button onClick={this.onNewLayout.bind(this)}>Generate New Layout</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange.bind(this)}
          onLayoutChange={this.onLayoutChange.bind(this)}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}>
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

Share.defaultProps = {
  className: "layout",
  rowHeight: 30,
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  initialLayout: generateLayout()
};

function generateLayout() {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      //static: Math.random() < 0.05
      static: true
    };
  });
}

