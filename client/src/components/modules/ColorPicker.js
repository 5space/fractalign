import React, { Component } from "react";
import { ChromePicker } from "react-color";
import reactCSS from "reactcss";

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewPicker: false,
            color: this.props.color
        }
    }

    handleOnClick = () => {
        this.setState({
            viewPicker: !this.state.viewPicker
        });
    };

    handleOnClose = () => {
        this.setState({
            viewPicker: false
        });
    };

    handleOnChange = (color) => {
        this.setState({
            color: color.rgb
        });
        setTimeout(() => {
            this.props.onColorSelect(this.state.color);
        });
    };

    render() {
        const styles = reactCSS({
            default: {
                swatch: {
                    width: "20px",
                    height: "auto",
                    background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
                    borderRadius: "7px 0px 0px 7px",
                    cursor: "pointer",
                    display: "inline-block"
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px"
                },
                popover: {
                    position: "absolute",
                    zIndex: "4"
                },
            },
        });

        return <>
            <div style={styles.swatch} onClick={this.handleOnClick} />
            {this.state.viewPicker ? (
                <div style={styles.popover}>
                    <div style={styles.cover} onClick={this.handleOnClose} />
                    <ChromePicker
                        color={this.state.color}
                        onChange={this.handleOnChange}
                    />
                </div>
            ) : null}
        </>;
    }
}

export default ColorPicker;