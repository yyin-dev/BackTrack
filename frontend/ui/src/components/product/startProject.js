import React from "react";
import { Button, Popconfirm, message } from "antd";
import { Context } from '../../context/ContextSource'


class StartProject extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = Context;

  start = () => {
    if (!this.props.hasScrumMaster) {
      message.error("Must invite a scrum master to start a project");
      return;
    } else if (this.props.developerNum < 3 || this.props.developerNum > 9) {
      message.error("Developer number should between 3 - 9");
      return;
    } else {
      // start a project
      this.props.setStartProject()
    }
  }

  render() {
    const disableButton = this.context.user.role !== "Product Owner"
    return (
      <Popconfirm
        title="Start project?"
        onConfirm={this.start}
        okText="Yes"
        cancelText="No"
        disabled={this.props.disabled}
        key="start-project"
      >
        <Button type="primary" disabled={disableButton}>
          Start Project
        </Button>
      </Popconfirm>
    );
  }
}

export default StartProject;
