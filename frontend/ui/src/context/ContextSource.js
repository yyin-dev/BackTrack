import React from 'react';

export const Context = React.createContext()

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      projectId: null,
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
    // console.log("in setUser");
    // console.log("user", user);
    this.setState({ user: user })
    // console.log("this.state.user", this.state.user);
  }

  // set the project id for the current productBacklog page view
  setProjectId = (projectId) => {
    // console.log("in setProjectId");
    // console.log("projectId", projectId);
    this.setState({ projectId: projectId })
    // console.log("this.state.projectId", this.state.projectId);

  }


  render() {
    return (<Context.Provider value={{
      user: this.state.user,
      projectId: this.state.projectId,
      setUser: this.setUser,
      setProjectId: this.setProjectId,
      authModalVisibility: this.state.authModalVisibility,
      showAuthModal: this.showAuthModal,
      closeAuthModal: this.closeAuthModal,
    }}>
      {this.props.children}
    </Context.Provider>)
  }
}
