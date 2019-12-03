import React from "react";
import axios from "axios";

import { Button, Card, Radio } from "antd";
import { Context } from "../../context/ContextSource";

class SelectProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: props.projects[0].id
    };
  }

  static contextType = Context;

  handleClick = e => {
    this.context.setProjectId(this.state.selectedId);

    // get current project
    axios
      .get(
        `http://127.0.0.1:8000/product/api/projectbyid/${this.state.selectedId}`
      )
      .then(res => {
        const sprints = res.data.sprints;
        if (sprints.length === 0) this.context.setSprintNo(-1);
        else this.context.setSprintNo(sprints[sprints.length - 1].no);
      })
      .catch(error => console.log(error));

    this.props.refresh();
  };

  onChange = e => {
    this.setState({
      selectedId: e.target.value
    });
  };

  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };
    return (
      <div style={{ margin: "auto" }}>
        <Card title="Please select a project to view" style={{ width: 500 }}>
          <Radio.Group
            style={{ marginBottom: "20px" }}
            onChange={this.onChange}
            defaultValue={this.props.projects[0].id}
          >
            {this.props.projects.map(project => {
              return (
                <Radio style={radioStyle} value={project.id} key={project.id}>
                  {project.name}
                </Radio>
              );
            })}
          </Radio.Group>
          <Button
            style={{ display: "block" }}
            type="primary"
            onClick={this.handleClick}
          >
            OK
          </Button>
        </Card>
      </div>
    );
  }
}

export default SelectProject;
