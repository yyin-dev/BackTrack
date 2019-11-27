import React from 'react';
import { Button, Popconfirm } from 'antd';
import { Context } from "../../context/ContextSource";

class StartSprint extends React.Component {
  static contextType = Context;

  render() {
    return (
      <Popconfirm
        title="Start sprint?"
        onConfirm={this.props.onConfirm}
        okText="Yes"
        cancelText="No"
        disabled={this.props.disabled}
        key="start-sprint"
      >
        <Button disabled={this.props.disabled || this.context.user.role !== "Product Owner"}>
          Start Sprint
            </Button>
      </Popconfirm>)
  }
}

export default StartSprint;
