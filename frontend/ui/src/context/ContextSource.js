import React from 'react';

export const UserContext = React.createContext()

export class UserContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: "pending",
      authModalVisibility: true,
    }
  }

  setAuthModalVisibility = (v) => {
    this.setState({
      authModalVisibility: v
    })
  }

  showAuthModal = () => { this.setAuthModalVisibility(true) }
  closeAuthModal = () => { this.setAuthModalVisibility(false) }

  render() {
    return (<UserContext.Provider value={{
      user: this.state.user,
      authModalVisibility: this.state.authModalVisibility,
      showAuthModal: this.showAuthModal,
      closeAuthModal: this.closeAuthModal,
    }}>
      {this.props.children}
    </UserContext.Provider>)
  }
}