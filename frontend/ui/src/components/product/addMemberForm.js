import React from "react";
import axios from "axios";

import { Modal, Form, Input, Button, message } from "antd";
import { Context } from '../../context/ContextSource'

class AddMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      newMemberName: "",
    };
  }

  static contextType = Context;

  viewDetail = e => {
    this.setState({
      visible: true
    });
  };

  handleNewMember = e => {
    this.setState({ newMemberName: e.target.value });
  };

  handleSubmit = e => {

    // PO cannot invite himself
    if (this.state.newMemberName === this.context.user.username) {
      message.error("You cannot invite yourself");
      return;
    }

    const result = this.props.users.find( ({ username }) => username === this.state.newMemberName );
    if (!result) {
      message.error("No user founded");
      return;
    }

    if (result.role === "Scrum Master" && this.props.hasScrumMaster) {
      message.error("Cannot invite multiple Scrum Master for a project.");
      return;
    }
    if (result.role === "Product Owner") {
      message.error("Cannot invite Product Owner to a project.");
      return;
    }
    if (result.role !== "Scrum Master" && result.projects.length !== 0 ){
      message.error("The invited developer is occupied by another project.");
      return;
    }

    // update information for the project
    if (result.role === "Scrum Master") {
      this.props.setScrumMaster();
    } else {
      this.props.addDeveloper();
    }

    axios
      .post("http://127.0.0.1:8000/user/api/addusertoproject/", {
        new_member_name: this.state.newMemberName,
        project_id: this.props.project.id
      })
      .then(res => {
        const newMemberRole = result.role === "Scrum Master" ? "Scrum Master" : "Developer"
        const successMessage = "New team member added: " + result.username + " as your " + newMemberRole
        this.setState({
          visible: false,
          newMemberName: "",
        });
        this.props.refresh()
        message.success(successMessage, 3);
      })
      .catch(err => {
        alert("Wrong");
        console.log(err);
      });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    
    const disableButton = this.context.user.role !== "Product Owner"
    return (
      <div style={{ display: "inline" }}>
        <Button onClick={this.viewDetail} disabled={disableButton}>Add New Member</Button>
        <Modal
          title="Invite Member"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item label="New Member Name">
              <Input
                value={this.state.newMemberName}
                onChange={this.handleNewMember}
                placeholder="Enter New Member Name"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddMemberForm;
