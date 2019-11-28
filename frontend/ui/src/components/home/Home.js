import React from 'react';
import axios from "axios";
import { Button } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import { Context } from '../../context/ContextSource'

import './Home.css'

const HomeButton = (props) => {




  return (
    <div className="homepage-button-wrapper">
      <Link to={props.to}>
        {/* <Button onClick={() => props.setProjectIdForScrumMaster(props.projectId)} icon={props.icon} className="homepage-button">{props.title}</Button> */}
        <Button icon={props.icon} className="homepage-button">{props.title}</Button>
      </Link>
    </div>
  )
}

class Home extends React.Component {

  static contextType = Context;

  constructor(props, context) {
    super(props, context);
  }

  setProjectIdForScrumMaster (projectId) {
    console.log("in setProjectIdForScrumMaster, projectId = ", projectId);
    console.log("this.context", this.context);

    // this.context.setProjectId(projectId)
  }

  render() {

      console.log("in Home.js");
      console.log("this.context", this.context);

    var scrumMasterDisplay;

    if (this.context.user){
      if (this.context.user.role === "Scrum Master"){
        scrumMasterDisplay =
          <div className="homepage-all-button-wrapper">
            {
                this.context.user.projects.map((projectId, index) => {
                    return <HomeButton to="/product" title={"Product ".concat(projectId)} projectId={projectId} setProjectIdForScrumMaster={this.setProjectIdForScrumMaster} icon="like" />
                })
            }
          </div>
      } else {scrumMasterDisplay=""}
    } else {scrumMasterDisplay=""}


    return (
      <div className="home-wrapper">
        <h2>Welcome to the project!</h2>
          <div className="homepage-all-button-wrapper">
            <HomeButton to="/product" title="Product Backlog" icon="like" />
            <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
          </div>
        {scrumMasterDisplay}
      </div>
    );
  }
}

export default withRouter(Home);
