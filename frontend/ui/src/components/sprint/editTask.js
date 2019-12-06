import React from 'react';
import axios from 'axios';
import { Context } from '../../context/ContextSource'

import { Modal, Tag, Button, message, Form, Input, InputNumber, Tooltip } from 'antd';

class EditTask extends React.Component {

  static contextType = Context

  constructor(props) {
    super(props)
    this.task = this.props.task
    this.state = {
      visible: false,
      taskName: this.task.name,
      description: this.task.description,
      estimatedTime: this.task.estimated_time,
      pic: this.task.pic
    };
  }

  handleTaskName = (e) => {
    this.setState({ taskName: e.target.value })
  }

  handleDescription = (e) => {
    this.setState({ description: e.target.value })
  }

  handleEstimatedTime = (v) => {
    this.setState({ estimatedTime: v })
  }

  handlePic = (e) => {
    this.setState({ pic: e.target.value })
  }

  viewDetail = e => {
    console.log(e);
    this.setState({
      visible: true,
    });
  }

  handleDelete = e => {
    axios.delete(`http://127.0.0.1:8000/sprint/api/${this.task.id}/delete/`)
      .then(res => {
        message.success("Task Deleted!", 3)
        this.props.refresh()
      })
      .catch(err => {
        alert("Wrong")
        console.log(err)
      })
  }

  handleOk = e => {
    // check input length of title and description
    if (this.state.taskName.length > 70) {
      message.error("task title should be no more than 70 characters.")
      return;
    }
  
    if (this.state.description.length > 500) {
      message.error("task description should be no more than 500 characters.")
      return;
    }
      
    axios.post("http://127.0.0.1:8000/sprint/api/edit/", {
      id: this.task.id,
      name: this.state.taskName,
      status: "To Do",
      description: this.state.description,
      estimated_time: this.state.estimatedTime,
      pic: this.state.pic
    })
      .then(res => {
        message.success("Task Edited!", 3)
        this.setState({
          visible: false
        });
        this.props.refresh()
      })
      .catch(err => {
        alert("Wrong")
        console.log(err)
      })
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      taskName: this.task.name,
      description: this.task.description,
      estimatedTime: this.task.estimated_time,
      pic: this.task.pic
    });
  };

  changeStatus = e => {
    axios.post("http://127.0.0.1:8000/sprint/api/edit/", {
      pbi: this.task.pbi,
      id: this.task.id,
      name: this.task.name,
      status: "In Progress",
      description: this.task.description,
      estimated_time: this.task.estimated_time,
      pic: this.context.user.username
    })
      .then(res => {
        message.success("Task Started! You've claimed the task!", 3)
        this.setState({
          visible: false
        });
        this.props.refresh()
      })
      .catch(err => {
        alert("Wrong")
        console.log(err)
      })
  };

  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <Tag color="blue" onClick={this.viewDetail} style={{ fontSize: '14px', margin: '5px' }}>
          {this.task.name}
        </Tag>
        <Tooltip title="Start Task">
          <Button
            disabled={this.context.user.role === "Scrum Master" || this.props.disabled}
            icon="caret-right"
            onClick={this.changeStatus}
          />
        </Tooltip>
        <Modal
          title="View Task"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="delete" onClick={this.handleDelete}>Delete</Button>,
            <Button key="cancel" onClick={this.handleCancel}>Cancel</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>,
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Task Name">
              <Input value={this.state.taskName} onChange={this.handleTaskName} allowClear />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea value={this.state.description} rows={4} onChange={this.handleDescription} allowClear />
            </Form.Item>
            <Form.Item label="Estimated Time">
              <InputNumber value={this.state.estimatedTime} onChange={this.handleEstimatedTime} defaultValue={0} />
            </Form.Item>

          </Form>
        </Modal>
      </div>
    )
  }
}

export default EditTask;