import React from "react";
import axios from "axios";
import { Empty, Layout, Table, PageHeader, Descriptions, message, Tooltip, Button } from "antd";
import { Link } from "react-router-dom";

import AddTask from "./addTask";
import EditTask from "./editTask";
import EndSprint from "./endSprint";
import MoveBack from "./moveBack";
import StartSprint from "./startSprint";
import ViewPBI from "./viewPBI";
import ViewTask from "./viewTask";

import { Context } from "../../context/ContextSource";

const { Column, ColumnGroup } = Table;

class SprintBacklog extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      sprint_started: false,
      sprint_pk: -1,
      pbis: [],
      capacity: -1,
      total_effort: -1,
      remain_effort: -1,
      isLoaded: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { projectId, sprintNo } = this.context;
    if (projectId === null || sprintNo === -1) {
      console.log("No project available!");
      this.setState({
        isLoaded: true
      });
      return;
    }

    axios
      .get(
        `http://127.0.0.1:8000/sprint/api/project-sprint/${projectId}/${sprintNo}`
      )
      .then(res => {
        let pbis = res.data.pbis;
        var i, j;
        let capacity = res.data.capacity;
        let total_effort = 0;
        let remain_effort = 0;

        for (i = 0; i < pbis.length; ++i) {
          let tasks = pbis[i].tasks;
          var remaining = 0,
            total = 0;
          for (j = 0; j < tasks.length; ++j) {
            total = total + tasks[j].estimated_time;
            if (tasks[j].status !== "Done") {
              remaining = remaining + tasks[j].estimated_time;
            }
          }
          pbis[i].total = total;
          total_effort += total;

          pbis[i].remaining = remaining;
          remain_effort += remaining;
        }

        this.setState({
          sprint_started: res.data.status === "Started",
          sprint_pk: res.data.id,

          pbis: pbis,
          capacity: capacity,
          total_effort: total_effort,
          remain_effort: remain_effort,
          isLoaded: true
        });
      })
      .catch(err => console.log(err));
  };

  handleStartSprint = () => {
    axios
      .post(
        `http://127.0.0.1:8000/product/api/${this.state.sprint_pk}/startsprint/`,
        {}
      )
      .then(res => {
        message.success("Sprint started!", 3);
        this.fetch();
      });
  };

  disableAddButton = () => {
    if (this.state.total_effort >= this.state.capacity || this.context.user.role !== "Product Owner") {
      return true
    }
    else {
      return false
    }
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div style={{ margin: "auto" }}>Loading...</div>;
    }

    else {
      if (!this.context.projectId) {
        return (
          <div style={{ margin: "auto" }}>
            <Empty
              description={
                <span>
                  You are not viewing any project. Go back to{" "}
                  <Link to="/project">project page</Link> for details.
                </span>
              }
            ></Empty>
          </div>
        );
      }

      if (this.context.sprintNo === -1) {
        return (
          <div style={{ margin: "auto" }}>
            <Empty
              description={
                <span>
                  This project is not started yet. Go back to{" "}
                  <Link to="/project">project page</Link> for details.
                </span>
              }
            ></Empty>
          </div>
        );
      }

      return (
        <Layout style={{ height: "100vh" }}>
          <div>
            <PageHeader
              style={{ border: "1px solid rgb(235, 237, 240)" }}
              title={"Sprint Backlog"}
              extra={[
                <StartSprint
                  disabled={this.state.sprint_started}
                  onConfirm={this.handleStartSprint}
                  key="start-sprint"
                />,
                <EndSprint
                  refresh={this.fetch}
                  pbis={this.state.pbis}
                  disabled={!this.state.sprint_started}
                  key="end-sprint"
                />
              ]}
            >
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="Sprint Status">
                  {this.state.sprint_started ? "in progress" : "not started"}
                </Descriptions.Item>

                <Descriptions.Item label="Sprint Number">
                  {this.context.sprintNo}
                </Descriptions.Item>

                <Descriptions.Item label="Max Capacity">
                  {this.state.capacity}
                </Descriptions.Item>

                <Descriptions.Item label="Sprint Total Effort">
                  {this.state.total_effort}
                </Descriptions.Item>

                <Descriptions.Item label="Sprint Remaining Effort">
                  {this.state.remain_effort}
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </div>
          <div>
            <Table
              dataSource={this.state.pbis}
              rowKey={pbi => pbi.title.toString()}
              bordered={true}
            >
              <Column
                title="PBI"
                dataIndex="title"
                key="pbi"
                width="18%"
                render={(_, pbi) => <ViewPBI pbi={pbi} refresh={this.fetch} />}
              />
              <Column
                title="Actions"
                dataIndex="id"
                key="actions"
                width="6%"
                render={(_, pbi) => (
                  <div>
                    <AddTask
                      id={pbi.id}
                      refresh={this.fetch}
                      disableAdd={this.disableAddButton}

                    />
                    <br />
                    <MoveBack pbi={pbi} refresh={this.fetch} />
                  </div>
                )}
              />
              } />
              <ColumnGroup title="Task" width="64%">
                <Column
                  align
                  width="21%"
                  title="To Do"
                  dataIndex="tasks"
                  key="to_do"
                  render={tasks => (
                    <span>
                      {tasks
                        .filter(task => task.status === "To Do")
                        .map(task => (
                          <EditTask
                            key={task.name}
                            task={task}
                            refresh={this.fetch}
                            disabled={!this.state.sprint_started}
                          />
                        ))}
                    </span>
                  )}
                />
                <Column
                  width="20%"
                  title="In Progress"
                  dataIndex="tasks"
                  key="in_progress"
                  render={tasks => (
                    <span>
                      {tasks
                        .filter(task => task.status === "In Progress")
                        .map(task => (
                          <ViewTask
                            key={task.name}
                            task={task}
                            disabled={!this.state.sprint_started}
                            refresh={this.fetch}
                          />
                        ))}
                    </span>
                  )}
                />
                <Column
                  width="20%"
                  title="Done"
                  dataIndex="tasks"
                  key="done"
                  render={tasks => (
                    <span>
                      {tasks
                        .filter(task => task.status === "Done")
                        .map(task => (
                          <ViewTask
                            key={task.name}
                            task={task}
                            disabled={true}
                            refresh={this.fetch}
                          />
                        ))}
                    </span>
                  )}
                />
              </ColumnGroup>
              <Column
                title="Remaining Effort"
                dataIndex="remaining"
                key="remaining"
                width="6%"
                render={remaining => <div>{remaining}</div>}
              />
              <Column
                title="Total Effort"
                dataIndex="total"
                key="total"
                width="6%"
                render={total => <div>{total}</div>}
              />
            </Table>
          </div>
        </Layout>
      );
    }
  }
}

export default SprintBacklog;
