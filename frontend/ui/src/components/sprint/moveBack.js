import React from "react";
import axios from "axios";

import { Button, Popconfirm, Tooltip } from "antd";

class MoveBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      status: this.props.pbi.status
    };

    console.log(this.props.pbi)
  }

  handleOk = e => {
      this.setState({ status: "To Do" })
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    var BackwardButton;
    var pbiNotStart = true;
    var tasks = this.props.pbi.tasks;
    
    for (var i = 0; i < tasks.length; i++) {
         if (tasks[i].status !== "To Do") {
             pbiNotStart = false;
             break;
         }
     }
    
    if (pbiNotStart) {
      BackwardButton = (
        <Tooltip title="Move Back">
          <Popconfirm
            title="Sure to move back PBI?"
            onConfirm={() => this.handleOk()}
          >
            <Button icon="backward" />
          </Popconfirm>
        </Tooltip>
      );
    } else {
      BackwardButton = <Button icon="backward" disabled />;
    }
    return <div>{BackwardButton}</div>;
  }
}

export default MoveBack;
