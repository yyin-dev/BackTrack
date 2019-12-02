import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  PageHeader,
  Layout,
  Table,
  Descriptions,
  Radio,
  Button,
  Empty,
  message
} from "antd";
import ActionButtons from "./actionButtons";
import AddPBIForm from "./addPBIForm";
import { Context } from "../../context/ContextSource";

class ProductBacklog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      currentView: true,
      pagination: {},
      adding: false,
      isCreatingProject: false,
      pbiList: null, // null: not in project; []: in project but no PBIs.
      priority_max: -1,
      sprint_no: 1,
      isLoaded: false
    };
    this.fetch = this.fetch.bind(this);
  }

  static contextType = Context;

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    var project_id;

    // Get projects of the user
    if (this.context.user) {
      // for developer and product owner
      if (this.context.user.role !== "Scrum Master") {
        axios
          .get(
            `http://127.0.0.1:8000/product/api/projectofuser/${this.context.user.id}`
          )
          .then(res => {
            let projects = res.data;
            if (projects.length === 0) {
              // Not in project
              this.setState({
                project: null
              });
              return;
            } else {
              this.setState({
                project: projects[0]
              });
            }

            project_id = projects[0].id;

            // TODO: handle multiple project issue for scrum master
            if (
              this.context.user.role === "Developer/Product Owner" &&
              projects.length > 1
            ) {
              message.error("Developer/Product Owner in multiple project!!!");
            }

            axios.get("http://127.0.0.1:8000/sprint/api/").then(res => {
              let sprint_no = res.data[0].no;
              this.setState({
                sprint_no: sprint_no
              });
            });

            axios
              .get(
                `http://127.0.0.1:8000/product/api/projectpbis/${project_id}`
              )
              .then(res => {
                if (res.data.length === 0) {
                  // No PBIs yet
                  this.setState({
                    pbiList: []
                  });
                } else {
                  // Fetch PBI list from backend
                  let sorted = res.data;
                  sorted.sort((a, b) => (a.priority < b.priority ? -1 : 1));

                  // Calculate accumulated story point for each PBI
                  let acc = 0;
                  var i;
                  var sprint_number = 1;

                  for (i = 0; i < sorted.length; ++i) {
                    if (sorted[i].sprint !== null) {
                      sprint_number = Math.max(
                        sorted[i].sprint.no,
                        sprint_number
                      );
                    }
                    acc += sorted[i].story_point;
                    sorted[i].acc = acc;
                  }

                  this.setState({
                    pbiList: sorted,
                    priority_max: sorted[sorted.length - 1].priority
                  });
                }
              })
              .catch(error => console.log(error));
          });
      }

      // for Scrum Master
      else if (this.context.user.role === "Scrum Master") {
        if (this.context.projectId) {
          message.success(
            "You are viewing Project ".concat(this.context.projectId),
            3
          );
          axios
            .get(
              `http://127.0.0.1:8000/product/api/projectofuser/${this.context.user.id}`
            )
            .then(res => {
              let projects = res.data;
              if (projects.length === 0) {
                // Not in project
                this.setState({
                  project: null,
                  isLoaded: true
                });
                return;
              } else {
                for (var i = 0; i < projects.length; i++) {
                  if (projects[i].id === this.context.projectId) {
                    this.setState({
                      project: projects[i]
                    });
                  }
                }
              }

              project_id = this.state.project.id;

              // handle multiple project issue for scrum master
              if (
                this.context.user.role === "Developer/Product Owner" &&
                projects.length > 1
              ) {
                message.error("Developer/Product Owner in multiple project!!!");
              }

              axios.get("http://127.0.0.1:8000/sprint/api/").then(res => {
                let sprint_no = res.data[0].no;
                this.setState({
                  sprint_no: sprint_no
                });
              });

              axios
                .get(
                  `http://127.0.0.1:8000/product/api/projectpbis/${project_id}`
                )
                .then(res => {
                  if (res.data.length === 0) {
                    // No PBIs yet
                    this.setState({
                      pbiList: [],
                      isLoaded: true
                    });
                  } else {
                    // Fetch PBI list from backend
                    let sorted = res.data;
                    sorted.sort((a, b) => (a.priority < b.priority ? -1 : 1));

                    // Calculate accumulated story point for each PBI
                    let acc = 0;
                    var i;
                    var sprint_number = 1;

                    for (i = 0; i < sorted.length; ++i) {
                      if (sorted[i].sprint !== null) {
                        sprint_number = Math.max(
                          sorted[i].sprint.no,
                          sprint_number
                        );
                      }
                      acc += sorted[i].story_point;
                      sorted[i].acc = acc;
                    }

                    this.setState({
                      pbiList: sorted,
                      priority_max: sorted[sorted.length - 1].priority,
                      isLoaded: true
                    });
                  }
                })
                .catch(error => console.log(error));
            });
        } else {
          message.success("Please go back to homepage to select a project", 3);
        }
      }

      this.setState({
        isLoaded: true
      });
    }
  };

  handleViewChange = e => {
    this.setState({ currentView: !this.state.currentView });
  };

  showEditForm = () => {
    this.setState({
      adding: true
    });
  };

  closeEditForm = () => {
    this.setState({
      adding: false
    });
  };

  columns = [
    { title: "Title", dataIndex: "title", width: "10%" },
    {
      title: "Sprint No",
      dataIndex: "sprint",
      width: "10%",
      render: sprint => (sprint ? <span>{sprint.no}</span> : <span></span>)
    },
    { title: "Status", dataIndex: "status", width: "15%" },
    { title: "Detail", dataIndex: "detail", width: "15%" },
    { title: "Story Point", dataIndex: "story_point", width: "10%" },
    { title: "Accumulated Story Point", dataIndex: "acc", width: "10%" },
    {
      title: "Actions",
      render: pbi => <ActionButtons pbi={pbi} refresh={this.fetch} />
    }
  ];

  render() {
    if (!this.state.isLoaded) {
      return <div style={{ margin: "auto" }}>Loading...</div>;
    } else if (!this.state.project) {
      // no project for the current user
      return (
        <div style={{ margin: "auto" }}>
          <Empty
            description={
              <span>
                You are not in any project. Go back to{" "}
                <Link to="/">project page</Link> for details.
              </span>
            }
          ></Empty>
        </div>
      );
    } else if (!this.state.project.started) {
      return (
        <div style={{ margin: "auto" }}>
          <Empty
            description={
              <span>
                Your project is not started yet. Go back to{" "}
                <Link to="/project">project page</Link> for details.
              </span>
            }
          ></Empty>
        </div>
      );
    } else {
      return (
        <Layout style={{ height: "100vh" }}>
          <PageHeader
            style={{
              border: "1px solid rgb(235, 237, 240)"
            }}
            title="Product Backlog"
            extra={[
              <div key="dummy-key-to-suppress-warning">
                <Radio.Group
                  style={{ marginRight: 20 }}
                  value={this.state.currentView ? "current" : "full"}
                  onChange={this.handleViewChange}
                >
                  <Radio.Button value="current">Current View</Radio.Button>
                  <Radio.Button value="full">Full View</Radio.Button>
                </Radio.Group>

                <Button
                  disabled={this.context.user.role !== "Product Owner"}
                  icon="plus"
                  onClick={this.showEditForm}
                />
                <AddPBIForm
                  visible={this.state.adding}
                  close={this.closeEditForm}
                  refresh={this.fetch}
                  projectId={this.state.project.id}
                />
              </div>
            ]}
          >
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Sprint Number">
                {this.state.sprint_no}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <Table
            columns={this.columns}
            rowKey={pbi => pbi.id.toString()}
            pagination={this.state.pagination}
            dataSource={
              this.state.currentView && this.state.pbiList
                ? this.state.pbiList.filter(pbi => pbi.status !== "Done")
                : this.state.pbiList
            }
          />
          <span style={{ "text-align": "center" }}>
            See <Link to="/sprint">sprint backlog</Link>
          </span>
        </Layout>
      );
    }
  }
}

export default ProductBacklog;
