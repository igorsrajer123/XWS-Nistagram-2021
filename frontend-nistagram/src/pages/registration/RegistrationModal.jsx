import React, { Component } from 'react';
import Modal from 'react-modal';
import "./registration.css";

export default class RegistrationModal extends Component {
    constructor(){
		super();

		this.state = {
			isOpen: false,
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            age: 0,
            phoneNumber: ""
		}

		this.toggleModal = this.toggleModal.bind(this);
        this.emailOnInputChange = this.emailOnInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.confirmPasswordInputChange = this.confirmPasswordInputChange.bind(this);
        this.firstNameInputChange = this.firstNameInputChange.bind(this);
        this.lastNameInputChange = this.lastNameInputChange.bind(this);
        this.ageInputChange = this.ageInputChange.bind(this);
        this.phoneNumberInputChange = this.phoneNumberInputChange.bind(this);
        this.registration = this.registration.bind(this);
	}

    async registration(event) {
        event.preventDefault();

        let passwordValid = false;
        let emailValid = false;
        let firstNameValid = false;
        let lastNameValid = false;
        let ageValid = false;
        let phoneNumberValid = false;

        if(this.state.password === this.state.confirmPassword){
            passwordValid = true;
        }

        if(this.state.firstName != ""){
            firstNameValid = true;
        }

        if(this.state.lastName != ""){
            lastNameValid = true;
        }

        if(this.state.phoneNumber != ""){
            phoneNumberValid = true;
        }

        if(this.state.age >= 0){
            ageValid = true;
        }

        const object = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            age: this.state.age,
            phoneNumber: this.state.phoneNumber
        };

        console.log(object);

    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    emailOnInputChange = (event) => this.setState({email : event.target.value});

    passwordInputChange = (event) => this.setState({password : event.target.value});

    confirmPasswordInputChange = (event) => this.setState({confirmPassword : event.target.value});

    firstNameInputChange = (event) => this.setState({firstName : event.target.value});

    lastNameInputChange = (event) => this.setState({lastName : event.target.value});

    ageInputChange = (event) => this.setState({age : parseInt(event.target.value)});

    phoneNumberInputChange = (event) => this.setState({phoneNumber : event.target.value});


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
                            <input type="text" placeholder="First Name" className="registrationInput" onChange={this.firstNameInputChange} />
                            <input type="text" placeholder="Last Name" className="registrationInput" onChange={this.lastNameInputChange} />
                        </div>
                        <div className="registrationCredentials">
                            <input type="text" placeholder="Email" className="registrationInputCredentials" onChange={this.emailOnInputChange} />
                            <input type="password" placeholder="Password" className="registrationInputCredentials" onChange={this.passwordInputChange} />
                            <input type="password" placeholder="Confirm Password" className="registrationInputCredentials" onChange={this.confirmPasswordInputChange} />
                        </div>
                        <div className="registrationOtherInfo">
                            <input type="text" placeholder="Phone Number" className="registrationInputPhone" onChange={this.phoneNumberInputChange} />
                            <input type="text" placeholder="Age" className="registrationInputAge" onChange={this.ageInputChange} />
                        </div>
                        <div className="registrationDone">
                            <button className="register" onClick={this.registration}>Register</button>
                        </div>
                    </div>
            </Modal>
        );
    }
}
