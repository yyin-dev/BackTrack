import React from 'react';

import { Modal, Tooltip } from 'antd';

class ViewPBI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          visible: false,
          hover: false
        }
    }

    toggleHover = () => {
	     this.setState({hover: !this.state.hover})
     }

    viewDetail = e => {
        this.setState({
            visible: true,
        });
    }

    handleOk = e => {
        this.setState({
          visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    render() {

        var hoverStyle;
        if (this.state.hover) {
          hoverStyle = {fontSize: '14px', margin: '5px', cursor: "pointer", display: "inline", color: '#33ccff'}
        } else {
          hoverStyle = {fontSize: '14px', margin: '5px', cursor: "pointer", display: "inline"}
        }

        return (
            <div>
              <Tooltip placement="rightTop" title="Click to view PBI">
                <p onClick={this.viewDetail} style={hoverStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                  {this.props.pbi.title}
                </p>
              </Tooltip>

                <Modal
                    title="View PBI"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>PBI_id: {this.props.pbi.id}</p>
                    <p>PBI_Title: {this.props.pbi.title}</p>
                    <p>Description: {this.props.pbi.detail}</p>
                    <p>Status: {this.props.pbi.status}</p>
                    <p>StartDate: {this.props.pbi.start_date}</p>
                    <p>StoryPoint: {this.props.pbi.story_point}</p>
                    <p>Priority: {this.props.pbi.priority}</p>
                </Modal>
            </div>
        )
    }
}

export default ViewPBI;
