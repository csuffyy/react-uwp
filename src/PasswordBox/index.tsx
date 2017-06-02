import * as React from "react";
import * as PropTypes from "prop-types";

import Input from "../Input";
import Icon from "../Icon";

export interface DataProps {
  showIcon?: boolean;
  defaultShowPassword?: boolean;
  onChangeValue?: (value: string) => void;
  iconHeight?: number;
}

export interface PasswordBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface PasswordBoxState {
  showPassword?: boolean;
}

export default class PasswordBox extends React.Component<PasswordBoxProps, PasswordBoxState> {
  static defaultProps: PasswordBoxProps = {
    showIcon: true,
    defaultShowPassword: false,
    iconHeight: 32,
    onChangeValue: () => {},
    placeholder: "Please Input Password"
  };

  state: PasswordBoxState = {
    showPassword: this.props.defaultShowPassword
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  refs: { input: Input };

  componentWillReceiveProps(nextProps: PasswordBoxProps) {
    this.setState({
      showPassword: nextProps.showIcon
    });
  }

  handleOnchange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
    let event: React.SyntheticEvent<HTMLInputElement>;
    event = e;
    this.props.onChangeValue(event.currentTarget.value);
  }

  getValue = () => this.refs.input.getValue();

  setValue = (value: string) => this.refs.input.setValue(value);

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { showIcon, iconHeight, onChangeValue, defaultShowPassword, ...attributes } = this.props;
    const { showPassword } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <Input
        {...attributes}
        type={showPassword ? "text" : "password"}
        ref="input"
        style={{
          height: iconHeight,
          ...styles.container,
          ...theme.prepareStyles(attributes.style)
        }}
        hoverStyle={{
          border: `2px solid ${theme.accent}`
        }}
        rightNode={showIcon ? (
          <Icon
            onClick={() => this.setState({ showPassword: !showPassword })}
            style={{
              cursor: "pointer",
              height: iconHeight,
              width: iconHeight,
              background: "none",
              color: theme.baseHigh
            }}
            hoverStyle={{
              color: "#fff",
              background: theme.accent
            }}
          >
            &#xE052;
          </Icon>
        ) : void 0}
        onChange={this.handleOnchange}
      />
    );
  }
}

function getStyles(passwordBox: PasswordBox): {
  container?: React.CSSProperties;
} {
  const { context } = passwordBox;
  const { theme } = context;

  return {
    container: theme.prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      padding: "6px 10px",
      overflow: "hidden",
      paddingRight: 0
    })
  };
}