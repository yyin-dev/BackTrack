import React from 'react';
import axios from 'axios';

import { Modal, Tag, Button, message, Form, Input, InputNumber } from 'antd';

class EditTask extends React.Component {
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
        console.log(e);
        this.setState({
          visible: false,
        });
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
            <Tag color="blue" onClick={this.viewDetail} style={{fontSize: '18px', margin: '5px'}}>
                {this.task.name}
            </Tag>
            <Modal
                title="View Task"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleDelete}>
                        Delete
                    </Button>,
                    <Button key="back" onClick={this.handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        Submit
                    </Button>,
                  ]}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="Task Name">
                        <Input value={this.state.taskName} onChange={this.handleTaskName} allowClear />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea value={this.state.description} rows={4} onChange={this.handleDescription} allowClear/>
                    </Form.Item>
                    <Form.Item label="Estimated Time">
                        <InputNumber value={this.state.estimatedTime} onChange={this.handleEstimatedTime} defaultValue={0} />
                    </Form.Item>
                    <Form.Item label="Person In Charge">
                        <Input value={this.state.pic} onChange={this.handlePic} allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
            </div>
        )
    }
}

export default EditTask;