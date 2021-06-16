import React, { Component } from 'react';
import './viewCloseFriends.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';
import FollowService from './../../services/followService';

export default class ViewCloseFriends extends Component {
    constructor(){
        super();

        this.state = {
			isOpen: false,
            closeFriends: []
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser()
        var actualCloseFriends = [];
        if(currentUser != null){
            const closeFriends = await UserService.getUserCloseFriends(currentUser.id);
            const userFollowings = await FollowService.getUserFollowings(currentUser.id);
            if(userFollowings != null && closeFriends != null){
                for(var i = 0; i < userFollowings.length; i++){
                    for(var j = 0; j < closeFriends.length; j++){
                        if(closeFriends[j] == userFollowings[i].id){
                            actualCloseFriends.push(userFollowings[i]);
                            this.setState({closeFriends: actualCloseFriends});
                        }
                    }
                }
            }else{
                this.setState({closeFriends: []});
            }
        }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async removeCloseFriend(userId) {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            await UserService.removeCloseFriend(userId, currentUser.id);
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="viewCloseFriendsModal">
                <div className="viewCloseFriendsWrapper">
                    <p className="viewCloseFriendsHeader">Close Friends</p>
                    {this.state.closeFriends.map( c => (
                        <div key={c.id} className="oneCloseFriend">
                            <span style={{color: 'dodgerblue'}}>{c.firstName} {c.lastName}</span>
                            <button className="removeItem" onClick={()=> this.removeCloseFriend(c.id)}>Remove!</button>
                        </div>
                    ))}
                    <span style={{display: this.state.closeFriends.length > 0 ? 'none' : 'block'}}className="noCloseFriends">Please Choose your Close Friends!</span>
                </div>
            </Modal>
        )
    }
}
