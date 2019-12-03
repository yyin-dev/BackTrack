import React from "react";
import axios from "axios";

import { Button, Popconfirm, Tooltip, message } from "antd";
import { Context } from "../../context/ContextSource";

class CancelMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      user_id: this.props.user_id,
      user_role: this.props.user_role,
      project_id: this.props.project_id
    };
  }
  static contextType = Context;

  handleOk = () => {
    if (
      this.state.user_id === this.context.user.id &&
      this.context.user.role === "Product Owner"
    ) { // PO remove themselves
      message.error("Product Owner should not delete themselves.");
      return;
    } else if (
      this.state.user_id !== this.context.user.id &&
      this.context.user.role !== "Product Owner"
    ) {
      message.error("Developer can not delete other members.");
      return;
    } else if (this.state.user_id !== this.context.user.id) {
      // PO remove other members
      axios
        .post(`http://127.0.0.1:8000/product/api/cancelmember/`, {
          user_id: this.state.user_id,
          project_id: this.state.project_id
        })
        .then(res => {
          let updatedUser = this.context.user;
          updatedUser.role = "Product Owner";
          this.context.setUser(updatedUser);
          this.props.refresh_invitemembers();
        })
        .then(err => console.log(err));
    } else {
      // developer and scrum master reject invitation
      axios
        .post(`http://127.0.0.1:8000/product/api/cancelmember/`, {
          user_id: this.state.user_id,
          project_id: this.state.project_id
        })
        .then(res => {
          let updatedUser = this.context.user;
          updatedUser.role = "Product Owner";
          this.context.setUser(updatedUser);
          this.context.setProjectId(null);
          this.props.refresh();
        })
        .then(err => console.log(err));
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const disableButton =
      this.props.project_started === true
        ? true
        : this.context.user.role === "Product Owner"
            ? this.props.user_role === "Product Owner" // Product Owner cannot remove himself
            : this.props.user_id !== this.context.user.id; // Developer/Scrum Master cannot remove anyone but himself

    const popMessage =
      this.context.user.role === "Product Owner"
        ? "Sure to remove this member?"
        : "Reject the invitation?";

    return (
      <div>
        <Tooltip>
          <Popconfirm
            title={popMessage}
            disabled={disableButton}
            onConfirm={() => this.handleOk()}
          >
            <Button icon="delete" disabled={disableButton} />
          </Popconfirm>
        </Tooltip>
      </div>
    );
  }
}

export default CancelMember;
