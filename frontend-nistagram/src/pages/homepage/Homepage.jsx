import React, { Component } from 'react';
import './homepage.css';
import Topbar from './../../sharedComponents/topbar/Topbar';
import Feed from './../../sharedComponents/feed/Feed';
import LoginService from './../../services/loginService';

export default class Homepage extends Component {
    
    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser == null)
            window.location.href = "/";
    }

    render() {
        return (
            <div className="homepageWrapper">
                <Topbar parentComponent={'homePage'} />
                <Feed parentComponent={'homepage'} />
            </div>
        )
    }
}
