import React from "react";
import { Button, Popconfirm } from "antd";
import { Context } from "../../context/ContextSource";

class EndProject extends React.Component {

  static contextType = Context;

  End = () => {
    let updatedUser = this.context.user;
    updatedUser.role = "Developer";
    this.context.setUser(updatedUser);
    this.props.setEndProject();
  };

  render() {
    const disableButton = this.context.user.role !== "Product Owner";
    return (
      <Popconfirm
        title="Sure to delete the project?"
        disabled={disableButton}
        onConfirm={this.End}
        okText="Yes"
        cancelText="No"
        key="end-project"
      >
        <Button type="danger" disabled={disableButton}>
          Delete Project
        </Button>
      </Popconfirm>
    );
  }
}

export default EndProject;
