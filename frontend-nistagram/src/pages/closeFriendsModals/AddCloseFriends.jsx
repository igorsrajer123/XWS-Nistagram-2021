import React, { Component } from 'react';
import './addCloseFriends.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';
import FollowService from './../../services/followService';

export default class AddCloseFriends extends Component {
    constructor(){
        super();

        this.state = {
			isOpen: false,
            chooseFrom: []
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser()
        var chooseFromNow = [];
        if(currentUser != null){
            var closeFriends = await UserService.getUserCloseFriends(currentUser.id);
            const userFollowings = await FollowService.getUserFollowings(currentUser.id);
            if(closeFriends == null)
                closeFriends = [];
                
            if(userFollowings != null){
                chooseFromNow = userFollowings.filter(el => {
                    return !closeFriends.find(obj => {
                        return el.id == obj;
                    });
                });
                this.setState({chooseFrom: chooseFromNow});
            }else
                this.setState({chooseFrom: []});
        }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async addCloseFriend(userId) {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser != null){
            await UserService.addCloseFriend(userId, currentUser.id);
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="addCloseFriendsModal">
                <div className="addCloseFriendsWrapper">
                    <p className="addCloseFriendsHeader">Add Close Friends</p>
                    {this.state.chooseFrom.map( c => (
                        <div key={c.id} className="addOneCloseFriend">
                            <span style={{color: 'dodgerblue'}}>{c.firstName} {c.lastName}</span>
                            <button className="addCloseFriend" onClick={()=> this.addCloseFriend(c.id)}>Add!</button>
                        </div>
                    ))}
                    <span style={{display: this.state.chooseFrom.length > 0 ? 'none' : 'block'}}className="noCloseFriends">No Users Available!</span>
                </div>
            </Modal>
        )
    }
}
