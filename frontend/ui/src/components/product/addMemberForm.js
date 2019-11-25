import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const { Option } = Select;

class AddMemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userName: "",
      role: ""
    };
  }

  viewDetail = e => {
    this.setState({
      visible: true
    });
  };

  handleUserName = (e) => {
    this.setState({ userName: e.target.value })
  }

  handleSubmit = (e) => {
    // e.preventDefault();
    // let values = this.props.form.getFieldsValue()
    // axios.post(`http://127.0.0.1:8000/user/api/signup/`, {
    //   username: values.username,
    //   password: values.password,
    //   role: values.role
    // })
    //   .then(res => {
    //     message.success("You have signed up! Please log in!", 3)
    //     this.props.switchToLogin()
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Button onClick={this.viewDetail}>
        <Modal
          title="Invite User"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit} >
            <Form.Item label="User Name">
              <Input
                value={this.state.userName}
                onChange={this.handleUserName}
                placeholder="Enter User Name"
              />
            </Form.Item>

            <Form.Item label="Role">
                <Select>
                  <Option value="Scrum Master">Scrum Master</Option>
                  <Option value="Developer/Product Owner">
                    Developer/Product Owner
                  </Option>
                </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Button>
    );
  }
}

export default AddMemberForm;
