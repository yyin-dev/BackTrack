import React from "react";
import { Layout } from "antd";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Sidebar from "./components/common/sidebar";
import ProductBacklog from "./components/product/productBacklog";
import SprintBacklog from "./components/sprint/sprintBacklog";
import ProjectPage from "./components/project/projectPage.js";
import Home from "./components/home/Home";
import AuthModal from "./components/authModal/AuthModal";
import { ContextProvider } from "./context/ContextSource";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }


  setLoggedIn=()=>{
    this.setState({
        isLoggedIn :  true
    });
  }

  render() {

    // if not logged in, redirect to home page for all
    let sprintPage = this.state.isLoggedIn ? (
      <Route path="/sprint" component={SprintBacklog} />
    ) : (
      <Redirect to={{ pathname: "/", component: { Home } }} />
    );

    let productPage = this.state.isLoggedIn ? (
      <Route path="/product" component={ProductBacklog} />
    ) : (
      <Redirect to={{ pathname: "/", component: { Home } }} />
    );

    let projectPage = <Route path="/project" component={ProjectPage} />
    let homePage = <Route path="/" component={Home} />

    return (
      <ContextProvider>
        <AuthModal isLoggedIn={this.state.isLoggedIn} setLoggedIn = {this.setLoggedIn} />
        <BrowserRouter>
          <Layout style={{ height: "100vh" }}>
            <Sidebar />
            <Layout>
              <Switch>
                {productPage}
                {sprintPage}
                {projectPage}
                {homePage}
              </Switch>
            </Layout>
          </Layout>
        </BrowserRouter>
      </ContextProvider>
    );
  }
}

export default App;
