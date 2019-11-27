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
        <Button icon={props.icon} className="homepage-button">{props.title}</Button>
      </Link>
    </div>
  )
}

class Home extends React.Component {


  static contextType = Context;

  componentDidMount () {
    // console.log("this.context.user.role", this.context.user.role);
  }

  fetch = () => {
    if (this.context.user.role === "Scrum Master") {
      axios
        .get(
          `http://127.0.0.1:8000/product/api/projectofuser/${this.context.user.id}`
        )
        .then(res => {
          let projects = res.data;
          if (projects.length === 0) {
            // Not in project
            alert("You have no projects right now")
            return;
          } else {
            this.setState({
              project: projects[0]
            });
          }
        });
    }
  };

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
                    return <HomeButton title={"Product ".concat(projectId)} icon="like" />
                })
            }
          </div>
      } else {scrumMasterDisplay=""}
    } else {scrumMasterDisplay=""}


    var othersDisplay =
      <div className="homepage-all-button-wrapper">
        <HomeButton to="/product" title="Product Backlog" icon="like" />
        <HomeButton to="/sprint" title="Sprint Backlog" icon="shop" />
      </div>

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
