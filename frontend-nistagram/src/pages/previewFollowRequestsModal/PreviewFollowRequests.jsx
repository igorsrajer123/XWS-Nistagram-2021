import React, { Component } from 'react';
import Modal from 'react-modal';
import './previewFollowRequests.css';
import ProfilePicture from './../../assets/noPicture.jpg';
import FollowService from '../../services/followService';
import LoginService from '../../services/loginService';
import UserService from './../../services/userService';

export default class PreviewFollowRequests extends Component {
    constructor(props){
		super(props);

		this.state = {
			isOpen: false,
            userRequests: [],
            followSenders: []
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getFollowSenders = this.getFollowSenders.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
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
            const requests = await FollowService.getFollowRequests(currentUser.id);
            if(requests.length != 0){
                this.setState({userRequests: requests});
                this.getFollowSenders();
            }
        }
    }

    async acceptRequest(senderId) {
        console.log("Request Accepted!");
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            await FollowService.acceptRequest(currentUser.id, senderId);
            window.location.reload();
        }  
    }

    async declineRequest(senderId) {
        console.log("Request Declined!");
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            await FollowService.declineRequest(currentUser.id, senderId);
            window.location.reload();
        }
    }
    
    GetFollowRequests = () => {
        if(this.state.followSenders.length != 0){
            return this.state.followSenders.map(u =>
                <div className="followRequestBar" key={u.id}>
                    <img src={ProfilePicture}  alt="" className="userImage"/>
                    <span className="userFirstAndLastName"><b>{u.firstName} {u.lastName} ({u.location})</b></span>
                    <button className="acceptRequest" onClick={() => this.acceptRequest(u.id)}>Accept</button>
                    <button className="declineRequest" onClick={() => this.declineRequest(u.id)}>Decline</button>
                </div>
            );
        }
    }

    //asinhroni pozivi u map metodi 
    async getFollowSenders(){
        if(this.state.userRequests.length > 0){
            await Promise.all(this.state.userRequests.map(async r => {
                const sentBy = await UserService.getUserById(r.sentById);
                this.setState({sentBy: this.state.followSenders.push(sentBy)});
            }));
        }else {
            console.log("No requests found!");
            return <div>No Requests Found!</div>
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="previewFollowRequestsModal">
                <this.GetFollowRequests />
            </Modal>
        )
    }
}
