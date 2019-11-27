import React from "react";
import axios from "axios";

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
import CreateProjectModal from "./createProjectModal";
import InviteMembers from "./inviteMembers";
import "./productBacklog.css";
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
      sprint_no: 1
    };
  }

  static contextType = Context;

  componentDidMount() {
    console.log("this.context.user", this.context.user);
    this.fetch();
  }

  fetch = () => {
    var project_id;

    // Get projects of the user
    if (this.context.user) {
      axios
        .get(
          `http://127.0.0.1:8000/product/api/projectofuser/${this.context.user.id}`
        )
        .then(res => {
          let projects = res.data;
          if (projects.length === 0) {
            // Not in project
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
          axios
            .get(`http://127.0.0.1:8000/product/api/projectpbis/${project_id}`)
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
                  priority_max: sorted[sorted.length - 1].priority,
                  sprint_no: sprint_number
                });
              }
            })
            .catch(error => console.log(error));
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

  setStartProject = () => {
    axios
      .post(`http://127.0.0.1:8000/product/api/startproject/`, {
        project_name: this.state.project.name
      })
      .then(res => {
        this.fetch();
      })
      .catch(err => console.log(err));
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

  toggleCreatingProject = () => {
    this.setState({
      isCreatingProject: !this.state.isCreatingProject
    });
  };

  render() {
    console.log(this.state.project);
    if (!this.state.project) {
      return (
        <div className="create-project-wrapper">
          <Empty
            description={
              <span>
                You are not in any project. <br />
                Wait for an invitation or create one!
              </span>
            }
          >
            <Button type="primary" onClick={this.toggleCreatingProject}>
              Create Project
            </Button>
          </Empty>
          <CreateProjectModal
            visible={this.state.isCreatingProject}
            close={this.toggleCreatingProject}
            refresh={this.fetch}
          />
        </div>
      );
    } else if (!this.state.project.started) {
      return (
        <InviteMembers
          project={this.state.project}
          visible="true"
          setStartProject={this.setStartProject}
          refresh={this.fetch}
        />
      );
    } else {
      console.log(this.state.pbiList);
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

                <Button disabled={this.context.user.role !== "Product Owner"} icon="plus" onClick={this.showEditForm} />
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
        </Layout>
      );
    }
  }
}

export default ProductBacklog;
