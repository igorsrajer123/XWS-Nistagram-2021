import React, { Component } from 'react';
import './post.css';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ProfilePicture from './../../assets/noPicture.jpg';
import PostPicture from './../../assets/witchKing.jpg';
import LikeIcon from './../../assets/like.png';
import UserService from './../../services/userService';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PostService from './../../services/postService';

export default class Post extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            isLiked: false,
            postDescription: "",
            postUserFirstName: "",
            postUserLastName: "",
            postDate: null,
            postTags: [],
            postLocation: "",
            likes: 0,
            hideBottomPart: false,
            profilePhoto: "",
            postPhotoId: 0,
            postPhoto: null
        };
    
        this.likeHandler = this.likeHandler.bind(this);
    }

    async likeHandler() {
        this.setState({likes: this.state.isLiked ? this.state.likes - 1 : this.state.likes + 1});
        this.setState({isLiked: this.state.isLiked ? false : true});

        if(!this.state.isLiked){
            await PostService.likePost(this.props.post.id);
        }else{
            await PostService.dislikePost(this.props.post.id);
        }
    }

    async componentDidMount() {
        this.setState({postDescription: this.props.post.description});
        const someDate = this.props.post.published;
        var dateFormat = require("dateformat");
        this.setState({postDate: dateFormat(someDate, "mmmm dS yyyy, h:MM TT")});
        this.setState({postTags: this.props.post.tags});
        this.setState({postLocation: this.props.post.location});
        this.setState({likes: this.props.post.likes});
        this.setState({postPhotoId: this.props.post.imageID});

        const user = await UserService.getUserById(this.props.post.userRefer)
        if(user != null){
            this.setState({postUserFirstName: user.firstName});
            this.setState({postUserLastName: user.lastName});

            const data = await UserService.getUserProfilePhoto(user.profileImageId);
            this.setState({profilePhoto: data});
        }

        if(this.props.parentComponent == "Search"){
            this.setState({hideBottomPart: true});
        }else {
            this.setState({hideBottomPart: false});
        }

        const data = await PostService.getPostPhoto(this.props.post.imageID);
        if(data != null){
            this.setState({postPhotoId: this.props.post.imageID});
            this.setState({postPhoto: data});
        }
    }

    render() {
        return (
            <div className="post">
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <img className="postProfileImg" src={this.state.profilePhoto} alt="" />
                            <span className="postUsername">{this.state.postUserFirstName} {this.state.postUserLastName}</span>
                            <span className="postDate">{this.state.postDate}</span>
                        </div>
                        <div className="postTopRight">
                            <MoreVertIcon />
                        </div>
                    </div>
                    <div className="postCenter">
                        <span className="postText">{this.state.postDescription}</span><br/><br/>
                        <LocationOnIcon  htmlColor="green"/>
                        <span className="postLocation">{this.state.postLocation}</span><br/><br/>
                        {this.state.postTags.map(t => 
                            <b><span key={t} style={{color: 'dodgerblue'}} className="postTag">{t}</span></b>
                        )}
                        <img className="postImg" src={this.state.postPhoto} style={{display: this.state.postPhotoId == 0 ? 'none' : 'block'}} alt="" />
                    </div>
                    <div className="postBottom" >
                        <div className="postBottomLeft">
                            <img className="likeIcon" src={LikeIcon} onClick={this.likeHandler} alt="" style={{visibility: this.state.hideBottomPart ? 'hidden' : 'visible'}} />
                            <span className="postLikeCounter">{this.state.likes} people likes this!</span>
                        </div>
                        <div className="postBottomRight" style={{visibility: this.state.hideBottomPart ? 'hidden' : 'visible'}}>
                            <span className="postCommentText">0 comments</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
