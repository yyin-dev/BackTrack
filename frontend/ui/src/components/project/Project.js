import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  Empty,
  message,
  Button
} from "antd";
import CreateProjectModal from './createProjectModal'
import { Context } from "../../context/ContextSource";

class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      project: null,
      isCreatingProject: false,
    };
  }

  static contextType = Context

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    let { user } = this.context

    axios.get(`http://127.0.0.1:8000/product/api/projectofuser/${user.id}`)
      .then(res => {
        let projects = res.data;
        console.log(res)
        if (projects.length === 0) { // Not in project
          this.setState({ project: null });
          return;
        } else {
          this.setState({ project: projects[0] });
        }

        if (user.role === "Developer/Product Owner" && projects.length > 1) {
          message.error("Developer/Product Owner in multiple project!!!");
        }
      });
  }

  toggleCreatingProject = () => {
    this.setState({
      isCreatingProject: !this.state.isCreatingProject
    });
  };

  render() {
    if (!this.state.project) { // no project for the current user
      return (
        <div style={{ margin: "auto" }}>
          <Empty
            description={
              <span>
                You are not in any project. Wait for an invitation
                {this.context.user.role === "Scurm Master" ? "" : " or create one!"}
              </span>
            }
          >
            {
              this.context.user.role !== "Scrum Master"
                ? <Button type="primary" onClick={this.toggleCreatingProject}>
                  Create Project
                </Button>
                : ""
            }
          </Empty>
          <CreateProjectModal
            visible={this.state.isCreatingProject}
            close={this.toggleCreatingProject}
            refresh={this.fetch}
          />
        </div>
      );
    } else {
      return <span>You are in project {this.state.project.id}</span>
    }
  }
}

export default Project