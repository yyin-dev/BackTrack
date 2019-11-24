import React from 'react';
import { Button } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'

import './Home.css'

const HomeButton = (props) => {
  return (
    <div className="homepage-button-wrapper">
      <Link to={props.to}>
        <Button icon={props.icon} className="homepage-button">{props.title}</Button>
      </Link>
    </div>
  )
}

class Home extends React.Component {
  render() {
    return (<div className="home-wrapper">
      <h2>Welcome to the porject!</h2>
      <div className="homepage-all-button-wrapper">
        <HomeButton to="/product" title="Product Backlog" icon="like" />
        <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
        <HomeButton to="/user" title="User Center" icon="user" />
      </div>
    </div>);
  }
}

export default withRouter(Home);
