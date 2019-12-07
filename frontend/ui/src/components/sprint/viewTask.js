import React from "react";
import axios from "axios";
import { Context } from "../../context/ContextSource";

import "./sprintBacklog.css";

import { Modal, Card, Icon, message, } from "antd";

class ViewTask extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.task = this.props.task;
    this.state = { visible: false };
  }

  viewDetail = e => {
    console.log(e);
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  changeStatus = e => {
    axios
      .post("http://127.0.0.1:8000/sprint/api/edit/", {
        pbi: this.task.pbi,
        id: this.task.id,
        name: this.task.name,
        status: "Done",
        description: this.task.description,
        estimated_time: this.task.estimated_time,
        pic: this.task.pic
      })
      .then(res => {
        message.success("Task Finished!", 3);
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
        ? [
            <Icon
              type="eye"
              key="eye"
              onClick={this.viewDetail}
            />
          ]
        : [
            <Icon
              type="eye"
              key="eye"
              onClick={this.viewDetail}
            />,

            <Icon
              type="check"
              key="check"
              onClick={this.changeStatus}
            />
          ]
    
    return (
      <div className="card-outsider">
        <Card
          className="card"
          bodyStyle={{ padding: "5px" }}
          actions={actionIcons}
        >
          {this.task.name}
        </Card>
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
      </div>
    );
  }
}

export default ViewTask;
