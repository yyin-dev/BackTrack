import React from "react";
import axios from "axios";

import {
  PageHeader,
  Layout,
  Descriptions,
} from "antd";

import "./productBacklog.css";
import { Context } from "../../context/ContextSource";
import AddMemberForm from "./addMemberForm";

class InviteMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }

  static contextType = Context;

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    console.log("called!");
    console.log(this.props.project);
    axios.get(`http://127.0.0.1:8000/user/api/`).then(res => {
      this.setState({
        users: res.data
      });
    });
  };

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <PageHeader
            style={{
              border: "1px solid rgb(235, 237, 240)"
            }}
            title={this.props.project.name}
            extra={[
              <div key="dummy-key-to-suppress-warning">
                <AddMemberForm
                project={this.props.project}
                users={this.state.users}
                key="Add Member Form"
              />
              </div>
            ]}
          >
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Project Description">
                {this.props.project.description}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
      </Layout>
    );
  }
}

export default InviteMembers;
