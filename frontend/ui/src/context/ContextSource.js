import React from 'react';

export const Context = React.createContext()

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      projectId: null,
      sprintNo: null,
      authModalVisibility: true,
    }
  }

  // AuthModal related
  setAuthModalVisibility = (v) => {
    this.setState({
      authModalVisibility: v
    })
  }
  showAuthModal = () => { this.setAuthModalVisibility(true) }
  closeAuthModal = () => { this.setAuthModalVisibility(false) }

  // User related
  setUser = (user) => {
    this.setState({ user: user })
  }

  // set the project id for the current productBacklog page view
  setProjectId = (projectId) => {
    this.setState({ projectId: projectId })
  }

  // set the sprint number for the current productBacklog page view
  setSprintNo = (sprintNo) => {
    this.setState({ sprintNo: sprintNo })
  }


  render() {
    return (<Context.Provider value={{
      user: this.state.user,
      projectId: this.state.projectId,
      sprintNo: this.state.sprintNo,
      setUser: this.setUser,
      setProjectId: this.setProjectId,
      setSprintNo: this.setSprintNo,
      authModalVisibility: this.state.authModalVisibility,
      showAuthModal: this.showAuthModal,
      closeAuthModal: this.closeAuthModal,
    }}>
      {this.props.children}
    </Context.Provider>)
  }
}
