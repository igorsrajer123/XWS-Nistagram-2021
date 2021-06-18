import React, { Component } from 'react';
import './storybar.css';
import NewStory from './../../sharedComponents/storybar/NewStory';
import LoginService from './../../services/loginService';
import StoryService from './../../services/storyService';
import PostService from './../../services/postService';
import UserService from './../../services/userService';

export default class Storybar extends Component {
    constructor() {
        super();

        this.state = {
            currentUserId: 0,
            currentUserStories: [],
            objects: []
        }

        this.newStory = React.createRef();
    }

    addNewStoryModal = () => this.newStory.current.toggleModal();

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            this.setState({currentUserId: currentUser.id});
            const userStories = await StoryService.showHomepageStories(currentUser.id);
            if(userStories.length > 0){
                var obj = [];
                this.setState({currentUserStories: userStories});
                await Promise.all(userStories.map(async s => {
                    const user = await UserService.getUserById(s.userRefer);
                    const photo = await PostService.getPostPhoto(s.imageID);

                    const tempObjects = {
                        id: s.id,
                        user: user.firstName + user.lastName,
                        photo: photo
                    }
                    obj.push(tempObjects);
                    this.setState({objects: obj});
                }));
            }
        }
    }   

    render() {
        return (
            <div className="storybar">
                <div className="storybarWrapper">
                    <div className="newStory">
                        <button className="publishStory" onClick={this.addNewStoryModal}>+</button>
                    </div>
                    <div className="previewStories">
                        {this.state.objects.map((el, i) => (
                            <div key={i} className="storiesBla">
                                <span className="storyPublisherName">{el.user}</span>
                                <img alt="some pic..." src={el.photo} className="storiesImages"/>
                            </div>
                        ))}
                        <NewStory ref={this.newStory} />
                    </div>
                </div>

            </div>
        )
    }
}
