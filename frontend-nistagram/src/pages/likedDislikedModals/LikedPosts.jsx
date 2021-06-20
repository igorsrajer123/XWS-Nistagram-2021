import React, { Component } from 'react';
import './likedPosts.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';
import Post from './../../sharedComponents/post/Post';

export default class LikedPosts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            likedPosts: []
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        var likedPosts = [];
        if(currentUser != null){
            const userLikedPosts = await PostService.getLikedPosts(currentUser.id);
            if(userLikedPosts != null){
                for(var i = 0; i < userLikedPosts.length; ++i){
                    var likedPost = await PostService.getPostById(userLikedPosts[i]);
                    likedPosts.push(likedPost);
                    this.setState({likedPosts: likedPosts});
                }
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="viewLikedPostsModal">
                <div className="likedPostsWrapper">
                    {this.state.likedPosts.map( p => (
                                <div>
                                    <Post key={p.id} post={p} parentComponent="LikedPosts" />
                                </div>
                    ))}
                    <span style={{display: this.state.likedPosts.length > 0 ? 'none' : 'block'}} className="noFavouritePosts">No Liked Posts!</span>
                </div>
            </Modal>
        )
    }
}
