import React from 'react';
import axios from 'axios';

import { Modal, Form, Input, message } from 'antd';
import { Context } from '../../context/ContextSource'

class CreateProjectModal extends React.Component {
  static contextType = Context

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.close()
        this.props.form.resetFields()

        axios.post("http://127.0.0.1:8000/product/api/createproject/", {
          project_name: values.name,
          project_description: values.description,
          user: this.context.user,
        })
          .then(res => {
            message.success("Project created!", 3)
            let updatedUser = this.context.user
            updatedUser.role = "Product Owner"
            console.log("in CreateProjectModal.js: handleSubmit");
            this.context.setUser(updatedUser)
            this.props.refresh();
          })
          .catch(err => {
            console.log(err)
          })

      }
    })
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

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="Create Project"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.close}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: "Enter project name!" }]
            })(
              <Input placeholder="Enter title" />
            )}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: "Enter project description!" }]
            })(
              <Input.TextArea rows={4} placeholder="Enter description" />
            )}
          </Form.Item>
        </Form>
      </Modal>)
  }
}

const WrappedCreateProjectModal = Form.create({ name: 'createproject' })(CreateProjectModal);

export default WrappedCreateProjectModal;
