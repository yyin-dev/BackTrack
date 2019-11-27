import React from 'react';
import axios from 'axios';
import { Button, Popconfirm, message, Tooltip } from 'antd';
import EditPBIForm from './editPBIForm';
import { Context } from "../../context/ContextSource";


axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'

class ActionButtons extends React.Component {

  static contextType = Context;

  constructor(props) {
    super(props)

    this.state = {
      editing: false,
    }
  }

  handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/product/api/${this.props.pbi.id}/delete/`, {
      data: {
        id: this.props.pbi.id
      }
    })
      .then(res => {
        this.props.refresh()
        message.success("PBI deleted!", 3)
      })
      .catch(err => console.log(err))
  }

  handleMove = (option) => {
    axios.post("http://127.0.0.1:8000/product/api/move/", {
      'priority': this.props.pbi.priority,
      'option': option,
      withCredentials: true,
    })
      .then(res => {
        this.props.refresh()
        message.success("PBI moved!", 3)
      })
      .catch(err => console.log(err))
  }

  handleEdit = () => {
    this.setState({
      editing: true,
    })
  }

  handleClose = () => {
    this.setState({
      editing: false,
    })
  }

  handleMoveToSprint = () => {
    axios.post("http://127.0.0.1:8000/product/api/movetosprint/", {
      'id': this.props.pbi.id,
    })
      .then(res => {
        message.success("PBI moved to sprint!", 3)
        this.props.refresh()
      })
  }

  render() {
    var EditButton;
    const pbiStatus = this.props.pbi.status;

    if (pbiStatus === "To Do" || pbiStatus === "Unfinished") {
      EditButton = <Tooltip title="Edit">
        <Button disabled={this.context.user.role !== "Product Owner"} icon="edit" onClick={this.handleEdit} />
      </Tooltip>
    } else {
      EditButton = <Button icon="edit" disabled />
    }

    var DeleteButton;
    if (pbiStatus === "To Do" || pbiStatus === "Unfinished") {
      DeleteButton = <Tooltip title="Delete">
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete()}>
          <Button disabled={this.context.user.role !== "Product Owner"} icon="delete" />
        </Popconfirm>
      </Tooltip>
    } else {
      DeleteButton = <Button icon="delete" disabled />
    }

    return (
      <div>
        <Tooltip title="Move up">
          <Button disabled={this.context.user.role !== "Product Owner"} icon="up" onClick={() => this.handleMove('up')} />
        </Tooltip>
        <Tooltip title="Move down">
          <Button disabled={this.context.user.role !== "Product Owner"} icon="down" onClick={() => this.handleMove('down')} />
        </Tooltip>
        {DeleteButton}
        {EditButton}
        <EditPBIForm
          pbi={this.props.pbi}
          visible={this.state.editing}
          refresh={this.props.refresh}
          close={this.handleClose}
        />
        <Popconfirm title="Move to sprint?" onConfirm={() => this.handleMoveToSprint()}>
          <Button disabled={this.context.user.role !== "Product Owner" || (this.props.pbi.status !== "To Do" && this.props.pbi.status !== "Unfinished") } icon="forward" />
        </Popconfirm>
      </div >
    )
  }
}

export default ActionButtons;
