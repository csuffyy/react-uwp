import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Icon from "../Icon";
import Swipe from "../Swipe";

export interface DataProps {
  /**
   * default init Show item `children[initialFocusIndex]`.
   */
  initialFocusIndex?: number;
  /**
   * Control FlipView can Swipe or not.
   */
  stopSwipe?: boolean;
  /**
   * Control FlipView auto swipe.
   */
  autoSwipe?: boolean;
  /**
   * FlipView auto swipe speed.
   */
  speed?: number;
  /**
   * FlipView is phone mod swipe to next easier `0 < easy < 1`.
   */
  easy?: number;
  /**
   * FlipView layout.
   */
  direction?: "vertical" | "horizontal";
  /**
   * Control show FlipView navigation.
   */
  showNavigation?: boolean;
  /**
   * if `true`, remove `MouseEvent` control show navigation.
   */
  controlledNavigation?: boolean;
  /**
   * Control show FlipView control.
   */
  showControl?: boolean;
  /**
   * FlipView can drag in PC mode (in the experiment).
   */
  supportPcDrag?: boolean;
  /**
   * navigation `iconSize`.
   */
  navigationIconSize?: number;
}
export interface FlipViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FlipViewState {
  focusSwipeIndex?: number;
  currCanAutoSwipe?: boolean;
  currShowNavigation?: boolean;
}

export class FlipView extends React.Component<FlipViewProps, FlipViewState> {
  static defaultProps: FlipViewProps = {
    direction: "horizontal",
    autoSwipe: true,
    navigationIconSize: 24,
    showNavigation: true,
    controlledNavigation: true,
    showControl: true,
    supportPcDrag: false,
    stopSwipe: false
  };
  static contextTypes = { theme: PropTypes.object };
  state: FlipViewState = {
    focusSwipeIndex: 0,
    currCanAutoSwipe: this.props.autoSwipe,
    currShowNavigation: this.props.showNavigation
  };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLDivElement;
  swipe: Swipe;

  swipeForward = () => {
    this.swipe.swipeForward();
  }

  swipeBackWord = () => {
    this.swipe.swipeBackWord();
  }

  shouldComponentUpdate(nextProps: FlipViewProps, nextState: FlipViewState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  handleChangeSwipe = (focusSwipeIndex: number) => {
    const count = React.Children.count(this.props.children);
    this.setState({ focusSwipeIndex: focusSwipeIndex % count });
  }

  toggleCanAutoSwipe = (currCanAutoSwipe?: any) => {
    if (typeof currCanAutoSwipe === "boolean") {
      if (currCanAutoSwipe !== this.state.currCanAutoSwipe) {
        this.setState({ currCanAutoSwipe });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        currCanAutoSwipe: !prevState.currCanAutoSwipe
      }));
    }
  }
  handleSwipeToIndex = (index: number) => {
    this.setState({ focusSwipeIndex: index });
    this.swipe.swipeToIndex(index);
  }

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.currShowNavigation) {
      this.setState({
        currShowNavigation: true
      });
    }
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.currShowNavigation) {
      this.setState({
        currShowNavigation: false
      });
    }
  }

  render() {
    const {
      children,
      showNavigation,
      initialFocusIndex,
      stopSwipe,
      autoSwipe,
      speed,
      easy,
      direction,
      navigationIconSize,
      supportPcDrag,
      showControl,
      controlledNavigation,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { focusSwipeIndex, currCanAutoSwipe, currShowNavigation } = this.state;
    const count = React.Children.count(children);
    const isHorizontal = direction === "horizontal";
    const _showNavigation = controlledNavigation ? showNavigation : currShowNavigation;

    const styles = getStyles(this);
    return (
      <div
        ref={element => this.rootElm = element}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {count > 1 && _showNavigation && (
          <IconButton
            onClick={this.swipeBackWord}
            style={styles.iconLeft}
            hoverStyle={{
              background: theme.baseLow
            }}
            activeStyle={{
              background: theme.accent,
              color: "#fff"
            }}
          >
            {isHorizontal ? "ChevronLeft3Legacy" : "ScrollChevronUpLegacy"}
          </IconButton>
        )}
        <Swipe
          ref={swipe => this.swipe = swipe}
          onChangeSwipe={this.handleChangeSwipe}
          {...{
            children,
            initialFocusIndex,
            stopSwipe,
            autoSwipe: currCanAutoSwipe,
            speed,
            easy,
            direction,
            navigationIconSize,
            supportPcDrag,
            ...attributes
          }}
          style={attributes.style}
        />
        {count > 1 && _showNavigation && (
          <IconButton
            onClick={this.swipeForward}
            style={styles.iconRight}
            hoverStyle={{
              background: theme.baseLow
            }}
            activeStyle={{
              background: theme.accent,
              color: "#fff"
            }}
          >
            {isHorizontal ? "ChevronRight3Legacy" : "ScrollChevronDownLegacy"}
          </IconButton>
        )}
        {count > 1 && showControl && (
          <div style={styles.control}>
            <div style={styles.controlContent}>
              {Array(count).fill(0).map((numb, index) => (
                <Icon
                  style={styles.icon}
                  onClick={() => {
                    this.handleSwipeToIndex(index);
                  }}
                  key={`${index}`}
                >
                  {focusSwipeIndex === index ? "FullCircleMask" : "CircleRing"}
                </Icon>
              ))}
            <IconButton
              style={{ marginLeft: 2 }}
              size={32}
              onClick={this.toggleCanAutoSwipe}
            >
              {currCanAutoSwipe ? "Pause" : "Play"}
            </IconButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function getStyles(flipView: FlipView): {
  root?: React.CSSProperties;
  iconLeft?: React.CSSProperties;
  iconRight?: React.CSSProperties;
  control?: React.CSSProperties;
  controlContent?: React.CSSProperties;
  icon?: React.CSSProperties;
} {
  const { navigationIconSize, direction } = flipView.props;
  const { theme } = flipView.context;
  const { prepareStyles } = theme;
  const isHorizontal = direction === "horizontal";

  const baseIconStyle: React.CSSProperties = {
    position: "absolute",
    background: theme.listLow,
    zIndex: 20,
    fontSize: navigationIconSize / 2,
    width: navigationIconSize * (isHorizontal ? 1 : 2),
    height: navigationIconSize * (isHorizontal ? 2 : 1)
  };

  return {
    root: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 0,
      width: "100%",
      background: theme.chromeLow,
      height: "auto",
      minHeight: baseIconStyle.height
    }),
    iconLeft: {
      ...baseIconStyle,
      top: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      left: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    iconRight: {
      ...baseIconStyle,
      bottom: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      right: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    control: {
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      pointerEvents: "none",
      ...(isHorizontal ? {
        flexDirection: "row",
        width: "100%",
        bottom: 4,
        left: 0
      } : {
        flexDirection: "column",
        height: "100%",
        top: 0,
        right: 4
      })
    },
    controlContent: prepareStyles({
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      alignItems: "center",
      pointerEvents: "all"
    }),
    icon: {
      fontSize: 6,
      margin: 2,
      cursor: "pointer"
    }
  };
}

export default FlipView;