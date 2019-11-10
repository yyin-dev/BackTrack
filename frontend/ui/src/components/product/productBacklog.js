import React from 'react';
import axios from 'axios';

import { PageHeader, Layout, Table, Descriptions, Radio, Button } from 'antd';
import ActionButtons from './actionButtons'
import AddPBIForm from './addPBIForm';

import './productBacklog.css';
import 'antd/dist/antd.css';

const { Footer } = Layout;

class ProductBacklog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentView: true,
      pbiList: [],
      pagination: {},
      adding: false,
      priority_max: -1,
      sprint_no: 1,
    }
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    axios.get("http://127.0.0.1:8000/product/api/")
      .then(res => {
        // Fetch PBI list from backend
        let sorted = res.data
        sorted.sort((a, b) => (a.priority < b.priority) ? -1 : 1)

        // Calculate accumulated story point for each PBI
        let acc = 0
        var i;
        let sprint_number = 1;
        for (i = 0; i < sorted.length; ++i) {
          if (sorted[i].sprint !== null){
            sprint_number = Math.max(sorted[i].sprint.no,sprint_number);
          }
          acc += sorted[i].story_point;
          sorted[i].acc = acc;
        }

        this.setState({
          pbiList: sorted,
          priority_max: sorted[sorted.length - 1].priority,
          sprint_no: sprint_number,
        })

      })
      .catch(error => console.log(error))
  }

  handleViewChange = e => {
    this.setState({ currentView: !this.state.currentView })
  }

  showEditForm = () => {
    this.setState({
      adding: true
    })
  }

  closeEditForm = () => {
    this.setState({
      adding: false
    })
  }

  columns = [
    { title: 'Title', dataIndex: 'title', width: '10%' },
    {
      title: 'Sprint No', dataIndex: 'sprint', width: '10%',
      render: (sprint) => sprint ? <span>{sprint.no}</span> : <span></span>
    },
    { title: 'Status', dataIndex: 'status', width: '15%' },
    { title: 'Detail', dataIndex: 'detail', width: '15%' },
    { title: 'Story Point', dataIndex: 'story_point', width: '10%' },
    { title: 'Accumulated Story Point', dataIndex: 'acc', width: '10%' },
    // { title: 'Priority', dataIndex: 'priority', width: '10%' },
    { title: 'Actions', render: (pbi) => <ActionButtons pbi={pbi} refresh={this.fetch} /> }
  ];

  render() {
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

              <Button icon="plus" onClick={this.showEditForm} />
              <AddPBIForm
                visible={this.state.adding}
                close={this.closeEditForm}
                refresh={this.fetch}
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
            this.state.currentView
              ? this.state.pbiList.filter(pbi => pbi.status !== "Done")
              : this.state.pbiList
          }
        />
        <Footer style={{ textAlign: "center" }}>
          Developed by FastDev (Group F)
            </Footer>
      </Layout>
    );
  }
}

export default ProductBacklog;
