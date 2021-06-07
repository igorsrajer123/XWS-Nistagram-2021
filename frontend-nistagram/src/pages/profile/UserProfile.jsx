import React, { Component } from 'react';
import './userProfile.css';
import Topbar from './../../sharedComponents/topbar/Topbar';
import ProfilePicture from './../../assets/noPicture.jpg';
import CoverPicture from './../../assets/wallpaper.webp';
import Feed from './../../sharedComponents/feed/Feed';
import LoginService from './../../services/loginService';
import Sidebar from './../../sharedComponents/sidebar/Sidebar';
import FollowService from './../../services/followService';

export default class UserProfile extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            description: "",
            numberOfFollowers: 0,
            numberOfFollowings: 0
        }

        this.clickOnName = this.clickOnName.bind(this);
    }

    clickOnName = () => window.location.reload();

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser();
        
        if(currentUser == null){
            window.location.href = "/";
        }else{
            this.setState({firstName: currentUser.firstName});
            this.setState({lastName: currentUser.lastName});
            this.setState({description: currentUser.description});

            const followings = await FollowService.getUserFollowings(currentUser.id);
            if(followings == null){
                this.setState({numberOfFollowings: 0});
            }else{
                this.setState({numberOfFollowings: followings.length});
            }

            const followers = await FollowService.getUserFollowers(currentUser.id);
            if(followers == null){
                this.setState({numberOfFollowers: 0});
            }else {
                this.setState({numberOfFollowers: 5});
            }
        }
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
                            <h4 className="profileInfoName" onClick={this.clickOnName}>{this.state.firstName} {this.state.lastName}</h4>
                            <span className="profileInfoDescription">{this.state.description}</span>
                            <span className="previewFollowing"><b>Following:</b> {this.state.numberOfFollowings}</span>
                            <span className="previewFollowers"><b>Followers:</b> {this.state.numberOfFollowers}</span>
                        </div>
                        <div className="profileRightBottom">
                            <Sidebar parentComponent={'userProfile'}/>
                            <Feed parentComponent={'userProfile'} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
