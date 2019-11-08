import React from 'react';
import axios from 'axios';

import { Modal, Tag } from 'antd';

class ViewTask extends React.Component {
    constructor(props) {
        super(props)
        this.task = this.props.task
        this.state = { visible: false };
    }

    viewDetail = e => {
        console.log(e);
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
            <Tag color="blue" onClick={this.viewDetail}>
                {this.task.name}
            </Tag>
            <Modal
                title="View Task"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>Task Name: {this.task.name}</p>
                <p>Description: {this.task.description}</p>
                <p>Status: {this.task.status}</p>
                <p>Estimated Time: {this.task.estimated_time}</p>
                <p>Person In Charge: {this.task.pic}</p>
            </Modal>
            </div>
        )
    }
}

export default ViewTask;