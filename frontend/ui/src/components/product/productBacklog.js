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
    if (this.context.user) {
      if (this.context.projectId) {

        // get current project to view
        axios
          .get(
            `http://127.0.0.1:8000/product/api/projectbyid/${this.context.projectId}`
          )
          .then(res => {
            this.setState({
              project: res.data
            })
          })
          .catch(error => console.log(error));

        // get project pbis
        axios
          .get(
            `http://127.0.0.1:8000/product/api/projectpbis/${this.context.projectId}`
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

              // TODO: sprint number
              for (i = 0; i < sorted.length; ++i) {
                if (sorted[i].sprint !== null) {
                  sprint_number = Math.max(sorted[i].sprint.no, sprint_number);
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
                You are not viewing any project. Go back to{" "}
                <Link to="/project">project page</Link> for details.
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
                This project is not started yet. Go back to{" "}
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
                  projectId={this.context.projectId}
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
          <span style={{ textAlign: "center" }}>
            See <Link to="/sprint">sprint backlog</Link>
          </span>
        </Layout>
      );
    }
  }
}

export default ProductBacklog;
