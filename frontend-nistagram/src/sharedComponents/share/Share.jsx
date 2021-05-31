import React, { Component } from 'react';
import './share.css';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ProfilePicture from './../../assets/noPicture.jpg';

export default class Share extends Component {
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
                        />
                    </div>
                    <hr className="shareHr"/>
                    <div className="shareBottom">
                        <div className="shareOptions">
                            <div className="shareOption">
                                <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                                <span className="shareOptionText">Photo or Video</span>
                            </div>
                            <div className="shareOption">
                                <LabelIcon htmlColor="blue" className="shareIcon"/>
                                <span className="shareOptionText">Tag</span>
                            </div>
                            <div className="shareOption">
                                <LocationOnIcon htmlColor="green" className="shareIcon"/>
                                <span className="shareOptionText">Location</span>
                            </div>
                            <div className="shareOption">
                                <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon"/>
                                <span className="shareOptionText">Feelings</span>
                            </div>
                        </div>
                        <button className="shareButton">Share</button>
                    </div>
                </div>
            </div>
        )
    }
}
