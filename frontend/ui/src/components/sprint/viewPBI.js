import React from 'react';
import axios from 'axios';

import { Modal, Tag, Button, message } from 'antd';

class ViewPBI extends React.Component {
    constructor(props) {
        super(props)
        this.state = { visible: false }
    }

    viewDetail = e => {
        this.setState({
            visible: true,
        });
    }

    handleOk = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
    };

    render() {

        return (
            <div>
                <p onClick={this.viewDetail} style={{fontSize: '18px', margin: '5px', cursor: "pointer",}}>{this.props.pbiInfo.title}</p>

                <Modal
                    title="View PBI"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>PBI_id: {this.props.pbiInfo.id}</p>
                    <p>PBI_Title: {this.props.pbiInfo.title}</p>
                    <p>Description: {this.props.pbiInfo.detail}</p>
                    <p>Status: {this.props.pbiInfo.status}</p>
                    <p>StartDate: {this.props.pbiInfo.start_date}</p>
                    <p>StoryPoint: {this.props.pbiInfo.story_point}</p>
                    <p>Priority: {this.props.pbiInfo.priority}</p>
                </Modal>
            </div>
        )
    }
}

export default ViewPBI;
