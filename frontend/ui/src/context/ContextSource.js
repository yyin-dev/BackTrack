import React from 'react';

export const Context = React.createContext()

export class ContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
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

  render() {
    return (<Context.Provider value={{
      user: this.state.user,
      setUser: this.setUser,

      authModalVisibility: this.state.authModalVisibility,
      showAuthModal: this.showAuthModal,
      closeAuthModal: this.closeAuthModal,
    }}>
      {this.props.children}
    </Context.Provider>)
  }
}