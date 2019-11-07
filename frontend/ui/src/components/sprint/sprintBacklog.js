import React from "react";
import {} from "antd";

import { Layout, Table, Tag } from "antd";

const { Column, ColumnGroup } = Table;
const { Header } = Layout;

class SprintBacklog extends React.Component {

  data = [
    {
      pbi: "test1",
      to_do: ["todo1", "todo2", "todo3", "todo4"],
      in_progress: [
        "inprogress1",
        "inprogress2",
        "inprogress3",
        "inprogress4",
        "inprogress5",
        "inprogress6"
      ],
      done: ["done1", "done2", "done3", "done4"],
      remain_effort: "test1",
      total_effort: "test1"
    }
  ];

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          Sprint Backlog
        </Header>
        <Table dataSource={this.data}>
          <Column title="PBI" dataIndex="pbi" key="pbi" width="15%" />
          <ColumnGroup title="Task">
            <Column
              title="To Do"
              dataIndex="to_do"
              key="to_do"
              render={tags => (
                <span>
                  {tags.map(tag => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </span>
              )}
            />
            <Column
              title="In Progress"
              dataIndex="in_progress"
              key="in_progress"
              render={tags => (
                <span>
                  {tags.map(tag => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </span>
              )}
            />
            <Column
              title="Done"
              dataIndex="done"
              key="done"
              render={tags => (
                <span>
                  {tags.map(tag => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </span>
              )}
            />
          </ColumnGroup>
          <Column title="Remaining Effort" dataIndex="remain_effort" key="remain_effort" width="15%" />
          <Column title="Total Effort" dataIndex="total_effort" key="total_effort" width="15%" />
        </Table>
      </Layout>
    );
  }
}

export default SprintBacklog;
