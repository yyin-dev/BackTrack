import React from 'react';
import { Button } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import { Context } from '../../context/ContextSource'

import './Home.css'

class HomeButton extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render () {
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
    var scrumMasterDisplay;
    if (this.context.user){
      if (this.context.user.role === "Scrum Master"){
        scrumMasterDisplay =
          <div className="homepage-all-button-wrapper">
            {
                this.context.user.projects.map((projectId, index) => {
                  return (
                    <div className="homepage-button-wrapper">
                       <Link to="/product">
                         <Button onClick={() => this.context.setProjectId(projectId)} icon="like" className="homepage-button">
                           {"Project ".concat(projectId)}
                         </Button>
                       </Link>
                     </div>
                  );
                })
            }
          </div>
      } else {scrumMasterDisplay=""}
    } else {scrumMasterDisplay=""}


    return (
      <div className="home-wrapper">
        <h2>Welcome to the project!</h2>
        {
          this.context.user
          ? this.context.user.role !== "Scrum Master"
            ? <div className="homepage-all-button-wrapper">
                <HomeButton to="/product" title="Product Backlog" icon="like" />
                <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
              </div>
            : ""
          : ""
        }
        {scrumMasterDisplay}
      </div>
    );
  }
}

export default withRouter(Home);
