import React from 'react';

import { Modal, Button, Form, InputNumber, Card } from 'antd';

class UnfinishedPBI extends React.Component {
  render() {
    return (<Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>)
  }
}

class NextSprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      unfinished_pbis: []
    };
  }

  showModal = () => {
    this.setState({
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

  handleMaxCapacityInput = (e) => {

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
        <div>


        </div>
        <Modal
          title="Next Sprint"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.unfinished_pbis.map(pbi => (<UnfinishedPBI />))}
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