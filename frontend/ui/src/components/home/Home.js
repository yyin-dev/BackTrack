import React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import { Context } from '../../context/ContextSource'

import './Home.css'

class HomeButton extends React.Component {

  static contextType = Context;

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    // fetch() only fetches project id for PO/dev, but not SM. The project id
    // for SM would be default value (null) until explicitly chosen by the user
    // in the project page.
    if (this.context.projectId || this.context.user.role === "Scrum Master") return;

    // for new log in of dev/PO, set project id
    axios
      .get(`http://127.0.0.1:8000/product/api/projectofuser/${this.context.user.id}`)
      .then(res => {
        let projects = res.data;

        // the user is enrolled to only one project (PO/dev), and the project id hasn't been set yet
        // => set project id
        if (projects.length > 0) {
          this.context.setProjectId(projects[0].id);
        }
      });
  };

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
