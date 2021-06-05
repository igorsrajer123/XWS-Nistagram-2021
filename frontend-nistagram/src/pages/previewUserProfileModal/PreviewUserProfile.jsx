import React, { Component } from 'react';
import Modal from 'react-modal';
import './previewUserProfile.css';
import ProfilePicture from './../../assets/noPicture.jpg';
import CoverPicture from './../../assets/2.jpg';
import Sidebar from './../../sharedComponents/sidebar/Sidebar';  
import UserService from '../../services/userService';
import FollowService from '../../services/followService';
import LoginService from '../../services/loginService';

export default class PreviewUserProfile extends Component {
    constructor(props){
		super(props);

		this.state = {
			isOpen: false,
            userEmail: "",
            userFirstName: "",
            userLastName: "",
            userLocation: "",
            userAge: "",
            userGender: "",
            userWebsite: "",
            userDescription: "",
            userPhone: "",
            userId: 0,
            privateProfile: false,
            numberOfFollowings: 0,
            numberOfFollowers: 0,
            publicSearch: true,
            followingSelectedUser: false,
            followButtonText: "Follow",
            followRequestSent: false,
            showFeedAndSidebar: true
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.followUserClick = this.followUserClick.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async followUserClick() {
        const myUser = await UserService.getUserById(this.props.userId);
        const currentUser = await LoginService.getCurrentUser();

        if(!this.state.followingSelectedUser){
            const response = await FollowService.followUser(currentUser.id, myUser.id);

            if(response.status == 200){
                this.setState({followingSelectedUser: true});
                this.setState({followButtonText: "Unfollow"});
                this.setState({numberOfFollowers: this.state.numberOfFollowers + 1});
            }

            if(response.status == 201){
                this.setState({followRequestSent: true});
                this.setState({followButtonText: "Request Sent"});
            }
        }else {
            this.setState({followingSelectedUser: false});
            this.setState({followButtonText: "Follow"});
            this.setState({numberOfFollowers: this.state.numberOfFollowers - 1});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.userId != this.props.userId){
            const myUser = await UserService.getUserById(this.props.userId);

            this.setState({followRequestSent: false});
            this.setState({userId: this.props.userId});
            this.setState({userEmail: myUser.email});
            this.setState({userFirstName: myUser.firstName});
            this.setState({userLastName: myUser.lastName});
            this.setState({userAge: myUser.age});
            this.setState({userGender: myUser.gender});
            this.setState({userWebsite: myUser.website});
            this.setState({userLocation: myUser.location});
            this.setState({userPhone: myUser.phoneNumber});
            this.setState({userDescription: myUser.description});
            this.setState({privateProfile: myUser.privateProfile});
            this.setState({showFeedAndSidebar: true});

            const followings = await FollowService.getUserFollowings(this.props.userId)
            if(followings == null){
                this.setState({numberOfFollowings: 0});
            }else{
                this.setState({numberOfFollowings: followings.length});
            }

            const followers = await FollowService.getUserFollowers(this.props.userId)
            if(followers == null){
                this.setState({numberOfFollowers: 0});
            }else {
                this.setState({numberOfFollowers: followers.length});

            }

            console.log(this.state.privateProfile)
            const queryParams = new URLSearchParams(window.location.search);
            const publ = queryParams.get('public');

            if(publ == 'true')
                this.setState({publicSearch: true});
            else
                this.setState({publicSearch: false});

            const currentUser = await LoginService.getCurrentUser();
            if(currentUser == null && publ == 'false')
                window.location.href = "/";

            //check if I'm following this user
            var followingUser = false;
            if(currentUser != null){
                const currentUserFollowings = await FollowService.getUserFollowings(currentUser.id);
                for (var i = 0; i < currentUserFollowings.length; ++i) {
                    if(this.props.userId == currentUser.id){
                        this.setState({publicSearch: true});
                        break;
                    }

                    if(currentUserFollowings[i].id == this.props.userId && this.props.userId != currentUser.id) {
                        followingUser = true;
                        break;
                    }
                }
            }

            if(followingUser){
                this.setState({followButtonText: "Unfollow"});
                this.setState({followingSelectedUser: true});
            }else{
                this.setState({followButtonText: "Follow"});
                this.setState({followingSelectedUser: false});
            }

            //follow requests setting up
            const followRequests = await FollowService.getFollowRequests(this.props.userId);
            if(followRequests != null){
                for(var i = 0; i < followRequests.length; ++i){
                    if(followRequests[i].sentById == currentUser.id &&
                        followRequests[i].sentToId == this.props.userId){
                            this.setState({followRequestSent: true});
                            this.setState({followButtonText: "Request Sent"});
                    }
                }
            }

            if(this.state.privateProfile && !this.state.followingSelectedUser){
                this.setState({showFeedAndSidebar: false});
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="previewUserModal">
                <div className="previewProfile">
                    <div className="previewProfileTop">
                        <div className="previewProfileCover">
                            <img src={CoverPicture} alt="" className="previewCoverImage"/>
                            <img src={ProfilePicture} alt="" className="previewProfileImage"/>
                        </div>
                    </div>
                    <div className="previewProfileCenter">
                            <h4 className="previewProfileName">{this.state.userFirstName} {this.state.userLastName}</h4>
                            <span className="previewProfileDescription">{this.state.userDescription}</span>
                            <div className="previewFollowings">
                                <span className="previewFollowing"><b>Following:</b> {this.state.numberOfFollowings}</span>
                                <span className="previewFollowers"><b>Followers:</b> {this.state.numberOfFollowers}</span>
                                <button className="previewFollow" style={{display: this.state.publicSearch ? 'none' : 'block',
                                                                backgroundColor: this.state.followingSelectedUser ? 'red' : 'lime',
                                                                pointerEvents: this.state.followRequestSent ? 'none' : 'auto',
                                                                cursor: this.state.followRequestSent ? 'not-allowed' : 'pointer'}} onClick={this.followUserClick}>{this.state.followButtonText}</button>
                            </div>
                    </div>
                    <div className="previewProfileBottom">
                        <div className="previewSidebar" style={{display: this.state.showFeedAndSidebar ? 'block' : 'none'}}>
                            <Sidebar parentComponent={'previewProfile'} userId={this.state.userId} />
                        </div>
                        <div className="previewFeed">
                            <div className="privateProfile" style={{display: this.state.showFeedAndSidebar ? 'none' : 'block'}}>This Profile is Private!</div>
                            <div className="previewPosts" style={{display: this.state.showFeedAndSidebar ? 'block' : 'none'}}>
                                
                            </div>
                        </div>                   
                    </div>
                </div>
            </Modal>
        )
    }
}
