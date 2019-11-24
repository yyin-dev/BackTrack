import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from "react-router-dom";
import './sidebar.css';
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import logo from '../../assets/f.png'
const { Sider } = Layout;

class Sidebar extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedMenuItem: []
    };
  }

  detectUrlChange() {

  }

  componentDidMount() {
    setInterval(() => {
      // const { match, location, history } = this.props;
      const { location } = this.props;
      var selectedMenuItemKey;
      if (location.pathname === "/") {
        selectedMenuItemKey = "1";
      } else if (location.pathname.startsWith("/product")) {
        selectedMenuItemKey = "2"
      } else if (location.pathname.startsWith("/sprint")) {
        selectedMenuItemKey = "3"
      } else if (location.pathname.startsWith("/user")) {
        selectedMenuItemKey = "4"
      }
      this.setState({
        selectedMenuItem: [selectedMenuItemKey]
      });
    }, 100);
  }

  render() {

    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
      >
        <div className="logo">
          <img src={logo} style={{ width: "100%" }} alt="fireSpot" />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={this.state.selectedMenuItem} >
          <Menu.Item key="1" to="/"  >
            <Icon type="home" />
            <span className="nav-text" >Home</span>
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="2"  >
            <Icon type="user" />
            <span className="nav-text" >Product Backlog</span>
            <Link to="/product"></Link>
          </Menu.Item>
          <Menu.Item key="3"  >
            <Icon type="video-camera" />
            <span className="nav-text" >Sprint Backlog</span>
            <Link to="/sprint"></Link>
          </Menu.Item>
          <Menu.Item key="4"  >
            <Icon type="user" />
            <span className="nav-text" >User Center</span>
            <Link to="/user"></Link>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

// const SidebarWithRouter = withRouter(Sidebar);


export default withRouter(Sidebar);
