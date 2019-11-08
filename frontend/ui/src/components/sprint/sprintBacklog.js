import React from "react";
import axios from 'axios';
import { Layout, Table, Tag, Button } from "antd";
import { PageHeader, Descriptions } from 'antd';
import ViewTask from './viewTask';
import NextSprint from './nextSprint';
import AddTask from './addTask';
import EditTask from './editTask';
import MoveBack from './moveBack';
import ViewPBI from './viewPBI';

const { Column, ColumnGroup } = Table;
const { Header } = Layout;

class SprintBacklog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pbis: [],
            sprint_no: -1,
            capacity: -1,
            total_effort: -1,
            remain_effort: -1,
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
                let total_effort = 0;
                let remain_effort = 0;
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
                    total_effort += total;
                    pbis[i].remaining = remaining;
                    remain_effort += remaining;

                    var pbiInfo = {
                      id: pbis[i].id,
                      title: pbis[i].title,
                      detail: pbis[i].detail,
                      status: pbis[i].status,
                      start_date: pbis[i].start_date,
                      story_point: pbis[i].story_point,
                      priority: pbis[i].priority,
                    };
                    pbis[i].pbiInfo = pbiInfo
                }


                this.setState({
                    pbis: pbis,
                    sprint_no: sprint_no,
                    capacity: capacity,
                    total_effort: total_effort,
                    remain_effort: remain_effort,
                })

                console.log(this.state.pbis, this.state.sprint_no)
            })
            .catch(err => console.log(err))
    }


    render() {

    var disable_add = false;
      if (this.state.total_effort >= this.state.capacity) {
        disable_add = true;
      }
        return (
          <Layout style={{ height: "100vh" }}>
            <div>
              <PageHeader
                style={{
                  border: "1px solid rgb(235, 237, 240)"
                }}
                title="Sprint Backlog"
                extra={[
                  <NextSprint key="dummy-key"
                    sprint_no={this.state.sprint_no}
                    refresh={this.fetch}
                    pbis={this.state.pbis}
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
            <Table dataSource={this.state.pbis}>
              <Column
                title="PBI"
                dataIndex="pbiInfo"
                key="pbi"
                width="10%"
                render={ pbiInfo =>
                  <ViewPBI
                    pbiInfo={pbiInfo}
                    refresh={this.fetch}
                  />}
              />
              <Column
                dataIndex="id"
                key="add_pbi"
                width="2%"                
                render={id => <AddTask id={id} refresh={this.fetch} disableAdd={disable_add} />}
              />
              <Column
                dataIndex="tasks"
                key="move_back"
                width="2%"
                refresh={this.fetch}
                render={(_, pbi) => <MoveBack pbi={pbi} refresh={this.fetch}/>}
                />}
              />
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
                          <EditTask key={task.name} task={task} refresh={this.fetch} />
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
                          <ViewTask task={task} refresh={this.fetch}/>

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
                            <ViewTask task={task} refresh={this.fetch}/>

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
                title="Total Effort"
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
