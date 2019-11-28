import React from "react";
import { Button, Popconfirm, message } from "antd";
import { Context } from '../../context/ContextSource'


class EndProject extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = Context;

  End = () => {
    if (this.context.user.role === "Product Owner"){
        let updatedUser = this.context.user;
        updatedUser.role = 'Developer';
        this.context.setUser (updatedUser);
    }
    this.props.setEndProject()
  }

  render() {
    const disableButton = this.context.user.role !== "Product Owner"
    return (
      <Popconfirm
        title="End project?"
        onConfirm={this.End}
        okText="Yes"
        cancelText="No"
        disabled={this.props.disabled}
        key="start-project"
      >
        <Button type="danger" disabled={disableButton}>
          End Project
        </Button>
      </Popconfirm>
    );
  }
}

export default EndProject;
