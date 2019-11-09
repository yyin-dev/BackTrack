import React from 'react';
import axios from 'axios';

import { Modal, Form, Input, Button, InputNumber, message } from 'antd';

class AddTask extends React.Component {
    constructor(props) {
        super(props)
        this.pbi = this.props.id
        this.state = { 
            visible: false,
            taskName: "",
            description: "",
            estimatedTime: 0,
            pic: ""
        };
        this.disableAdd = this.props.disableAdd
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
        this.setState({
            visible: true,
        });
    } 

    handleOk = e => {
        axios.post("http://127.0.0.1:8000/sprint/api/create/", {
            pbi: this.pbi,
            name: this.state.taskName,
            status: "To Do",
            description: this.state.description,
            estimated_time: this.state.estimatedTime,
            pic: this.state.pic
        })
        .then(res => {
            message.success("New Task Created!", 3)
            this.setState({
                visible: false,
                taskName: "",
                description: "",
                estimatedTime: 0,
                pic: ""
            });
            this.props.refresh()
        })
        .catch(err => {
            alert("Wrong")
            console.log(err)
        })
    }

    handleCancel = e => {
        this.setState({
            visible: false
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
            <Button icon="plus" onClick={this.viewDetail} disabled={this.disableAdd} />
            <Modal
                title="View Task"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="Task Name">
                        <Input value={this.state.taskName} onChange={this.handleTaskName} placeholder="Enter Task Name" allowClear />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea value={this.state.description} rows={4} onChange={this.handleDescription} placeholder="Enter Description" allowClear/>
                    </Form.Item>
                    <Form.Item label="Estimated Time">
                        <InputNumber value={this.state.estimatedTime} onChange={this.handleEstimatedTime} defaultValue={0} />
                    </Form.Item>
                    <Form.Item label="Person In Charge">
                        <Input value={this.state.pic} onChange={this.handlePic} placeholder="Enter Person In Charge" allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
            </div>
        )
    }
}

export default AddTask;