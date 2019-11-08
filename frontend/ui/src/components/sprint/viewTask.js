import React from 'react';
import axios from 'axios';

import { Modal, Tag, Button, message } from 'antd';

class ViewTask extends React.Component {
    constructor(props) {
        super(props)
        this.task = this.props.task
        this.state = { visible: false}
        if (this.task.status === "In Progress")
            this.disableButton = false
        else
            this.disableButton = true
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

    changeStatus = e => {
        axios.post("http://127.0.0.1:8000/sprint/api/edit/", {
            pbi: this.task.pbi,
            id: this.task.id,
            name: this.task.name,
            status: "Done",
            description: this.task.description,
            estimated_time: this.task.estimated_time,
            pic: this.task.pic
        })
        .then(res => {
            message.success("Task Finished!", 3)
            this.setState({
                visible: false
            });
            this.props.refresh()
        })
        .catch(err => {
            alert("Wrong")
            console.log(err)
        })
    };

    render() {

        return (
            <div>
            <Tag color="blue" onClick={this.viewDetail} style={{fontSize: '18px', margin: '5px'}}>
                {this.task.name}
            </Tag>
            <Button icon="check-circle" onClick={this.changeStatus} disabled={this.disableButton}/>
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