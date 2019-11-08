import React from 'react';
import { } from 'antd';

import { Layout, Menu, Icon } from 'antd';
import { Link } from "react-router-dom";
import './sidebar.css';


import logo from '../../assets/logo.svg'
const { Sider } = Layout;

class Sidebar extends React.Component {

    render() {
        return (
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                theme="dark"
            >
                <div className="logo">
                    <img src={logo} alt="fireSpot" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" to="/">
                        <Icon type="home" />
                            <span className="nav-text" >Home</span>
                            <Link to="/" />
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="user" />                   
                            <span className="nav-text" >Product Backlog</span>
                            <Link to="/product"></Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="video-camera" />
                            <span className="nav-text" >Sprint Backlog</span>
                            <Link to="/sprint"></Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="user" />           
                            <span className="nav-text" >User Center</span>
                            <Link to="/user"></Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}



export default Sidebar;