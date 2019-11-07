import React from 'react';
import axios from 'axios';

import { Modal, Form, Input, InputNumber, message, Select } from 'antd';
const { Option } = Select;

class EditPBIForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.pbi.title,
            detail: this.props.pbi.detail,
            story_point: this.props.pbi.story_point,
            status: this.props.pbi.status,
        }
    }

    handleTitleInput = (e) => {
        this.setState({ title: e.target.value })
    }

    handleDetailInput = (e) => {
        this.setState({ detail: e.target.value })
    }

    handleStoryPointInput = (e) => {
        this.setState({ story_point: e.target.value })
    }

    handleStatusInput = (e) => {
        this.setState({ status: e.target.value })
    }

    handleSubmit = () => {
        axios.put(`http://127.0.0.1:8000/product/api/${this.props.pbi.id}/update/`, {
            title: this.state.title,
            detail: this.state.detail,
            status: this.state.status,
            sprintNo: this.props.pbi.sprint_no,
            start_date: this.props.pbi.start_date,
            story_point: this.state.story_point,
            priority: this.props.pbi.priority,
        })
            .then(res => {
                this.props.refresh();
                this.props.close();
            })
            .then(err => console.log(err))
    }

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
            <Modal
                title="Edit PBI"
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.props.close}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="Title">
                        <Input value={this.state.title} onChange={this.handleTitleInput} />
                    </Form.Item>
                    <Form.Item label="Status">
                        <Select defaultValue={this.state.status} style={{ width: 120 }}>
                            <Option value="To Do">To Do</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Done">Done</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Story Points">
                        <InputNumber value={this.state.story_point} onChange={this.handleStoryPointInput} />
                    </Form.Item>
                    <Form.Item label="Details">
                        <Input.TextArea value={this.state.detail} rows={4} onChange={this.handleDetailInput} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default EditPBIForm;