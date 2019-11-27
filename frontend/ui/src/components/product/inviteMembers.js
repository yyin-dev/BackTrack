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
      userForTheProject: 0,
      hasScrumMaster: false,
      developerNum: 0,
      isLoaded: false,
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
    
    axios.get(`http://127.0.0.1:8000/user/api/`).then(res => {
      // filter users for the current project
      const usersForTheProject_ = res.data
        ? res.data.filter(user => user.projects[0] === this.props.project.id)
        : res.data;
      console.log("called!");
      console.log(usersForTheProject_);

      // check if the current project has scrum master
      const hasScrumMaster_ = usersForTheProject_
        ? usersForTheProject_.filter(user => user.role === "Scrum Master")
            .length > 0
        : false;

      // count developer numbers for the current project (not include the PO)
      const developerNum_ = usersForTheProject_
        ? hasScrumMaster_
          ? usersForTheProject_.length - 2 // all users minus PO and Scrum Master
          : usersForTheProject_.length - 1 // all users minus PO
        : 0;

      this.setState({
        users: res.data,
        usersForTheProject: usersForTheProject_,
        hasScrumMaster: hasScrumMaster_,
        developerNum: developerNum_,
        isLoaded: true
      });
    });
  };

  render() {
    // this.fetch();
   
    // console.log(this.state.usersForTheProject);
    if (!this.state.isLoaded) {
      return <div style={{ margin: "auto" }}>Loading...</div>;
    }
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
            this.state.usersForTheProject
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
            title="User's Role"
            dataIndex="role"
            key="role"
            width="10%"
          />
          <Column
            title="Kick Out"
            key="delete"
            width="10%"
            render={user => (
              <CancelMember user_id={user.id} my_id={this.context.user.id} my_role={this.context.user.role} refresh={this.props.refresh} refresh_invitemembers={this.fetch} />
            )}
          />
        </Table>
      </Layout>
    );
  }
}

export default InviteMembers;
