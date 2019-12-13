import React from "react";
import axios from "axios";
import "./sprintBacklog.css";

import {
  Modal,
  Card,
  Button,
  message,
  Form,
  Icon,
  Input,
  InputNumber
} from "antd";

import { Context } from "../../context/ContextSource";

class EditTask extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.task = this.props.task;
    this.state = {
      visible: false,
      taskName: this.task.name,
      description: this.task.description,
      estimatedTime: this.task.estimated_time,
      pic: null
    };
  }

  handleTaskName = e => {
    this.setState({ taskName: e.target.value });
  };

  handleDescription = e => {
    this.setState({ description: e.target.value });
  };

  handleEstimatedTime = v => {
    this.setState({ estimatedTime: v });
  };

  handlePic = e => {
    this.setState({ pic: e.target.value });
  };

  viewDetail = e => {
    this.setState({
      visible: true
    });
  };

  handleDelete = e => {
    axios
      .delete(`http://127.0.0.1:8000/sprint/api/${this.task.id}/delete/`)
      .then(res => {
        message.success("Task Deleted!", 3);
        this.props.refresh();
      })
      .catch(err => {
        alert("Wrong");
        console.log(err);
      });
  };

  handleOk = e => {
    // if the user is scrum master, return
    if (this.context.user.role === "Scrum Master") {
      this.setState({
        visible: false
      });
      return;
    }

    // check input length of title and description
    if (this.state.taskName.length > 70) {
      message.error("task title should be no more than 70 characters.");
      return;
    }

    if (this.state.description.length > 500) {
      message.error("task description should be no more than 500 characters.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/sprint/api/edit/", {
        id: this.task.id,
        name: this.state.taskName,
        description: this.state.description,
        estimated_time: this.state.estimatedTime,
      })
      .then(res => {
        message.success("Task Edited!", 3);
        this.setState({
          visible: false
        });
        this.props.refresh();
      })
      .catch(err => {
        alert("Wrong");
        console.log(err);
      });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      taskName: this.task.name,
      description: this.task.description,
      estimatedTime: this.task.estimated_time,
      pic: this.task.pic
    });
  };

  changeStatus = e => {
    axios
      .post("http://127.0.0.1:8000/sprint/api/edit/", {
        id: this.task.id,
        status: "In Progress",
        pic: this.context.user.id
      })
      .then(res => {
        message.success("Task Started! You've claimed the task!", 3);
        this.setState({
          visible: false
        });
        this.props.refresh();
      })
      .catch(err => {
        alert("Wrong");
        console.log(err);
      });
  };

  render() {
    const actionIcons =
      this.context.user.role === "Scrum Master" || this.props.disabled
        ? [<Icon type="eye" key="eye" onClick={this.viewDetail} />]
        : [
            <Icon type="edit" key="edit" onClick={this.viewDetail} />,
            <Icon
              type="caret-right"
              key="caret-right"
              onClick={this.changeStatus}
            />
          ];

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

    // if the user is scrum master, he is not allowed to edit the task
    // copied from "view task"
    const editModal =
      this.context.user.role !== "Scrum Master" ? (
        <Modal
          title="View Task"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="delete" onClick={this.handleDelete}>
              Delete
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Submit
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Task Name">
              <Input
                value={this.state.taskName}
                onChange={this.handleTaskName}
                allowClear
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={this.state.description}
                rows={4}
                onChange={this.handleDescription}
                allowClear
              />
            </Form.Item>
            <Form.Item label="Estimated Time">
              <InputNumber
                value={this.state.estimatedTime}
                onChange={this.handleEstimatedTime}
                defaultValue={0}
                min={0} 
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Modal
          title="View Task"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Task Name: {this.task.name}</p>
          <p>Description: {this.task.description}</p>
          <p>Status: {this.task.status}</p>
          <p>Estimated Time: {this.task.estimated_time}</p>
          <p>Person In Charge: {this.task.pic}</p>
        </Modal>
      );

    return (
      <div className="card-outsider">
        <Card
          className="card"
          bodyStyle={{ padding: "5px" }}
          actions={actionIcons}
        >
          {this.task.name}
        </Card>
        {editModal}
      </div>
    );
  }
}

export default EditTask;
