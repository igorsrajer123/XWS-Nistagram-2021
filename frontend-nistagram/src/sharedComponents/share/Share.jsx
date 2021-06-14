import React, { Component } from 'react';
import './share.css';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ProfilePicture from './../../assets/noPicture.jpg';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';
import UserService from './../../services/userService';

export default class Share extends Component {
    constructor(props){
        super(props);

        this.state = {
            descriptionText: "",
            tags: "",
            showTagOption: false,
            location: "",
            showLocationOption: false,
            profilePhoto: null,
            currentUserId: 0
        }

        this.descriptionInputChange = this.descriptionInputChange.bind(this);
        this.clickTagOption = this.clickTagOption.bind(this);
        this.clickLocationOption = this.clickLocationOption.bind(this);
        this.locationInputChange = this.locationInputChange.bind(this);
        this.tagInputChange = this.tagInputChange.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
            if(currentUser != null){
                const data = await UserService.getUserProfilePhoto(currentUser.profileImageId);
                this.setState({profilePhoto: data});
                this.setState({currentUserId: currentUser.id});
            }
    }

    descriptionInputChange = (event) => this.setState({descriptionText: event.target.value});

    clickTagOption = () => this.setState({showTagOption: this.state.showTagOption ? false : true});

    clickLocationOption = () => this.setState({showLocationOption: this.state.showLocationOption ? false : true});

    locationInputChange = (event) => this.setState({location: event.target.value});

    tagInputChange = (event) => this.setState({tags: event.target.value});

    render() {
        return (
            <div className="share">
                <div className="shareWrapper">
                    <form action={"http://localhost:8000/api/post/createStatusPost"} enctype="multipart/form-data" method="POST">
                        <div className="shareTop">
                            <img src={this.state.profilePhoto} alt="" className="shareProfileImg" />
                            <input
                                placeholder="What's on your mind?"
                                type="text"
                                className="shareInput"
                                onChange={this.descriptionInputChange}
                                name="description"
                                id="description"
                            />
                            <input style={{display: 'none'}} name="user" id="user" value={this.state.currentUserId} />
                        </div>
                        <hr className="shareHr"/>
                        <div className="shareCenter">
                            <input className="tagShareInput" onChange={this.tagInputChange} name="tags" id="tags" style={{display: this.state.showTagOption ? 'block' : 'none'}}></input>
                            <input className="locationShareInput" onChange={this.locationInputChange} name="location" id="location" style={{display: this.state.showLocationOption ? 'block' : 'none'}} placeholder="Location..."></input>
                        </div>
                        <div className="shareBottom">
                            <div className="shareOptions">
                                <div className="shareOption">
                                    <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                                    <input type="file" name="file" className="photoOrVideo" />
                                </div>
                                <div className="shareOption">
                                    <LabelIcon htmlColor="blue" className="shareIcon"/>
                                    <span className="shareOptionText" onClick={this.clickTagOption}>Tag</span>
                                </div>
                                <div className="shareOption">
                                    <LocationOnIcon htmlColor="green" className="shareIcon"/>
                                    <span className="shareOptionText"onClick={this.clickLocationOption}>Location</span>
                                </div>
                                <div className="shareOption">
                                    <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon"/>
                                    <span className="shareOptionText">Feelings</span>
                                </div>
                            </div>
                            <input type="submit" value="Share" className="shareButton" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
