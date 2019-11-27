import React from "react";
import axios from "axios";
import { Context } from "../../context/ContextSource";

import { Button, Popconfirm, Tooltip } from "antd";

class MoveBack extends React.Component {

    static contextType = Context;

    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
    }

    handleOk = () => {
        const tasks = this.props.pbi.tasks;
        let newStatus = tasks.length === 0 ? "To Do" : "Unfinished";
        axios
            .post(
                `http://127.0.0.1:8000/product/api/${this.props.pbi.id}/movebackPBI/`,
                {
                    newStatus: newStatus
                }
            )
            .then(res => {
                window.location.reload();
            })
            .then(err => console.log(err));
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    render() {
        return (
            <div>
                <Tooltip title="Move Back">
                    <Popconfirm
                        title="Sure to move back PBI?"
                        onConfirm={() => this.handleOk()}
                    >
                        <Button disabled={this.context.user.role !== "Product Owner"} icon="backward" />
                    </Popconfirm>
                </Tooltip>
            </div>
        );
    }
}

export default MoveBack;
