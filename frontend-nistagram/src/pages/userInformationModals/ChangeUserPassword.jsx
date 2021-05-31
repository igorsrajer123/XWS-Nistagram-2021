import React, { Component } from 'react';
import Modal from 'react-modal';
import './changeUserPassword.css';
import LoginService from './../../services/loginService';

export default class changeUserPassword extends Component {
    constructor(){
		super();

		this.state = {
			isOpen: false,
        }

        this.togglePasswordModal = this.togglePasswordModal.bind(this);
    }

    togglePasswordModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.togglePasswordModal} className="userPasswordModal">
                <div className="userPasswordTop">
                    <b className="data">Old Password:</b><input type="password" placeholder="Old Password" className="userPass" />
                    <b className="data">New Password:</b><input type="password" placeholder="New Password" className="userPass" />
                    <b className="data">Repeat New Password:</b><input type="password" placeholder="New Password" className="userPass" />
                </div>
                <div className="userPasswordBottom">
                    <button className="savePassword">Save Changes!</button>
                </div>
            </Modal>
        )
    }
}
