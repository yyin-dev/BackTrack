import React from "react";
import {} from "antd";

import { Layout, Menu, Icon, Table, Select, Radio, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

class SprintBacklog extends React.Component {
  columns = [
    { title: "Title", dataIndex: "title", width: "10%" },
    { title: "Sprint No", dataIndex: "sprint_no", width: "10%" },
    { title: "Status", dataIndex: "status", width: "10%" },
    { title: "Detail", dataIndex: "detail", width: "15%" },
    { title: "Story Point", dataIndex: "story_point", width: "10%" },
    { title: "Accumulated Story Point", dataIndex: "acc", width: "10%" },
    { title: "Priority", dataIndex: "priority", width: "10%" },
  ];

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ background: '#fff', padding: 0, textAlign: "center" }}>Sprint Backlog</Header>
        <Table
          columns={this.columns}
        />
      </Layout>
    );
  }
}

export default SprintBacklog;
