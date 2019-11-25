import React from 'react';
import axios from 'axios';

import { PageHeader, Layout, Table, Descriptions, Radio, Button, Empty } from 'antd';
import ActionButtons from './actionButtons'
import AddPBIForm from './addPBIForm';
import CreateProjectModal from './createProjectModal'

import './productBacklog.css';
import { Context } from '../../context/ContextSource'
import AddMemberForm from './addMemberForm';

class InviteMembers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentView: true,
    }
  }

  static contextType = Context

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    // axios.get("http://127.0.0.1:8000/product/api/")
    //   .then(res => {
    //     if (res.data.length === 0) {
    //       return
    //     }

    //     // Fetch PBI list from backend
    //     let sorted = res.data
    //     sorted.sort((a, b) => (a.priority < b.priority) ? -1 : 1)

    //     // Calculate accumulated story point for each PBI
    //     let acc = 0
    //     var i;
    //     var sprint_number = 1;
    //     for (i = 0; i < sorted.length; ++i) {
    //       if (sorted[i].sprint !== null) {
    //         sprint_number = Math.max(sorted[i].sprint.no, sprint_number);
    //       }
    //       acc += sorted[i].story_point;
    //       sorted[i].acc = acc;
    //     }

    //     this.setState({
    //       pbiList: sorted,
    //       priority_max: sorted[sorted.length - 1].priority,
    //       sprint_no: sprint_number,
    //     })

    //   })
    //   .catch(error => console.log(error))
    console.log("called!")
    console.log(this.props.project_name)
      axios.get(`http://127.0.0.1:8000/user/api/`)
        .then(res => {
          console.log(res)
        })
    
  }

  handleViewChange = e => {
    this.setState({ currentView: !this.state.currentView })
  }

  
//   columns = [
//     { title: 'Title', dataIndex: 'title', width: '10%' },
//     {
//       title: 'Sprint No', dataIndex: 'sprint', width: '10%',
//       render: (sprint) => sprint ? <span>{sprint.no}</span> : <span></span>
//     },
//     { title: 'Status', dataIndex: 'status', width: '15%' },
//     { title: 'Detail', dataIndex: 'detail', width: '15%' },
//     { title: 'Story Point', dataIndex: 'story_point', width: '10%' },
//     { title: 'Accumulated Story Point', dataIndex: 'acc', width: '10%' },
//     { title: 'Actions', render: (pbi) => <ActionButtons pbi={pbi} refresh={this.fetch} /> }
//   ];

//   toggleCreatingProject = () => {
//     this.setState({
//       isCreatingProject: !this.state.isCreatingProject
//     })
//   }

  render() {

      return (
        <Layout style={{ height: "100vh" }}>
          <div>
            <PageHeader
              style={{ border: "1px solid rgb(235, 237, 240)" }}
              title={this.props.project_name}
              extra={[
                <AddMemberForm
                  key="Add Member Form"
                />
              ]}
            ></PageHeader>
            </div>
            </Layout>
      );
    
  }
}

export default InviteMembers;
