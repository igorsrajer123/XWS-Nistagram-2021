import React, { Component } from 'react';
import './storybar.css';
import NewStory from './../../sharedComponents/storybar/NewStory';
import LoginService from './../../services/loginService';
import StoryService from './../../services/storyService';
import PostService from './../../services/postService';
import UserService from './../../services/userService';
import PreviewStory from './PreviewStory';

export default class Storybar extends Component {
    constructor() {
        super();

        this.state = {
            currentUserId: 0,
            currentUserStories: [],
            objects: [],
            randomId: ""
        }

        this.newStory = React.createRef();
        this.previewStory = React.createRef();
        
        this.previewStoryModal = this.previewStoryModal.bind(this);
        this.setObjects = this.setObjects.bind(this);
        this.setUserStories = this.setUserStories.bind(this);
    }

    addNewStoryModal = () => this.newStory.current.toggleModal();

    previewStoryModal(storyId) { 
        this.setState({randomId: storyId});
        this.previewStory.current.toggleModal(); 
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            this.setState({currentUserId: currentUser.id});
            const userStories = await StoryService.showHomepageStories(currentUser.id);
            if(userStories.length > 0){
                this.setState({currentUserStories: userStories});
                this.setUserStories();
            }
        }
    }   

    async setUserStories() {
        var obj = [];
        await Promise.all(this.state.currentUserStories.map(async s => {
            const user = await UserService.getUserById(s.userRefer);
            const photo = await PostService.getPostPhoto(s.imageID);
            var tempObjects = {
                id: s.id,
                user: user.firstName + " " + user.lastName,
                photo: photo
            }
            obj.push(tempObjects);
            this.setState({objects: obj});
            this.setState({randomId: tempObjects.id});
        }));
    }

    setObjects() {
        if(this.state.objects != null) {
            return this.state.objects.map(s => (
                <div key={s.id} className="storiesBla">
                    <span className="storyPublisherName">{s.user}</span>
                    <img alt="some pic..." src={s.photo} className="storiesImages" onClick={() => this.previewStoryModal(s.id)}/>
                </div>
            ))
        }

        return <div></div>
    }
    render() {
        return (
            <div className="storybar">
                <div className="storybarWrapper">
                    <div className="newStory">
                        <button className="publishStory" onClick={this.addNewStoryModal}>+</button>
                    </div>
                    <div className="previewStories">
                        <this.setObjects />
                        <NewStory ref={this.newStory} />
                        <PreviewStory ref={this.previewStory} storyId={this.state.randomId} />
                    </div>
                </div>

            </div>
        )
    }
}
