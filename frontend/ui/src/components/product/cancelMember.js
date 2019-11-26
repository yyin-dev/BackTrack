import React from "react";
import axios from "axios";

import { Button, Popconfirm, Tooltip } from "antd";

class CancelMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            user_id: this.props.user_id,
        };
    }
   

    handleOk = () => {
        axios.post(`http://127.0.0.1:8000/product/api/cancelmember/`,{
                    user_id: this.state.user_id,
            })
            .then(res => {
                this.props.refresh()
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
                <Tooltip title="Cancel Member">
                    <Popconfirm
                        title="Sure to cancel this member?"
                        onConfirm={() => this.handleOk()}
                    >
                        <Button icon="backward" />
                    </Popconfirm>
                </Tooltip>
            </div>
        );
    }
}

export default CancelMember;
