import React from "react";
import axios from 'axios';
import { Layout, Table, Tag } from "antd";
import ViewTask from './viewTask';

const { Column, ColumnGroup } = Table;
const { Header } = Layout;

class SprintBacklog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pbis: []
        }
    }

    componentDidMount() {
        this.fetch()
    }

    fetch = () => {
        axios.get("http://127.0.0.1:8000/sprint/api/")
            .then(res => {
                let pbis = res.data;
                var i, j;
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
                    pbis: pbis
                })

                console.log(this.state.pbis)
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <Layout style={{ height: "100vh" }}>
                <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
                    Sprint Backlog
                </Header>
                <Table dataSource={this.state.pbis} >
                    <Column
                        title="PBI"
                        dataIndex="title"
                        key="pbi"
                        width="15%"
                        render={title => <span>{title}</span>}
                    />
                    <ColumnGroup title="Task">
                        <Column
                            title="To Do"
                            dataIndex="tasks"
                            key="to_do"
                            render={tasks => (
                                <span>
                                    {tasks.filter(task => task.status == "To Do")
                                        .map(task => (
                                            <ViewTask
                                                task = {task}
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
                                    {tasks.filter(task => task.status == "In Progress")
                                        .map(task => (
                                            <ViewTask
                                                task = {task}
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
                                    {tasks.filter(task => task.status == "Done")
                                        .map(task => (
                                            <ViewTask
                                                task = {task}
                                            />
                                        ))}
                                </span>
                            )}
                        />
                        /> */}
                    </ColumnGroup>
                    <Column title="Remaining Effort" dataIndex="remaining" key="remaining" width="15%" render={remaining => <span>{remaining}</span>}/>
                    <Column title="Remaining Effort" dataIndex="total" key="total" width="15%" render={total => <span>{total}</span>}/>
                </Table>
            </Layout>
        );
    }
}

export default SprintBacklog;
