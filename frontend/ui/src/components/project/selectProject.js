import React from "react";

import { Button, Card, Radio } from "antd";
import { Context } from "../../context/ContextSource";

class SelectProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null
    };
  }

  static contextType = Context;

  handleClick = e => {
    this.context.setProjectId(
      this.state.selectedId === null
        ? this.props.projects[0].id
        : this.state.selectedId
    );
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
