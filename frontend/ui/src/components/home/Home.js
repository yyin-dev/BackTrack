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

    /*
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
    */

    return (
      <div className="home-wrapper">
        <h1>Welcome to the project!</h1>
        { this.context.user !== null
          ? <span>
              <h3>Name: {this.context.user.username}</h3>
              <h3>Role: {this.context.user.role}</h3>
              <div className="homepage-all-button-wrapper">
                <HomeButton to="/product" title="Product Backlog" icon="hdd" />
                <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
                <HomeButton to="/project" title="Project" icon="project" />
              </div>
            </span>
          : ""
        }

        {
          // this.context.user
          // ? this.context.user.role !== "Scrum Master"
          //   ? <div className="homepage-all-button-wrapper">
          //       <HomeButton to="/product" title="Product Backlog" icon="like" />
          //       <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
          //     </div>
          //   : ""
          // : ""
        }
        {/*scrumMasterDisplay*/}
      </div>
    );
  }
}

export default withRouter(Home);
