import React, { Component } from 'react';
import './newStory.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';

export default class NewStory extends Component {
    constructor(){
        super();

        this.state = {
			isOpen: false,
            currentUserId: null,
            descriptionText: "",
            tags: "",
            location: ""
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.descriptionInputChange = this.descriptionInputChange.bind(this);
        this.locationInputChange = this.locationInputChange.bind(this);
        this.tagInputChange = this.tagInputChange.bind(this);
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser();
            if(currentUser != null){
                this.setState({currentUserId: currentUser.id});
            }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    descriptionInputChange = (event) => this.setState({descriptionText: event.target.value});

    locationInputChange = (event) => this.setState({location: event.target.value});

    tagInputChange = (event) => this.setState({tags: event.target.value});

    publishStory = () => window.location.reload();

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="newStoryModal">
                <iframe name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
                <div className="newStoryWrapper">
                <form action={"http://localhost:8000/api/post/createStory"} target="dummyframe" enctype="multipart/form-data" method="POST" className="storyForm">
                    <input
                            placeholder="Description"
                            type="text"
                            className="storyDescription"
                            name="description"
                            id="description"
                            onChange={this.descriptionInputChange}
                    />
                    <input style={{display: 'none'}} name="user" id="user" value={this.state.currentUserId} />
                    <input className="tagShareStory" name="tags" id="tags" onChange={this.tagInputChange} placeholder="Add some tags..."></input>
                    <input className="locationShareStory" name="location" id="location" onChange={this.locationInputChange} placeholder="Location..."></input>
                    <input type="file" name="file" className="storyPhoto" style={{backgroundColor: 'thistle', borderColor: 'white'}}/>
                    <div className="shareCloseFriends">
                        <span>Share Only for Close Friends: </span>
                        <input type="checkbox" name="closeFriends" id="closeFriends"/>
                    </div>
                    <input type="submit" value="Share" className="shareStoryButton" onClick={this.publishStory}/>
                </form>
                </div>
            </Modal>
        )
    }
}
