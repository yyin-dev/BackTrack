import React from "react";
import axios from "axios";

import { Empty, message, Button } from "antd";
import CreateProjectModal from "./createProjectModal";
import ProjectMembers from "./projectMembers";
import { Context } from "../../context/ContextSource";
import SelectProject from "./selectProject";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: null,
      isCreatingProject: false
    };
  }

  static contextType = Context;

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    let { user } = this.context;

    axios
      .get(`http://127.0.0.1:8000/product/api/projectofuser/${user.id}`)
      .then(res => {
        let projects = res.data;
        if (projects.length === 0) {
          // Not in project
          this.setState({ projects: null });
          return;
        } else {
          this.setState({ projects: projects });
          if (this.context.user.role !== "Scrum Master" && !this.context.projectId) {
            this.context.setProjectId(projects[0].id);
          }
        }

        if (user.role === "Developer/Product Owner" && projects.length > 1) {
          message.error("Developer/Product Owner in multiple project!!!");
        }
      });
  };

  toggleCreatingProject = () => {
    this.setState({
      isCreatingProject: !this.state.isCreatingProject
    });
  };

  setStartProject = () => {
    axios
      .post(`http://127.0.0.1:8000/product/api/startproject/`, {
        project_id: this.state.projects[0].id
      })
      .then(res => {
        this.fetch();
      })
      .catch(err => console.log(err));
  };

  setEndProject = () => {
    axios
      .post(`http://127.0.0.1:8000/product/api/endproject/`, {
        project_id: this.state.projects[0].id,
        user_id: this.context.user.id
      })
      .then(res => {
        this.fetch();
      })
      .catch(err => console.log(err));
  };

  render() {
    console.log(this.state.projects)

    if (!this.state.projects) {
      // no project for the current user
      return (
        <div style={{ margin: "auto" }}>
          <Empty
            description={
              <span>
                You are not in any project. Wait for an invitation
                {this.context.user.role === "Scrum Master"
                  ? "!"
                  : " or create one!"}
              </span>
            }
          >
            {this.context.user.role !== "Scrum Master" ? (
              <Button type="primary" onClick={this.toggleCreatingProject}>
                Create Project
              </Button>
            ) : (
              ""
            )}
          </Empty>
          <CreateProjectModal
            visible={this.state.isCreatingProject}
            close={this.toggleCreatingProject}
            refresh={this.fetch}
          />
        </div>
      );
    } else if (!this.context.projectId) {
      // the user is scrum master, and he hasn't choose a project yet.
      return (
        <SelectProject projects={this.state.projects} refresh={this.fetch} />
      );
    } else {
      const curProject = this.state.projects.find(project => project.id === this.context.projectId)
      return (
        <ProjectMembers
          project={curProject}
          visible="true"
          setStartProject={this.setStartProject}
          setEndProject={this.setEndProject}
          refresh={this.fetch}
        />
      );
    }
  }
}

export default Project;
