import React from 'react';
import { Layout } from 'antd';

import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Sidebar from './components/common/sidebar';
import ProductBacklog from './components/product/productBacklog'
import SprintBacklog from './components/sprint/sprintBacklog'

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Layout style={{ height: "100vh" }}>
                    <Sidebar />
                    <Layout>
                        <Switch>
                            <Route path="/product" component={ProductBacklog} />
                            <Route path="/sprint" component={SprintBacklog} />
                            <Route path="/user" component={UserCenter} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </Layout>
                </Layout>
            </BrowserRouter>
        )
    }
}

function UserCenter() {
    return <h1>User Center</h1>
}

function Home() {
    return <h2>Home</h2>;
}

export default App;
