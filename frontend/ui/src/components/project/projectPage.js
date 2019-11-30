import React from "react";
import { Context } from "../../context/ContextSource";

class ProjectPage extends React.Component {

  constructor(props) {
    super(props);
  }

  static contextType = Context;

  render() {

    return (
      <div>
        <h1>This is the Project Page</h1>
      </div>
    );
  }
}

export default ProjectPage;
