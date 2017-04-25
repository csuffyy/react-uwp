import * as React from "react";

import ThemeType from "../../styles/ThemeType";

const defaultProps: SeparatorProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
  direction?: "row" | "column";
}

export interface SeparatorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SeparatorState {}

export default class Separator extends React.Component<SeparatorProps, SeparatorState> {
  static defaultProps: SeparatorProps = {
    ...defaultProps
  };

  state: SeparatorState = {};

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      />
    );
  }
}

function getStyles(separator: Separator): {
  root?: React.CSSProperties;
} {
  const { context, props: { direction, style } } = separator;
  const { theme } = context;
  const { prepareStyles } = theme;
  const isColumn = direction === "column";

  return {
    root: prepareStyles({
      width: isColumn ? 1 : "100%",
      height: isColumn ? "100%" : 1,
      background: theme.baseLow,
      ...style,
    }),
  };
}
