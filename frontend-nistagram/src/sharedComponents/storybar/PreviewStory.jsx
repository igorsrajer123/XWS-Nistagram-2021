import React, { Component } from 'react';
import './previewStory.css';
import Modal from 'react-modal';
import StoryService from './../../services/storyService';
import PostService from './../../services/postService';
import UserService from './../../services/userService';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FlagIcon from '@material-ui/icons/Flag';
import ReportModal from '../../pages/reportModal/ReportModal';

export default class PreviewStory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            story: null,
            storyPhoto: "",
            storyDate: "",
            storyDescription: "",
            storyLocation: "",
            storyTags: [],
            userName: "",
            randomId: 0
        }

        this.reportStory = React.createRef();

        this.toggleModal = this.toggleModal.bind(this);
        this.flagClick = this.flagClick.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    flagClick = postId => {
        this.setState({randomId: postId});
        this.reportStory.current.toggleModal();
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.storyId != this.props.storyId){
            if(prevProps.storyId != "" && prevProps.storyId != null){
                if(this.props.storyId != null && this.props.storyId != ""){
                    const story = await StoryService.getStory(this.props.storyId);
                    this.setState({story: story});
                    this.setState({storyDescription: story.description});
                    this.setState({storyLocation: story.location});
                    const photo = await PostService.getPostPhoto(this.state.story.imageID);
                    this.setState({storyPhoto: photo});
                    const user = await UserService.getUserById(story.userRefer);
                    this.setState({userName: user.firstName + " " + user.lastName});

                    const someDate = story.published;
                    var dateFormat = require("dateformat");
                    this.setState({storyDate: dateFormat(someDate, "mmmm dS yyyy, h:MM TT")});

                    this.setState({storyTags: story.tags});
                }
            }
        }
    }

    RenderStory = () => {
        if(this.state.story != null){  
            return <div className="previewOneStoryDiv">
                    <img alt="story..." src={this.state.storyPhoto} className="previewOneStory"/>
                    <div className="storyInfoDiv">
                        <div className="storyInfo">
                            <span className="storyItem" style={{fontWeight: 'bold', fontSize: '20px'}}><b>{this.state.userName}</b></span>
                            <span className="storyItem">{this.state.storyDate}</span>
                            <FlagIcon onClick={() => this.flagClick(this.state.story.id)} style={{cursor: 'pointer'}}/>
                            <ReportModal ref={this.reportStory} parentComponent='ReportStory' postId={this.state.randomId} />
                        </div>
                        <span className="storyInfo">{this.state.storyDescription}</span>
                        <div className="storyInfo">
                            <LocationOnIcon  htmlColor="green"/>
                            <span>{this.state.storyLocation}</span>
                        </div>
                        <div className="storyInfo">
                            {this.state.storyTags.map(t => 
                                <b><span key={t} style={{color: 'dodgerblue'}} className="storyItem">{t}</span></b>
                            )}
                        </div>
                    </div>
                </div>
        }

        return <div>

        </div>
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="previewStoryModal">
                <this.RenderStory />
            </Modal>
        )
    }
}
