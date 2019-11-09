import React from 'react';
import { Button, Popconfirm } from 'antd';

class StartSprint extends React.Component {

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
        <Button disabled={this.props.disabled}>
          Start Sprint
            </Button>
      </Popconfirm>)
  }
}

export default StartSprint;