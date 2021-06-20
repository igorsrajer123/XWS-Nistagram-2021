import React, { Component } from 'react';
import './dislikedPosts.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';
import Post from './../../sharedComponents/post/Post';

export default class DislikedPosts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            dislikedPosts: []
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
        var dislikedPosts = [];
        if(currentUser != null){
            const userDislikedPosts = await PostService.getDislikedPosts(currentUser.id);
            if(userDislikedPosts != null){
                for(var i = 0; i < userDislikedPosts.length; ++i){
                    var dislikedPost = await PostService.getPostById(userDislikedPosts[i]);
                    dislikedPosts.push(dislikedPost);
                    this.setState({dislikedPosts: dislikedPosts});
                }
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="viewDislikedPostsModal">
                <div className="dislikedPostsWrapper">
                    {this.state.dislikedPosts.map( p => (
                                <div>
                                    <Post key={p.id} post={p} parentComponent="LikedPosts" />
                                </div>
                    ))}
                    <span style={{display: this.state.dislikedPosts.length > 0 ? 'none' : 'block'}} className="noFavouritePosts">No Disliked Posts!</span>
                </div>
            </Modal>
        )
    }
}
