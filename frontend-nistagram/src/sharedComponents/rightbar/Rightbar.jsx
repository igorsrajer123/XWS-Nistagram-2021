import React, { Component } from 'react'
import './rightbar.css';
import FavouritePosts from './../../pages/favouritePostsModal/FavouritePosts';

export default class Rightbar extends Component {
    constructor(props) {
        super(props);

        this.favouritePosts = React.createRef();
    }

    favouritePostsModal = () => this.favouritePosts.current.toggleModal();

    render() {
        return (
            <div className="rightbar">
                <span className="rightbarItem" onClick={this.favouritePostsModal}>View Favourite Posts</span>
                <span className="rightbarItem">View Close Friends</span>
                <span className="rightbarItem">Add Close Friends</span>
                <span className="rightbarItem">Liked Posts</span>
                <span className="rightbarItem">Disliked Posts</span>
                <span className="rightbarItem">Account Options</span>
                <div>
                    <FavouritePosts ref={this.favouritePosts}/>
                </div>
            </div>
        )
    }
}
