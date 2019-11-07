import React from 'react';
import axios from 'axios';
import { Button, Popconfirm, message } from 'antd';
import EditPBIForm from './editPBIForm';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'

class ActionButtons extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: false,
        }
    }

    handleDelete = () => {
        axios.delete(`http://127.0.0.1:8000/product/api/${this.props.pbi.id}/delete/`, {
            data: {
                id: this.props.pbi.id
            }
        })
            .then(res => {
                this.props.refresh()
                message.success("PBI deleted!", 3)
            })
            .catch(err => console.log(err))
    }

    handleMove = (option) => {
        axios.post("http://127.0.0.1:8000/product/api/move/", {
            'priority': this.props.pbi.priority,
            'option': option,
            withCredentials: true,
        })
            .then(res => {
                this.props.refresh()
                message.success("PBI moved!", 3)
            })
            .catch(err => console.log(err))
    }

    handleEdit = () => {
        this.setState({
            editing: true,
        })
    }

    handleClose = () => {
        this.setState({
            editing: false,
        })
    }

    render() {
        return (
            <div>
                <Button icon="up" onClick={() => this.handleMove('up')} />
                <Button icon="down" onClick={() => this.handleMove('down')} />
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete()}>
                    <Button icon="delete" />
                </Popconfirm>
                <Button icon="edit" onClick={this.handleEdit} />
                <EditPBIForm
                    pbi={this.props.pbi}
                    visible={this.state.editing}
                    refresh={this.props.refresh}
                    close={this.handleClose}
                />
                <Button icon="forward" />
            </div >
        )
    }
}

export default ActionButtons;