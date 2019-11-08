import React from 'react';
import axios from 'axios';

import { Button, Popconfirm, Tooltip } from 'antd';

class MoveBack extends React.Component {
    constructor(props) {
        super(props)
        this.pbi = this.props.id
        this.state = { 
            visible: true,
        };
    }


    handleOk = e => {
    }

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    render() {
        return (
            <Tooltip title="Move Back">
                <Popconfirm title="Sure to move back PBI?" onConfirm={() => this.handleDelete()}>
                    <Button icon="backward" />
                </Popconfirm>
            </Tooltip>
        )
    }
}

export default MoveBack;