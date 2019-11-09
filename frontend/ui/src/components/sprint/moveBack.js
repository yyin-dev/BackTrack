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
    axios.post(`http://127.0.0.1:8000/product/api/${this.props.pbi.id}/movebackPBI/`)
      .then(res => {
        window.location.reload()
      })
      .then(err => console.log(err))
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    var BackwardButton;
    var pbiNotStart = false;
    var tasks = this.props.pbi.tasks;

    if (tasks.length === 0) {
      pbiNotStart = true;
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
