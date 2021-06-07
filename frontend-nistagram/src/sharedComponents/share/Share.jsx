import React, { Component } from 'react';
import './share.css';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ProfilePicture from './../../assets/noPicture.jpg';
import LoginService from './../../services/loginService';
import PostService from './../../services/postService';

export default class Share extends Component {
    constructor(props){
        super(props);

        this.state = {
            descriptionText: "",
            tags: "",
            showTagOption: false,
            location: "",
            showLocationOption: false
        }

        this.descriptionInputChange = this.descriptionInputChange.bind(this);
        this.createNewPost = this.createNewPost.bind(this);
        this.clickTagOption = this.clickTagOption.bind(this);
        this.clickLocationOption = this.clickLocationOption.bind(this);
        this.locationInputChange = this.locationInputChange.bind(this);
        this.tagInputChange = this.tagInputChange.bind(this);
    }

    descriptionInputChange = (event) => this.setState({descriptionText: event.target.value});

    clickTagOption = () => this.setState({showTagOption: this.state.showTagOption ? false : true});

    clickLocationOption = () => this.setState({showLocationOption: this.state.showLocationOption ? false : true});

    locationInputChange = (event) => this.setState({location: event.target.value});

    tagInputChange = (event) => this.setState({tags: event.target.value});

    async createNewPost() {
        
        const user = await LoginService.getCurrentUser();
        if(user != null){
            const tagsString = this.state.tags;
            const tagsArray = tagsString.split(' ');

            const object = {
                description: this.state.descriptionText,
                userRefer: user.id,
                location: this.state.location,
                tags: tagsArray
            };

            const post = await PostService.createStatusPost(object);
        }else {
            window.location.href = "/";
        }
    }

    render() {
        return (
            <div className="share">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img src={ProfilePicture} alt="" className="shareProfileImg" />
                        <input
                        placeholder="What's on your mind?"
                        type="text"
                        className="shareInput"
                        onChange={this.descriptionInputChange}
                        />
                    </div>
                    <hr className="shareHr"/>
                    <div className="shareCenter">
                        <input className="tagShareInput" onChange={this.tagInputChange} style={{display: this.state.showTagOption ? 'block' : 'none'}}></input>
                        <input className="locationShareInput" onChange={this.locationInputChange} style={{display: this.state.showLocationOption ? 'block' : 'none'}} placeholder="Location..."></input>
                    </div>
                    <div className="shareBottom">
                        <div className="shareOptions">
                            <div className="shareOption">
                                <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                                <span className="shareOptionText">Photo or Video</span>
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
                        <button className="shareButton" onClick={this.createNewPost}>Share</button>
                    </div>
                </div>
            </div>
        )
    }
}
