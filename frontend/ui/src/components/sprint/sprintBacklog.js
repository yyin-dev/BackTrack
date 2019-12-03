import React from "react";
import axios from "axios";
import { Layout, Table, PageHeader, Descriptions, message } from "antd";
import ViewTask from "./viewTask";
import StartSprint from "./startSprint";
import EndSprint from "./endSprint";
import AddTask from "./addTask";
import EditTask from "./editTask";
import MoveBack from "./moveBack";
import ViewPBI from "./viewPBI";
import { Context } from "../../context/ContextSource";

const { Column, ColumnGroup } = Table;

class SprintBacklog extends React.Component {

  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      sprint_started: false,
      sprint_no: -1,
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
    const { projectId, sprintNo } = this.context
    if (projectId === null || sprintNo === null) {
      console.log("No project available!")
      return
    }

    axios
      .get(`http://127.0.0.1:8000/sprint/api/project-sprint/${projectId}/${sprintNo}`)
      .then(res => {
        let pbis = res.data[0].pbis;
        var i, j;
        let sprint_no = res.data[0].no;
        let capacity = res.data[0].capacity;
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
          sprint_no: sprint_no,
          sprint_started: res.data[0].status === "Started",
          sprint_pk: res.data[0].id,

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

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div style={{ margin: "auto" }}>Loading...</div>;
    } else {
      var disable_add = false;
      if (this.state.total_effort >= this.state.capacity) {
        disable_add = true;
      }

      return (
        <Layout style={{ height: "100vh" }}>
          <div>
            <PageHeader
              style={{ border: "1px solid rgb(235, 237, 240)" }}
              title={"Sprint Backlog: ".concat(
                this.state.sprint_started ? "" : "NOT",
                " in progress"
              )}
              extra={[
                <StartSprint
                  disabled={this.state.sprint_started}
                  onConfirm={this.handleStartSprint}
                  key="start-sprint"
                />,
                <EndSprint
                  sprint_no={this.state.sprint_no}
                  refresh={this.fetch}
                  pbis={this.state.pbis}
                  disabled={!this.state.sprint_started}
                  key="end-sprint"
                />
              ]}
            >
              <Descriptions size="small" column={4}>
                <Descriptions.Item label="Sprint Number">
                  {this.state.sprint_no}
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
            >
              <Column
                title="PBI"
                dataIndex="title"
                key="pbi"
                width="10%"
                render={(_, pbi) => <ViewPBI pbi={pbi} refresh={this.fetch} />}
              />
              <Column
                dataIndex="id"
                key="add_pbi"
                width="2%"
                render={id => (
                  <AddTask
                    id={id}
                    refresh={this.fetch}
                    disableAdd={disable_add || this.context.user.role !== "Product Owner"}
                  />
                )}
              />
              <Column
                dataIndex="tasks"
                key="move_back"
                width="1%"
                render={(_, pbi) => <MoveBack pbi={pbi} refresh={this.fetch} />}
              />
              } />
              <ColumnGroup title="Task">
                <Column
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
                            refresh={this.fetch}
                          />
                        ))}
                    </span>
                  )}
                />
                <Column
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
                width="15%"
                render={remaining => <h3>{remaining}</h3>}
              />
              <Column
                title="Total Effort"
                dataIndex="total"
                key="total"
                width="15%"
                render={total => <h3>{total}</h3>}
              />
            </Table>
          </div>
        </Layout>
      );
    }
  }
}

export default SprintBacklog;
