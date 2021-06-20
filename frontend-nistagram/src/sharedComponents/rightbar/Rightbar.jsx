import React, { Component } from 'react'
import './rightbar.css';
import FavouritePosts from './../../pages/favouritePostsModal/FavouritePosts';
import ViewCloseFriends from './../../pages/closeFriendsModals/ViewCloseFriends';
import AddCloseFriends from './../../pages/closeFriendsModals/AddCloseFriends';
import PreviewMyStories from './../../sharedComponents/storybar/PreviewMyStories';
import LikedPosts from './../../pages/likedDislikedModals/LikedPosts';
import DislikedPosts from './../../pages/likedDislikedModals/DislikedPosts';
import AccountVerification from './../../pages/accountVerification/AccountVerification';

export default class Rightbar extends Component {
    constructor(props) {
        super(props);

        this.favouritePosts = React.createRef();
        this.viewCloseFriends = React.createRef();
        this.addCloseFriends = React.createRef();
        this.viewMyStories = React.createRef();
        this.likedPosts = React.createRef();
        this.dislikedPosts = React.createRef();
        this.accountVerification = React.createRef();
    }

    favouritePostsModal = () => this.favouritePosts.current.toggleModal();

    viewCloseFriendsModal = () => this.viewCloseFriends.current.toggleModal();

    addCloseFriendsModal = () => this.addCloseFriends.current.toggleModal();

    viewMyStoriesModal = () => this.viewMyStories.current.toggleModal();

    viewLikedPostsModal = () => this.likedPosts.current.toggleModal();

    viewDislikedPostsModal = () => this.dislikedPosts.current.toggleModal();

    accountVerificationModal = () => this.accountVerification.current.toggleModal();

    render() {
        return (
            <div className="rightbar">
                <span className="rightbarItem" onClick={this.favouritePostsModal}>View Favourite Posts</span>
                <span className="rightbarItem" onClick={this.viewCloseFriendsModal}>View Close Friends</span>
                <span className="rightbarItem" onClick={this.addCloseFriendsModal}>Add Close Friends</span>
                <span className="rightbarItem" onClick={this.viewMyStoriesModal}>View My Stories</span>
                <span className="rightbarItem" onClick={this.viewLikedPostsModal}>Liked Posts</span>
                <span className="rightbarItem" onClick={this.viewDislikedPostsModal}>Disliked Posts</span>
                <span className="rightbarItem" onClick={this.accountVerificationModal}>Account Verification</span>
                <span className="rightbarItem">Account Options</span>
                <div>
                    <FavouritePosts ref={this.favouritePosts}/>
                    <ViewCloseFriends ref={this.viewCloseFriends} />
                    <AddCloseFriends ref={this.addCloseFriends} />
                    <PreviewMyStories ref={this.viewMyStories} />
                    <LikedPosts ref={this.likedPosts} />
                    <DislikedPosts ref={this.dislikedPosts} />
                    <AccountVerification ref={this.accountVerification} />
                </div>
            </div>
        )
    }
}
