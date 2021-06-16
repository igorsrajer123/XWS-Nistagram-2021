import React, { Component } from 'react';
import './userProfile.css';
import Topbar from './../../sharedComponents/topbar/Topbar';
import ProfilePicture from './../../assets/noPicture.jpg';
import CoverPicture from './../../assets/wallpaper.webp';
import Feed from './../../sharedComponents/feed/Feed';
import LoginService from './../../services/loginService';
import Sidebar from './../../sharedComponents/sidebar/Sidebar';
import FollowService from './../../services/followService';
import UserService from './../../services/userService';
import Rightbar from './../../sharedComponents/rightbar/Rightbar';

export default class UserProfile extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            description: "",
            numberOfFollowers: 0,
            numberOfFollowings: 0,
            coverPhoto: null,
            profilePhoto: null,
            currentUserId: null
        }

        this.clickOnName = this.clickOnName.bind(this);
    }

    clickOnName = () => window.location.reload();

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser();
        
        if(currentUser == null){
            window.location.href = "/";
        }else{
            this.setState({currentUserId: currentUser.id});
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
                this.setState({numberOfFollowers: followers.length});
            }

            const data = await UserService.getUserCoverPhoto(currentUser.coverImageId);
            if(data == null)
                this.setState({coverPhoto: CoverPicture});
            else
            this.setState({coverPhoto: data});
            
            

            const data2 = await UserService.getUserProfilePhoto(currentUser.profileImageId);
            if(data2 == null)
                this.setState({profilePhoto: ProfilePicture});
            else
            this.setState({profilePhoto: data2});
        }
    }

    render() {
        return (
            <div>
                <Topbar parentComponent={'userProfile'} />
                <iframe name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
                <div className="profile">
                    <div className="profileRight">
                        <div className="profileRightTop">
                            <div className="profileCover">
                                <img src={this.state.coverPhoto} alt="No picture..." className="profileCoverImg"/>
                                <img src={this.state.profilePhoto} alt="" className="profileUserImg"/>
                                <form className="form" action={"http://localhost:8000/api/user/saveCoverPhoto/" + this.state.currentUserId} target="dummyframe" enctype="multipart/form-data" method="POST">
                                    <input type="file" name="file" />
                                    <input type="submit" value="Save Cover Photo" className="submit" onClick={this.clickOnName} />
                                </form>
                                <form className="form" action={"http://localhost:8000/api/user/saveProfilePhoto/" + this.state.currentUserId} target="dummyframe" enctype="multipart/form-data" method="POST">
                                    <input type="file" name="file" />
                                    <input type="submit" value="Save Profile Photo" className="submit" onClick={this.clickOnName} />
                                </form>
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
                            <Rightbar />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
