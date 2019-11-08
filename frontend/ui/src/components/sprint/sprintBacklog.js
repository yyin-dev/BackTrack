import React from "react";
import axios from 'axios';
import { Layout, Table, Tag, Button } from "antd";
import { PageHeader, Descriptions } from 'antd';
import ViewTask from './viewTask';
import NextSprint from './nextSprint';
import AddTask from './addTask';
import EditTask from './editTask';
import MoveBack from './moveBack';

const { Column, ColumnGroup } = Table;
const { Header } = Layout;

class SprintBacklog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pbis: [],
            sprint_no: -1,
            capacity: -1,
        }
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        axios.get("http://127.0.0.1:8000/sprint/api/")
            .then(res => {
                let pbis = res.data[0].pbis;
                var i, j;
                let sprint_no = res.data[0].no;
                let capacity = res.data[0].capacity;
                for(i = 0; i < pbis.length; ++i){
                    let tasks = pbis[i].tasks
                    var remaining = 0, total= 0;
                    for(j = 0; j < tasks.length; ++j) {
                        total = total + tasks[j].estimated_time;
                        if (tasks[j].status != "Done") {
                            remaining = remaining + tasks[j].estimated_time;
                        }
                    }
                    pbis[i].total = total;
                    pbis[i].remaining = remaining;
                }


                this.setState({
                    pbis: pbis,
                    sprint_no: sprint_no,
                    capacity: capacity,
                })

                console.log(this.state.pbis, this.state.sprint_no)
            })
            .catch(err => console.log(err))
    }


    render() {
        return (
          <Layout style={{ height: "100vh" }}>
            <div>
              <PageHeader
                style={{
                  border: "1px solid rgb(235, 237, 240)"
                }}
                title="Sprint Backlog"
                extra={[
                  <NextSprint
                    sprint_no={this.state.sprint_no}
                    refresh={this.fetch}
                    pbis={this.state.pbis}
                  />
                ]}
              >
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="Sprint Number">
                    {this.state.sprint_no}
                  </Descriptions.Item>

                  <Descriptions.Item label="Max Capacity">
                    {this.state.capacity}
                  </Descriptions.Item>
                </Descriptions>
              </PageHeader>
            </div>
            <Table dataSource={this.state.pbis}>
              <Column
                title="PBI"
                dataIndex="title"
                key="pbi"
                width="10%"
                render={title => <h2>{title}</h2>}
              />
              <Column
                dataIndex="id"
                key="add_pbi"
                width="2%"                
                render={id => <AddTask id={id} refresh={this.fetch} />}
              />
              <Column
                dataIndex="id"
                key="move_back"
                width="2%"                
                render={id => <MoveBack id={id} refresh={this.fetch} />}
              />
              <ColumnGroup title="Task">
                <Column
                  title="To Do"
                  dataIndex="tasks"
                  key="to_do"
                  render={tasks => (
                    <span>
                      {tasks
                        .filter(task => task.status == "To Do")
                        .map(task => (
                          <EditTask task={task} refresh={this.fetch} />
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
                        .filter(task => task.status == "In Progress")
                        .map(task => (
                          <EditTask task={task} refresh={this.fetch} />
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
                        .filter(task => task.status == "Done")
                        .map(task => (
                          <EditTask task={task} refresh={this.fetch} />
                        ))}
                    </span>
                  )}
                />
                /> */}
              </ColumnGroup>
              <Column
                title="Remaining Effort"
                dataIndex="remaining"
                key="remaining"
                width="15%"
                render={remaining => <h3>{remaining}</h3>}
              />
              <Column
                title="Remaining Effort"
                dataIndex="total"
                key="total"
                width="15%"
                render={total => <h3>{total}</h3>}
              />
            </Table>
          </Layout>
        );
    }
}

export default SprintBacklog;
