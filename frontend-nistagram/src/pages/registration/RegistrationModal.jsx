import React, { Component } from 'react';
import Modal from 'react-modal';
import "./registration.css";

export default class RegistrationModal extends Component {
    constructor(props){
		super(props);

		this.state = {
			isOpen: false
		}

		this.toggleModal = this.toggleModal.bind(this);
	}

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }


    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="registrationModal">
                    <div className="registrationTop">
                        <h1 className="registrationTitle">User Registration</h1>
                        <p className="registrationDescription">
                            <b>Create new account fast and easy!</b><br/>
                            <i>Fill out all the empty fields below.</i>
                        </p>
                    </div>
                    <hr/>
                    <div className="registrationBottom">
                        <div className="registrationFullName">
                            <input type="text" placeholder="First Name" className="registrationInput"/>
                            <input type="text" placeholder="Last Name" className="registrationInput"/>
                        </div>
                        <div className="registrationCredentials">
                            <input type="text" placeholder="Email" className="registrationInputCredentials"/>
                            <input type="password" placeholder="Password" className="registrationInputCredentials"/>
                            <input type="password" placeholder="Confirm Password" className="registrationInputCredentials"/>
                        </div>
                        <div className="registrationOtherInfo">
                            <input type="text" placeholder="Phone Number" className="registrationInputPhone"/>
                            <input type="text" placeholder="Age" className="registrationInputAge"/>
                        </div>
                        <div className="registrationDone">
                            <button className="register">Register</button>
                        </div>
                    </div>
            </Modal>
        );
    }
}
