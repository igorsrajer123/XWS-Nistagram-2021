import React, { Component } from 'react';
import './feed.css';
import Share from './../share/Share';
import Post from './../post/Post';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';
import UserService from './../../services/userService';

export default class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showShareOption: false,
            userPosts: []
        }
    }

    async componentDidMount() {
        if(this.props.parentComponent == 'userProfile'){
            this.setState({showShareOption: true});

            const currentUser = await LoginService.getCurrentUser();
            if(currentUser != null){
                const userPosts = await PostService.getUserPosts(currentUser.id);
                if(userPosts != null){
                    this.setState({userPosts: userPosts});
                }
            }
        }else if(this.props.parentComponent == 'previewUser'){
            this.setState({showShareOption: false});

            const user = await UserService.getUserById(this.props.userId);
            if(user != null){
                const userPosts = await PostService.getUserPosts(user.id);
                if(userPosts != null){
                    this.setState({userPosts: userPosts});
                }
            }
        }
    }

    render() {
        return (
            <div className="feed">
                <div className="feedWrapper">
                    <div className="shareDiv" style={{display: this.state.showShareOption ? 'block' : 'none'}}>
                        <Share />  
                    </div>
                    <div className="posts">
                        {this.state.userPosts.map( p => (
                            <Post key={p.id} post={p} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
