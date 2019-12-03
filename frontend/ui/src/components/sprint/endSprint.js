import React from 'react';
import { Modal, Button, InputNumber, Card, Select, Input, message, Form } from 'antd';
import './endSprint.css'
import axios from 'axios';
import { Context } from "../../context/ContextSource";

const { Option } = Select;
const default_capacity = 10

/*
 * Logic for ending sprint
 * 1. PBI with unfinished task:
 *  a. Back to product backlog: Sprint -> null, status -> "Unfinished"
 *  b. Move to next sprint: Sprint -> nextSprint, status -> "Unfinished",
 *  TODO: its status should be automatically changed to "In progress" when next sprint
 *     is started.
 * 2. PBI with all tasks finished:
 *  Back to product backlog: Sprint unchanged, status -> "Done"
 */

class EndSprint extends React.Component {

  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      unfinished_pbis: [],
      finished_pbis: [],
      new_sprint_capacity: default_capacity,
    };
  }

  // Wait for setState to finish
  // https://stackoverflow.com/a/53964245/9057530
  showModal = async () => {
    await this.setState({
      unfinished_pbis: [],
      visible: true
    });

    // PBI with unfinished task     -> this.state.unfinished_pbis
    // PBI with all tasks finished  -> this.state.finished_pbis
    var i, j;
    for (i = 0; i < this.props.pbis.length; ++i) {
      for (j = 0; j < this.props.pbis[i].tasks.length; ++j) {
        if (this.props.pbis[i].tasks[j].status !== "Done") {
          let curr = this.state.unfinished_pbis
          curr.push(this.props.pbis[i])
          this.setState({
            unfinished_pbis: curr
          })
          break;
        }

        if (j === this.props.pbis[i].tasks.length - 1) {
          let curr = this.state.finished_pbis
          curr.push(this.props.pbis[i])
          this.setState({
            finished_pbis: curr
          })
        }
      }
    }
  };

  handleMoveToNextSprint = (pbi) => {
    axios.post(`http://127.0.0.1:8000/product/api/${pbi.id}/movetonextsprint/`, {
      id: pbi.id,
      newTitle: pbi.newTitle,
      newStoryPoint: pbi.newStoryPoint,
    })
      .then(res => {
        this.props.refresh()
      })
      .catch(err => console.log(err))
  }

  handleMoveBackToProductBacklog = (pbi, newStatus) => {
    axios.post(`http://127.0.0.1:8000/product/api/${pbi.id}/movebackPBIaftersprint/`, {
      id: pbi.id,
      newTitle: pbi.newTitle,
      newStoryPoint: pbi.newStoryPoint,
      newStatus: newStatus
    })
      .then(res => {
        this.props.refresh()
      })
      .catch(err => console.log(err))
  }

  createNewSprint = () => {
    axios.post("http://127.0.0.1:8000/product/api/createsprint/", {
      projectid: this.context.projectId,
      sprintno: this.context.sprintNo+1,
      sprintCapacity: this.state.new_sprint_capacity
    })
      .then(res => { 
        this.context.setSprintNo(this.context.sprintNo+1)
        message.success("Enter new sprint!", 3) 
      })
      .catch(err => console.log(err))
  }

  updatePbi = (pbi) => {
    if (!pbi.action) {
      pbi.action = "move"
    }

    if (!pbi.newTitle) {
      pbi.newTitle = pbi.title
    }

    if (!pbi.newStoryPoint) {
      pbi.newStoryPoint = pbi.story_point
    }

    return pbi
  }

  handleSubmit = async (e) => {
    // Create a new sprint
    await this.createNewSprint()

    // Handle unfinished pbis
    for (var i = 0; i < this.state.unfinished_pbis.length; ++i) {
      let pbi = this.updatePbi(this.state.unfinished_pbis[i])

      if (pbi.action === "move") {
        this.handleMoveToNextSprint(pbi)
      } else if (pbi.action === "back") {
        this.handleMoveBackToProductBacklog(pbi, "Unfinished")
      }
    }

    // Handle finished pbis
    for (var j = 0; j < this.state.finished_pbis.length; j++) {
      let pbi = this.updatePbi(this.state.finished_pbis[j])
      this.handleMoveBackToProductBacklog(pbi, "Done")
    }

    this.setState({
      visible: false
    });
    this.props.refresh()
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };

  handleMaxCapacityInput = (v) => {
    this.setState({
      new_sprint_capacity: v
    })
  }

  handleActionChange = (v, index) => {
    let newState = this.state.unfinished_pbis
    newState[index].action = v
    this.setState({
      unfinished_pbis: newState
    })
  }

  handleNewTitleChange = (v, index) => {
    let newState = this.state.unfinished_pbis
    newState[index].newTitle = v
    this.setState({
      unfinished_pbis: newState
    })
    console.log(this.state.unfinished_pbis)
  }

  handleNewStoryPointChange = (v, index) => {
    let newState = this.state.unfinished_pbis
    newState[index].newStoryPoint = v
    this.setState({
      unfinished_pbis: newState
    })
    console.log(this.state.unfinished_pbis)
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div style={{ display: "inline" }}>
        <Button
          onClick={this.showModal}
          disabled={this.props.disabled || this.context.user.role !== "Product Owner"}
        >
          End Sprint
        </Button>
        <Modal
          title="Next Sprint"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          {this.state.unfinished_pbis.map((pbi, index) =>
            (<Card
              className="unfinished-pbi-card"
              title={pbi.title}
              key={index}
            >
              <div style={{ paddingBottom: 10 }}>
                <FormLabel text="Total Effort" /><span>{pbi.total}</span><br />
                <FormLabel text="Remaining effort" /><span>{pbi.remaining}</span><br />
                <FormLabel text="Select an Action" />
                <Select
                  defaultValue="next"
                  style={{ width: 200 }}
                  onChange={v => this.handleActionChange(v, index)}
                >
                  <Option value="next">Move to next sprint</Option>
                  <Option value="back">Back to product backlog</Option>
                </Select>
              </div>

              <div>
                <FormLabel text="Specify new info" /><br />
                <FormLabel text="New PBI Title" />
                <Input
                  style={{ width: 'auto' }}
                  defaultValue={pbi.title}
                  onChange={e => this.handleNewTitleChange(e.target.value, index)}
                /><br />
                <FormLabel text="New PBI Story Point" />
                <InputNumber
                  min={1}
                  defaultValue={pbi.story_point}
                  onChange={v => this.handleNewStoryPointChange(v, index)}
                />
              </div>

            </Card>))}

          <Form {...formItemLayout}>
            <FormLabel text="A new sprint would be created (unstarted)." /><br />
            <FormLabel text="Enter info: " /><br />
            <Form.Item label="Sprint Number">
              <InputNumber
                disabled={true}
                defaultValue={this.context.sprintNo + 1}
              />
            </Form.Item>
            <Form.Item label="Max Capacity">
              <InputNumber
                min={0}
                value={this.state.new_sprint_capacity}
                onChange={this.handleMaxCapacityInput}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

function FormLabel(props) {
  return (<span style={{ display: "inline-block", minWidth: '200px' }}><b>{props.text}</b></span>)
}

export default EndSprint;
