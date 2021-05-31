import React, { Component } from 'react';
import './homepage.css';
import Topbar from './../../sharedComponents/topbar/Topbar';

export default class Homepage extends Component {
    render() {
        return (
            <div>
                <Topbar parentComponent={'homepage'} />
            </div>
        )
    }
}
