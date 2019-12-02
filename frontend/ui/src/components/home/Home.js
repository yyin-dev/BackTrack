import React from 'react';
import { Button } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import { Context } from '../../context/ContextSource'

import './Home.css'

class HomeButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="homepage-button-wrapper">
        <Link to={this.props.to}>
          <Button icon={this.props.icon} className="homepage-button">{this.props.title}</Button>
        </Link>
      </div>
    );
  }

}

class Home extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  static contextType = Context;

  render() {
    return (
      <div className="home-wrapper">
        <h2>Welcome to the project!</h2>
        {
          this.context.user
              ? <div className="homepage-all-button-wrapper">
                <HomeButton to="/project" title="Project" icon="project" />
                <HomeButton to="/product" title="Product Backlog" icon="like" />
                <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
              </div>
              : ""
        }
      </div>
    );
  }
}

export default withRouter(Home);
