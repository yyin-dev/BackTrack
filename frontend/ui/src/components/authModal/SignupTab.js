import React from 'react'
import { message, notification, Button, Form, Input, Select } from 'antd'

const { Option } = Select;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    loading: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     this.setState({ loading: true })
    //     createUser(values.email, values.password, values.year)
    //       .then(() => {
    //         this.setState({ loading: false })
    //         this.props.form.resetFields();
    //         notification['success']({
    //           message: '注册成功',
    //           description: '验证邮件发送成功！点击邮件激活后即可登录！',
    //           duration: null,
    //         })
    //         this.props.switchToLogin()
    //       })
    //       .catch((error) => {
    //         this.props.shake()
    //         this.setState({ loading: false })
    //         message.error(error.message)
    //       })
    //   }
    // });
    console.log(this.props.form.getFieldsValue())
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Different');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { xs: { span: 8, offset: 0 }, },
      wrapperCol: { xs: { span: 16 }, },
    };

    const tailFormItemLayout = {
      wrapperCol: { xs: { span: 16, offset: 8 }, },
    };

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout}>
        <Form.Item label="Username" >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: 'Enter username!',
            }, {
              whitespace: true, message: 'Enter username!'
            }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Enter password!',
            }, {
              validator: this.validateToNextPassword,
            }, {
              whitespace: true, message: 'Enter password!'
            }],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label="Confirm password" >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Enter password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(<Input type="password" />)}
        </Form.Item>

        <Form.Item label="Role">
          {getFieldDecorator('role', { initialValue: "Developer/Product Owner" })(
            <Select >
              <Option value="Scrum Master">Scrum Master</Option>
              <Option value="Developer/Product Owner">Developer/Product Owner</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout} >
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>Sign up</Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm;