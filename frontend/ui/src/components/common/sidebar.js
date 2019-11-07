import React from 'react';
import { } from 'antd';

import { Layout, Menu, Icon } from 'antd';
import { Link } from "react-router-dom";

import logo from '../../assets/logo.svg'
const { Sider } = Layout;

class Sidebar extends React.Component {

    render() {
        return (
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                theme="light"
            >
                <div className="logo">
                    <img src={logo} alt="fireSpot" />
                </div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Icon type="home" />
                        <span className="nav-text" >
                            <Link to="/">Home</Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="user" />
                        <span className="nav-text" >
                            <Link to="/product">Product Backlog</Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="video-camera" />
                        <span className="nav-text" >
                            <Link to="/sprint">Sprint Backlog</Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="user" />
                        <span className="nav-text" >
                            <Link to="/user">User Center</Link>
                        </span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}



export default Sidebar;