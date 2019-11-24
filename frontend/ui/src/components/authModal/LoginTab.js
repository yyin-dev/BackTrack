import React from 'react'
import { message, Button, Form, Icon, Input } from 'antd';
import axios from 'axios';

import { Context } from '../../context/ContextSource'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  static contextType = Context

  handleSubmit = (e) => {
    e.preventDefault();
    let values = this.props.form.getFieldsValue()
    axios.post(`http://127.0.0.1:8000/user/api/login/`, {
      username: values.username,
      password: values.password
    })
      .then(res => {
        if (res.status === 202) {
          message.success("Welcome!")
          this.context.setUser(res.data)
          this.context.closeAuthModal()
        } else if (res.status === 401) {
          message.error("Username/Password incorrect!")
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      wrapperCol: { xs: { span: 16, offset: 4 }, },
    };

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Enter username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Enter password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm;