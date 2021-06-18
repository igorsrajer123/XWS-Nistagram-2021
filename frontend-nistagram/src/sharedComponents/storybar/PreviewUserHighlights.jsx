import React, { Component } from 'react';
import './previewUserHighlights.css';
import Modal from 'react-modal';
import UserService from './../../services/userService';
import StoryService from './../../services/storyService';
import PostService from './../../services/postService';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export default class PreviewUserHighlights extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            userHighlightedStories: [],
            objects: [],
            noStories: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.setUserStories = this.setUserStories.bind(this);
        this.setObjects = this.setObjects.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async componentDidMount() {
        const stories = await StoryService.getUserHighlightedStories(this.props.userId);
        if(stories != null){
            this.setState({userHighlightedStories: stories});
            this.setUserStories();
        }else {
            this.setState({noStories: true});
        }
    }

    async setUserStories() {
        var obj = [];
        var realHighlightedStories = [];
        await Promise.all(this.state.userHighlightedStories.map(async s => {
            const realStory = await StoryService.getStory(s);
            realHighlightedStories.push(realStory);
            this.setState({userHighlightedStories: realHighlightedStories});
        }));

        await Promise.all(realHighlightedStories.map(async s => {
            const user = await UserService.getUserById(s.userRefer);
            const photo = await PostService.getPostPhoto(s.imageID);
            
            const someDate = s.published;
            var dateFormat = require("dateformat");
            var tempObjects = {
                id: s.id,
                user: user.firstName + " " + user.lastName,
                photo: photo,
                description: s.description,
                location: s.location,
                date: dateFormat(someDate, "mmmm dS yyyy, h:MM TT"),
                tags: s.tags,
            }
            obj.push(tempObjects);
            this.setState({objects: obj});
        }));
    }

    setObjects() {
        if(this.state.objects != null) {
            return this.state.objects.map(s => (
                <div key={s.id} className="viewUserHighlightedStories">
                    <img alt="some pic..." src={s.photo} className="highlightedStoryPhoto"/>
                    <div className="highlightedStoryInfo">
                        <div className="highlightedStoryInfoItem">
                            <span style={{fontWeight: 'bold', fontSize: '20px'}} className="wrum"><b>{s.user}</b></span>
                            <span className="wrum">{s.date}</span>   
                        </div>
                        <span className="highlightedStoryInfoItem" className="wrum">{s.description}</span>
                        <div className="highlightedStoryInfoItem">
                            <LocationOnIcon  htmlColor="green"/>
                            <span className="wrum">{s.location}</span>
                        </div>
                        <div className="highlightedStoryInfoItem">
                            {s.tags.map(t => 
                                <b><span key={t} style={{color: 'dodgerblue'}} className="wrum">{t}</span></b>
                            )}
                        </div>
                    </div>
                </div>
            ))
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="previewUserHighlightsModal">
                <this.setObjects />
                <p style={{display: this.state.noStories ? 'block' : 'none',
                        fontSize: '30px', color: 'red', textAlign: 'center',
                        fontFamily: 'fantasy', alignItems: 'center'}}>No highlighted stories!</p>
            </Modal>
        )
    }
}
