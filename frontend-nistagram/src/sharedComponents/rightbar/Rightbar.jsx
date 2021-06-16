import React, { Component } from 'react'
import './rightbar.css';
import FavouritePosts from './../../pages/favouritePostsModal/FavouritePosts';
import ViewCloseFriends from './../../pages/closeFriendsModals/ViewCloseFriends';
import AddCloseFriends from './../../pages/closeFriendsModals/AddCloseFriends';

export default class Rightbar extends Component {
    constructor(props) {
        super(props);

        this.favouritePosts = React.createRef();
        this.viewCloseFriends = React.createRef();
        this.addCloseFriends = React.createRef();
    }

    favouritePostsModal = () => this.favouritePosts.current.toggleModal();

    viewCloseFriendsModal = () => this.viewCloseFriends.current.toggleModal();

    addCloseFriendsModal = () => this.addCloseFriends.current.toggleModal();

    render() {
        return (
            <div className="rightbar">
                <span className="rightbarItem" onClick={this.favouritePostsModal}>View Favourite Posts</span>
                <span className="rightbarItem" onClick={this.viewCloseFriendsModal}>View Close Friends</span>
                <span className="rightbarItem" onClick={this.addCloseFriendsModal}>Add Close Friends</span>
                <span className="rightbarItem">Liked Posts</span>
                <span className="rightbarItem">Disliked Posts</span>
                <span className="rightbarItem">Account Options</span>
                <div>
                    <FavouritePosts ref={this.favouritePosts}/>
                    <ViewCloseFriends ref={this.viewCloseFriends} />
                    <AddCloseFriends ref={this.addCloseFriends} />
                </div>
            </div>
        )
    }
}
