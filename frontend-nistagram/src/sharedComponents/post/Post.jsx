import React, { Component } from 'react';
import './post.css';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FlagIcon from '@material-ui/icons/Flag';
import ProfilePicture from './../../assets/noPicture.jpg';
import PostPicture from './../../assets/witchKing.jpg';
import LikeIcon from './../../assets/like.png';
import DislikeIcon from './../../assets/dislike_PNG73.png';
import UserService from './../../services/userService';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PostService from './../../services/postService';
import LoginService from './../../services/loginService';
import ReportModal from '../../pages/reportModal/ReportModal';

export default class Post extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            isLiked: false,
            isDisliked: false,
            postDescription: "",
            postUserFirstName: "",
            postUserLastName: "",
            postDate: null,
            postTags: [],
            postLocation: "",
            likes: 0,
            dislikes: 0,
            hideBottomPart: false,
            profilePhoto: "",
            currentUserPhoto: "",
            postPhotoId: 0,
            postPhoto: null,
            postComments: null,
            numberOfComments: 0,
            showCommentDiv: false,
            usersCommented: [],
            commentText: "",
            commentButtonVisible: false,
            currentUserId: 0,
            userProfile: false,
            favouritePost: false,
            randomId: 0
        };
    
        this.reportPost = React.createRef();

        this.likeHandler = this.likeHandler.bind(this);
        this.dislikeHandler = this.dislikeHandler.bind(this);
        this.toggleComments = this.toggleComments.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.commentTextChange = this.commentTextChange.bind(this);
        this.postComment = this.postComment.bind(this);
        this.addToFavourites = this.addToFavourites.bind(this);
        this.removeFromFavourites = this.removeFromFavourites.bind(this);
        this.flagClick = this.flagClick.bind(this);
    }

    async likeHandler() {
        this.setState({likes: this.state.isLiked ? this.state.likes - 1 : this.state.likes + 1});
        this.setState({isLiked: this.state.isLiked ? false : true});

        this.setState({dislikes: this.state.isDisliked ? this.state.dislikes - 1 : this.state.dislikes})
        this.setState({isDisliked: false})

        await PostService.likePost(this.props.post.id, this.state.currentUserId);
    }

    async dislikeHandler() {
        this.setState({dislikes: this.state.isDisliked ? this.state.dislikes - 1 : this.state.dislikes + 1});
        this.setState({isDisliked: this.state.isDisliked ? false : true});

        this.setState({likes: this.state.isLiked ? this.state.likes - 1 : this.state.likes});
        this.setState({isLiked: false});

        await PostService.dislikePost(this.props.post.id, this.state.currentUserId);
    }

    toggleComments = () => this.setState({showCommentDiv: this.state.showCommentDiv ? false : true});

    commentTextChange = (event) => this.setState({commentText : event.target.value});

    flagClick = postId => {
        this.setState({randomId: postId});
        this.reportPost.current.toggleModal();
    }

    async postComment() {
        const object = {
            text: this.state.commentText,
            postID: this.props.post.id,
            userID: this.state.currentUserId
        };

        await PostService.postNewComment(object);
        window.location.reload();
    }

    async componentDidMount() {
        this.setState({postDescription: this.props.post.description});
        const someDate = this.props.post.published;
        var dateFormat = require("dateformat");
        this.setState({postDate: dateFormat(someDate, "mmmm dS yyyy, h:MM TT")});
        this.setState({postTags: this.props.post.tags});
        this.setState({postLocation: this.props.post.location});
        this.setState({likes: this.props.post.likes});
        this.setState({dislikes: this.props.post.dislikes});
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

        const currentUser = await LoginService.getCurrentUser()
        if(currentUser != null){
            const currentUserImg = await UserService.getUserProfilePhoto(currentUser.profileImageId)
            this.setState({currentUserPhoto: currentUserImg});
            this.setState({currentUserId: currentUser.id});
            const currentUserLikes = await PostService.getLikedPosts(currentUser.id);
            if(currentUserLikes != null){
                for(var i = 0; i < currentUserLikes.length; i++){
                    if(currentUserLikes[i] == this.props.post.id){
                        this.setState({isLiked: true});
                        break;
                    }
                }
            }

            const currentUserDislikes = await PostService.getDislikedPosts(currentUser.id);
            if(currentUserDislikes != null){
                for(var i = 0; i < currentUserDislikes.length; i++){
                    if(currentUserDislikes[i] == this.props.post.id){
                        this.setState({isDisliked: true});
                        break;
                    }
                }
            }
        }

        const comments = await PostService.getPostComments(this.props.post.id);
        if(comments != null){
            this.setState({postComments: comments});
            this.setState({numberOfComments: comments.length});
        }

        await this.getUsers();
        if(window.location.href.includes("/userProfile")){
            this.setState({userProfile: true});
        }else{
            this.setState({userProfile: false});
        }

        if(currentUser != null){
            const favouritePosts = await PostService.getFavouritePosts(currentUser.id);
            if(favouritePosts != null && favouritePosts.length > 0)
                for(var i = 0; i < favouritePosts.length; i++)
                    if(favouritePosts[i] == this.props.post.id){
                        this.setState({favouritePost: true});
                        break;
                    }
        }
    }

    async getUsers(){
        const users = await UserService.getAllUsers();
        this.setState({usersCommented: users});
    }

    RenderUserName = props => {
        if(this.state.usersCommented.length > 0){
            const users = this.state.usersCommented;
            for(var i = 0; i < users.length; ++i){
                if(users[i].id == props.userId){
                    return <div className="commentUserName"><b>{users[i].firstName} {users[i].lastName}</b></div>
                }
            }
        }
    
        return <div></div>
    }

    async addToFavourites(){
        const currentUser = await LoginService.getCurrentUser()
        if(currentUser != null){
            await PostService.addToFavourites(this.props.post.id, currentUser.id);
            this.setState({favouritePost: true});
        }
    }

    async removeFromFavourites(){
        const currentUser = await LoginService.getCurrentUser()
        if(currentUser != null){
            await PostService.removeFromFavourites(this.props.post.id, currentUser.id);
            this.setState({favouritePost: false});
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
                            <input class="star" type="checkbox" style={{display: this.state.userProfile ? 'flex' : 'none', display: this.props.parentComponent == 'LikedPosts' ? 'none' : 'flex'}}
                                                                checked={this.state.favouritePost ? '' : 'false'} 
                                                                onClick={this.state.favouritePost ? this.removeFromFavourites : this.addToFavourites} />
                            <FlagIcon onClick={() => this.flagClick(this.props.post.id)} style={{cursor: 'pointer'}}/>
                            <ReportModal ref={this.reportPost} parentComponent='ReportPost' postId={this.state.randomId} />
                        </div>
                    </div>
                    <div className="postCenter">
                        <span className="postText">{this.state.postDescription}</span><br/><br/>
                        <LocationOnIcon  htmlColor="green" style={{display: this.state.postLocation == "" ? 'none' : ''}}/>
                        <span className="postLocation" style={{display: this.state.postLocation == "" ? 'none' : ''}}>{this.state.postLocation}</span><br/><br/>
                        {this.state.postTags.map(t => 
                            <b><span key={t} style={{color: 'dodgerblue'}} className="postTag">{t}</span></b>
                        )}
                        <img className="postImg" src={this.state.postPhoto} style={{display: this.state.postPhotoId == 0 ? 'none' : 'block'}} alt="" />
                    </div>
                    <div className="postBottom" >
                        <div className="postBottomLeft">
                            <img className="likeIcon" src={LikeIcon} onClick={this.likeHandler} alt="" style={{visibility: this.state.hideBottomPart ? 'hidden' : 'visible', borderStyle: this.state.isLiked ? 'double' : 'none', borderRadius: '50%'}} />
                            <span className="postLikeCounter">{this.state.likes} people likes this!</span>
                            <img className="dislikeIcon" src={DislikeIcon} onClick={this.dislikeHandler} alt="" style={{visibility: this.state.hideBottomPart ? 'hidden' : 'visible', borderStyle: this.state.isDisliked ? 'double' : 'none', borderRadius: '50%'}} />
                            <span className="postDislikeCounter">{this.state.dislikes} people dislikes this!</span>
                        </div>
                        <div className="postBottomRight" style={{visibility: this.state.hideBottomPart ? 'hidden' : 'visible'}}>
                            <span className="postCommentText" onClick={this.toggleComments}>{this.state.numberOfComments} comments</span>
                        </div>
                    </div>
                    <div className="postComments" style={{display: this.state.showCommentDiv ? 'block' : 'none'}}>
                        <hr/>
                        <span><b>Leave a Comment...</b></span><br/>
                        <div className="newComment">
                            <img className="postProfileImg" src={this.state.currentUserPhoto} alt="" />
                            <div className="helperDivComment">
                                <input type="text" className="newCommentText" placeholder="Comment..." onChange={this.commentTextChange} />
                                <button className="comment" onClick={this.postComment} style={{display: this.state.commentText == "" ? 'none' : ''}}>Comment!</button>
                            </div>
                        </div>
                        <div style={{display: this.state.postComments == null ? 'none' : 'flex',flexDirection: 'column'}}>
                        {this.state.postComments == null ? '' : this.state.postComments.map(c => 
                            <div className="oneComment"style={{margin: '5px'}}>
                                <this.RenderUserName userId={c.userID} />
                                <span key={c.id} className="postComment">{c.text}</span>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
