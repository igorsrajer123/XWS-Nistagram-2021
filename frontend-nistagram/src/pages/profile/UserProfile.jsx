import React, { Component } from 'react';
import './userProfile.css';
import Topbar from './../../sharedComponents/topbar/Topbar';
import ProfilePicture from './../../assets/noPicture.jpg';
import CoverPicture from './../../assets/wallpaper.webp';
import Feed from './../../sharedComponents/feed/Feed';
import LoginService from './../../services/loginService';
import Sidebar from './../../sharedComponents/sidebar/Sidebar';

export default class UserProfile extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            age: 0
        }
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser();
        
        this.setState({email: currentUser.email});
        this.setState({firstName: currentUser.firstName});
        this.setState({lastName: currentUser.lastName});
        this.setState({age: currentUser.age});
        this.setState({phoneNumber: currentUser.phoneNumber});
    }

    render() {
        return (
            <div>
                <Topbar parentComponent={'userProfile'} />
                <div className="profile">
                    <div className="profileRight">
                        <div className="profileRightTop">
                            <div className="profileCover">
                                <img src={CoverPicture} alt="" className="profileCoverImg"/>
                                <img src={ProfilePicture} alt="" className="profileUserImg"/>
                            </div>
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{this.state.firstName} {this.state.lastName}</h4>
                            <span className="profileInfoDescription">Hello My Friends. This is my profile description lmao xD</span>
                        </div>
                        <div className="profileRightBottom">
                            <Sidebar />
                            <Feed />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
