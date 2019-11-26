import React from 'react'
import { message, Modal, Tabs } from 'antd';
import LoginTab from './LoginTab'
import SignupTab from './SignupTab'

import { Context } from '../../context/ContextSource'

import './AuthModal.css'

const { TabPane } = Tabs

class AuthModal extends React.Component {
  static contextType = Context

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "login",
    }
  }

  switchToLogin = () => {
    this.setState({ activeTab: "login" })
  }

  render() {
    return (
      <Modal
        className="auth-modal"
        visible={this.context.authModalVisibility}
        footer={null}
        onCancel={e => {
          this.context.user === null ?
            message.warning("You have to log in to use BackTrack!", 3) :
            this.context.closeAuthModal()
        }}
      >
        <Tabs
          defaultActiveKey="login"
          onChange={t => this.setState({ activeTab: t })}
          activeKey={this.state.activeTab}
          size="default"
        >
          <TabPane tab="Log in" key="login">
            <LoginTab isLoggedIn={this.props.isLoggedIn} setLoggedIn = {this.props.setLoggedIn} />
          </TabPane>
          <TabPane tab="Sign up" key="signup">
            <SignupTab switchToLogin={this.switchToLogin} />
          </TabPane>
        </Tabs>
      </Modal>
    )
  }
}

export default AuthModal