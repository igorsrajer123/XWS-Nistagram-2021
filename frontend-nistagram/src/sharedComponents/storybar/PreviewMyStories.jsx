import React, { Component } from 'react';
import './previewMyStories.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import StoryService from './../../services/storyService';
import UserService from './../../services/userService';
import PostService from './../../services/postService';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export default class PreviewMyStories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            currentUserStories: [],
            objects: [],
            randomId: ""
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
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            const stories = await StoryService.getUserStories(currentUser.id);
            if(stories != null){
                this.setState({currentUserStories: stories});
                this.setUserStories();
            }
        }
    }

    async setUserStories() {
        var obj = [];
        await Promise.all(this.state.currentUserStories.map(async s => {
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
                tags: s.tags
            }
            obj.push(tempObjects);
            this.setState({objects: obj});
            this.setState({randomId: tempObjects.id});
        }));
    }

    setObjects(){
        if(this.state.objects != null) {
            return this.state.objects.map(s => (
                <div key={s.id} className="viewAllMyStories">
                    <img alt="some pic..." src={s.photo} className="myStoryImage"/>
                    <div className="myStoryInfo">
                        <div className="storyInfoItem">
                            <span style={{fontWeight: 'bold', fontSize: '20px'}} className="wrum"><b>{s.user}</b></span>
                            <span className="wrum">{s.date}</span>   
                            <input class="star" type="checkbox" style={{display: 'flex'}}/>
                        </div>
                        <span className="storyInfoItem" className="wrum">{s.description}</span>
                        <div className="storyInfoItem">
                            <LocationOnIcon  htmlColor="green"/>
                            <span className="wrum">{s.location}</span>
                        </div>
                        <div className="storyInfoItem">
                            {s.tags.map(t => 
                                <b><span key={t} style={{color: 'dodgerblue'}} className="wrum">{t}</span></b>
                            )}
                        </div>
                    </div>
                </div>
            ))
        }

        return <div></div>
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="viewMyStoriesModal">
                <this.setObjects />
            </Modal>
        )
    }
}
