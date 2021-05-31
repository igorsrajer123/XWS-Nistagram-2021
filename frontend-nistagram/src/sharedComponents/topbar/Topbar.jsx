import React, { Component } from 'react';
import './topbar.css';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import ProfilePicture from './../../assets/noPicture.jpg';

export default class Topbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parentUserProfile: false
        }

        this.goHome = this.goHome.bind(this);
        this.goToMyProfile = this.goToMyProfile.bind(this);
    }

    goHome = () => window.location.href = "http://localhost:3000/home";

    goToMyProfile = () => window.location.href = "http://localhost:3000/userProfile";

    componentDidMount() {
        if(this.props.parentComponent == 'userProfile')
            this.setState({parentUserProfile: true});
        else
            this.setState({parentUserProfile: false});
    }
    
    render() {
        return (
            <div className="topbarContainer">
                <div className="topbarLeft">
                    <span onClick={this.goHome} className="logo">Ništagram</span>
                </div>
                <div className="topbarCenter">
                    <div className="searchbar">
                        <SearchIcon className="searchIcon" />
                        <input type="text" className="searchInput" placeholder="Search for friend, post or page..." />
                    </div>
                </div>
                <div className="topbarRight">
                    <div className="topbarIcons">
                        <div className="topbarIconItem">
                                <PersonIcon />
                                <span className="topbarIconBadge">10</span>
                        </div>
                        <img src={ProfilePicture} onClick={this.goToMyProfile} style={{visibility: this.state.parentUserProfile ? 'hidden' : 'visible'}} alt="" className="topbarImg"/>
                    </div>
                </div>
            </div>
        )
    }
}
