import React from "react";
import axios from "axios";

import { Button, Popconfirm, Tooltip,message } from "antd";
import { Context } from '../../context/ContextSource'


class CancelMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            user_id: this.props.user_id,
            my_id: this.props.my_id,
            my_role: this.props.my_role,
        };
    }
    static contextType = Context;

    handleOk = () => {
        if ((this.state.user_id === this.state.my_id) && (this.props.my_role === "Product Owner")){
            message.error("Product Owner should not delete themselves.");
            return;
        }
        else if ((this.state.user_id !== this.state.my_id) && (this.props.my_role !== "Product Owner")){
            message.error("Developer can not delete other members.");
            return;
        }
        else if (this.state.user_id !== this.state.my_id){
            axios.post(`http://127.0.0.1:8000/product/api/cancelmember/`,{
                        user_id: this.state.user_id,
                })
                .then(res => {
                    let updatedUser = this.context.user
                    updatedUser.role = "Product Owner"
                    this.context.setUser(updatedUser)
                    this.props.refresh_invitemembers()
                })
                .then(err => console.log(err));
        }
        else{
            axios.post(`http://127.0.0.1:8000/product/api/cancelmember/`,{
                        user_id: this.state.user_id,
                })
                .then(res => {
                    let updatedUser = this.context.user
                    updatedUser.role = "Product Owner"
                    this.context.setUser(updatedUser)
                    this.props.refresh()
                })
                .then(err => console.log(err));
                
        }
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
