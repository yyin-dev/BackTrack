import React from 'react';

import { Modal, Button, Form, InputNumber, Card, Select, Input } from 'antd';
import './nextSprint.css'
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

  handleOk = e => {
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
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.unfinished_pbis.map((pbi, index) =>
            (<Card
              className="unfinished-pbi-card"
              title={pbi.title}
            >
              <span>Total effort: {pbi.total}</span><br />
              <span>Remaining effort: {pbi.remaining}</span><br />
              <span>Select an action:
                <Select
                  defaultValue="next"
                  style={{ width: 200, paddingLeft: 10 }}
                  onChange={v => this.handleActionChange(v, index)}
                >
                  <Option value="next">Move to next sprint</Option>
                  <Option value="back">Back to product backlog</Option>
                </Select>
              </span><br />
              <span>Specify new info</span><br />
              <span>New PBI Title:
                <Input 
                  style={{ width: 'auto' }} 
                  defaultValue={pbi.title} 
                  onChange={v => this.handleNewTitleChange(v, index)}
                />
              </span><br />
              <span>New PBI Story Point:
                <InputNumber
                  min={1}
                  defaultValue={pbi.story_point}
                  onChange={v => this.handleNewStoryPointChange(v, index)} 
                />
              </span><br />
            </Card>))}

          <Form {...formItemLayout}>
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
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NextSprint;