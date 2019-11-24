import React from 'react'
import { message, Modal, Tabs } from 'antd';
import LoginTab from './LoginTab'
import SignupTab from './SignupTab'

import { UserContext } from '../../context/ContextSource'

import './AuthModal.css'

const { TabPane } = Tabs

class AuthModal extends React.Component {
  static contextType = UserContext

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "login",
    }
  }

  render() {
    console.log(this.context)
    return (
      <Modal
        className="auth-modal"
        visible={this.context.authModalVisibility}
        onCancel={this.context.closeAuthModal}
        footer={null}
      >
        <Tabs
          defaultActiveKey="login"
          onChange={t => this.setState({ activeTab: t })}
          activeKey={this.state.activeTab}
          size="default"
        >
          <TabPane tab="Log in" key="login">
            <LoginTab />
          </TabPane>
          <TabPane tab="Sign up" key="signup">
            <SignupTab />
          </TabPane>
        </Tabs>
      </Modal>
    )
  }
}

export default AuthModal