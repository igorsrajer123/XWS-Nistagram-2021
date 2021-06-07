import React, { Component } from 'react';
import './homepage.css';
import Topbar from './../../sharedComponents/topbar/Topbar';
import Feed from './../../sharedComponents/feed/Feed';

export default class Homepage extends Component {
    render() {
        return (
            <div>
                <Topbar parentComponent={'homePage'} />
                <Feed parentComponent={'homepage'} />
            </div>
        )
    }
}
