import React from 'react'
import { message, Button, Form, Icon, Input } from 'antd';

class LoginForm extends React.Component {
  state = {
    loading: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     this.setState({ loading: true })
    //     login(values.userName, values.password)
    //       // .then(() => {
    //       //   message.success("登录成功！")
    //       //   this.props.closeModal()
    //       //   this.props.redirect()
    //       // })
    //       // 这个登录会在AuthModal里被拦截下来
    //       .catch((error) => {
    //         this.props.shake()
    //         this.setState({ loading: false })
    //         message.error(error.message)
    //       })
    //   }
    // });
    console.log("login!")
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('userName', {
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
          <p className="text-button" onClick={() => console.log("register")}>Sign Up</p>
          {/* <p className="text-button login-form-forgot" onClick={() => console.log("forget")}>Forget Password</p> */}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm;