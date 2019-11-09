import React from 'react';

import { Modal, Button, Form, InputNumber, Card, Select, Input, message } from 'antd';
import './nextSprint.css'
import axios from 'axios';
const { Option } = Select;

class NextSprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      unfinished_pbis: []
    };
  }

  // https://stackoverflow.com/a/53964245/9057530
  showModal = async () => {
    await this.setState({
      unfinished_pbis: [],
      visible: true
    });

    // Get PBI(s) with unfinished tasks
    var i, j;
    for (i = 0; i < this.props.pbis.length; ++i) {
      for (j = 0; j < this.props.pbis[i].tasks.length; ++j) {
        if (this.props.pbis[i].tasks[j].status != "Done") {
          let curr = this.state.unfinished_pbis
          curr.push(this.props.pbis[i])
          this.setState({
            unfinished_pbis: curr
          })
          break;
        }
      }
    }
  };

  handleSubmit = e => {
    var i, pbi;
    for (i = 0; i < this.state.unfinished_pbis.length; ++i) {
      pbi = this.state.unfinished_pbis[i]
      if (!pbi.action) {
        pbi.action = "move"
      }

      if (!pbi.newTitle) {
        pbi.newTitle = pbi.title
      }

      if (!pbi.newStoryPoint) {
        pbi.newStoryPoint = pbi.story_point
      }

      if (pbi.action === "move") {
        axios.post(`http://127.0.0.1:8000/product/api/${pbi.id}/movetonextsprint/`, {
          id: pbi.id,
          newTitle: pbi.newTitle,
          newStoryPoint: pbi.newStoryPoint
        })
          .then(res => {
            this.props.refresh()
            message.success("Move succeed!", 3)
          })
          .catch(err => console.log(err))
      } else if (pbi.action === "back") {
        axios.post(`http://127.0.0.1:8000/product/api/${pbi.id}/movebackPBIaftersprint/`, {
          id: pbi.id,
          newTitle: pbi.newTitle,
          newStoryPoint: pbi.newStoryPoint
        })
          .then(res => {
            this.props.refresh()
            message.success("Move back succeed!", 3)
          })
          .catch(err => console.log(err))
      } else if (pbi.action === "delete") {
        axios.delete(`http://127.0.0.1:8000/product/api/${pbi.id}/delete/`, {
          data: {
            id: pbi.id
          }
        })
          .then(res => {
            this.props.refresh()
            message.success("PBI deleted!", 3)
          })
          .catch(err => console.log(err))
      } else {
        console.log("error")
      }
    }

    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  handleMaxCapacityInput = (e) => { }

  handleActionChange = (v, index) => {
    let newState = this.state.unfinished_pbis
    newState[index].action = v
    this.setState({
      unfinished_pbis: newState
    })
    console.log(this.state.unfinished_pbis)
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
        xs: { span: 20 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Next Sprint
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
                  <Option value="delete">Delete this PBI</Option>
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

          {/* <Form {...formItemLayout}>
            <Form.Item label="Sprint Number">
              <InputNumber
                disabled={true}
                defaultValue={parseInt(this.props.sprint_no) + 1}
              />
            </Form.Item>
            <Form.Item label="Max Capacity">
              <InputNumber
                min={0}
                value={10}
                onChange={this.handleMaxCapacityInput}
              />
            </Form.Item>
          </Form> */}
        </Modal>
      </div>
    );
  }
}

function FormLabel(props) {
  return (<span style={{ display: "inline-block", minWidth: '200px' }}><b>{props.text}</b></span>)
}

export default NextSprint;