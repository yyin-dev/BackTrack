import React from "react";
import axios from "axios";

import { PageHeader, Layout, Descriptions } from "antd";

import "./productBacklog.css";
import { Context } from "../../context/ContextSource";
import AddMemberForm from "./addMemberForm";
import CancelMember from "./cancelMember";
import StartProject from "./startProject";
import { Table } from "antd";
const { Column } = Table;

class InviteMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      hasScrumMaster: false,
      developerNum: 0
    };
    this.addDeveloper = this.addDeveloper.bind(this);
    this.setScrumMaster = this.setScrumMaster.bind(this);
  }

  static contextType = Context;

  addDeveloper = () => {
    this.setState(prevState => {
      return { developerNum: prevState.developerNum + 1 };
    });
  };

  setScrumMaster() {
    this.setState({
      hasScrumMaster: true
    });
  }

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
          title={"Project Name: ".concat(this.props.project.name)}
          extra={[
            <AddMemberForm
              project={this.props.project}
              users={this.state.users}
              hasScrumMaster={this.state.hasScrumMaster}
              addDeveloper={this.addDeveloper}
              setScrumMaster={this.setScrumMaster}
              refresh={this.fetch}
              key="Add Member Form"
            />,
            <StartProject
              refresh={this.fetch}
              hasScrumMaster={this.state.hasScrumMaster}
              developerNum={this.state.developerNum}
              setStartProject={this.props.setStartProject}
              key="start-project"
            />
          ]}
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Project Description">
              {this.props.project.description}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Table
          dataSource={
            this.state.users
              ? this.state.users.filter(
                  user => user.projects[0] === this.props.project.id
                )
              : this.state.users
          }
          rowKey={user => user.username.toString()}
        >
          <Column
            title="Current Users"
            dataIndex="username"
            key="username"
            width="10%"
          />
          <Column
            key="delete"
            width="10%"
            render={user => (
              <CancelMember user_id={user.id} refresh={this.fetch} />
            )}
          />
        </Table>
      </Layout>
    );
  }
}

export default InviteMembers;
