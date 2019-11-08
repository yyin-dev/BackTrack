import React from 'react';
import axios from 'axios';

import { Modal, Button, Form, InputNumber } from 'antd';

class NextSprint extends React.Component {
  constructor(props) {
    super(props);
    this.sprint_no = this.props.sprint_no;
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
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
        <Modal
          title="Next Sprint"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
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