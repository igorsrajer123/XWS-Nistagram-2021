import React, { Component } from 'react';
import Modal from 'react-modal';
import './favouritePosts.css';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';
import Post from './../../sharedComponents/post/Post';

export default class FavouritePosts extends Component {
    constructor(){
        super();

        this.state = {
			isOpen: false,
            favouritePosts: []
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser()
        var actualPosts = [];
        if(currentUser != null){
            const favouritePosts = await PostService.getFavouritePosts(currentUser.id);
            if(favouritePosts != null){
                const userPosts = await PostService.getUserPosts(currentUser.id);
                for(var i = 0; i < userPosts.length; i++){
                    for(var j = 0; j < favouritePosts.length; j++){
                        if(userPosts[i].id == favouritePosts[j]){
                            actualPosts.push(userPosts[i]);
                            this.setState({favouritePosts: actualPosts});
                        }
                    }
                }
            }
        }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="favouritePostsModal">
                <div className="favouritesWrapper">
                    {this.state.favouritePosts.map( p => (
                                <div>
                                    <Post key={p.id} post={p} parentComponent="FavouritePosts" />
                                </div>
                    ))}
                    <span style={{display: this.state.favouritePosts.length > 0 ? 'none' : 'block'}}className="noFavouritePosts">No Favourite Posts Chosen Yet!</span>
                </div>
            </Modal>
        )
    }
}
