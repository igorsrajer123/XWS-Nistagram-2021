import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import RegistrationService from './../../services/registrationService';
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
            phoneNumber: "",
            location: "",
            website: "",
            gender: "",
            validFirstName: true,
            validLastName: true,
            validEmail: true,
            validPassword: true
		}

		this.toggleModal = this.toggleModal.bind(this);
        this.emailOnInputChange = this.emailOnInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.confirmPasswordInputChange = this.confirmPasswordInputChange.bind(this);
        this.firstNameInputChange = this.firstNameInputChange.bind(this);
        this.lastNameInputChange = this.lastNameInputChange.bind(this);
        this.ageInputChange = this.ageInputChange.bind(this);
        this.phoneNumberInputChange = this.phoneNumberInputChange.bind(this);
        this.genderInputChange = this.genderInputChange.bind(this);
        this.locationInputChange = this.locationInputChange.bind(this);
        this.websiteInputChange = this.websiteInputChange.bind(this);
        this.registration = this.registration.bind(this);
	}

    async registration(event) {
        event.preventDefault();

        let passwordValid = false;
        let emailValid = false;
        let firstNameValid = false;
        let lastNameValid = false;

        if(this.state.password === this.state.confirmPassword && this.state.password != ""){
            passwordValid = true;
            this.setState({validPassword: passwordValid});
        }else{
            passwordValid = false;
            this.setState({validPassword: passwordValid});
        }

        if(this.state.firstName != ""){
            firstNameValid = true;
            this.setState({validFirstName: firstNameValid});
        }else{
            firstNameValid = false;
            this.setState({validFirstName: firstNameValid});
        }

        if(this.state.lastName != ""){
            lastNameValid = true;
            this.setState({validLastName: lastNameValid});
        }else{
            lastNameValid = false;
            this.setState({validLastName: lastNameValid});
        }

        const existingUser = await RegistrationService.checkUserExists(this.state.email);
        if(this.state.email != "" && existingUser == "false"){
            emailValid = true;
            this.setState({validEmail: emailValid});
        }else{
            emailValid = false;
            this.setState({validEmail: emailValid});
        }

        if(firstNameValid && lastNameValid && passwordValid && emailValid){
            const object = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: this.state.age,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                location: this.state.location,
                website: this.state.website
            };

            const ret = await RegistrationService.registration(object);
            console.log(ret);
        }
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

    genderInputChange = (event) => this.setState({gender: event.target.value});

    locationInputChange = (event) => this.setState({location : event.target.value});

    websiteInputChange = (event) => this.setState({website : event.target.value});

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="registrationModal">
                    <div className="registrationTop">
                        <h1 className="registrationTitle">User Registration</h1>
                        <p className="registrationDescription">
                            <b>Create new account fast and easy!</b><br/>
                            <i>Fill out all the empty fields below.*</i>
                        </p>
                    </div>
                    <hr/>
                    <div className="registrationBottom">
                        <div className="registrationFullName">
                            <input type="text" style={{border: this.state.validFirstName ? '' : '3px solid red'}} placeholder="First Name*" className="registrationInput" onChange={this.firstNameInputChange} />
                            <input type="text" style={{border: this.state.validLastName ? '' : '3px solid red'}} placeholder="Last Name*" className="registrationInput" onChange={this.lastNameInputChange} />
                        </div>
                        <div className="registrationCredentials">
                            <input type="text" style={{border: this.state.validEmail ? '' : '3px solid red'}} data-tip data-for="emailTip" placeholder="Email*" className="registrationInputCredentials" onChange={this.emailOnInputChange} />
                            <ReactTooltip id="emailTip" place="bottom" effect="solid">Email must always be unique!</ReactTooltip>
                            <input type="password" placeholder="Password*" className="registrationInputCredentials" onChange={this.passwordInputChange} />
                            <input type="password" data-tip data-for="passwordTip" style={{border: this.state.validPassword ? '' : '3px solid red'}} placeholder="Confirm Password*" className="registrationInputCredentials" onChange={this.confirmPasswordInputChange} />
                            <ReactTooltip id="passwordTip" place="bottom" effect="solid">Passwords must always match!</ReactTooltip>
                        </div>
                        <div className="registrationOtherInfo">
                            <input type="text" placeholder="Phone Number" className="registrationOtherInfoInput" onChange={this.phoneNumberInputChange} />
                            <input type="text" placeholder="Location" className="registrationOtherInfoInput" onChange={this.locationInputChange} />
                            <input type="text" placeholder="Website" className="registrationOtherInfoInput" onChange={this.websiteInputChange} />
                        </div>
                        <div className="registrationOtherInfo2">
                            <input type="text" placeholder="Age" className="registrationInputAge" onChange={this.ageInputChange} />
                            <select className="registrationInputGender" onChange={this.genderInputChange}>
                                <option disabled selected value="None">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="None">Not Specified</option>
                            </select>
                        </div>
                        <div className="registrationDone">
                            <button className="register" onClick={this.registration}>Register</button>
                        </div>
                    </div>
            </Modal>
        );
    }
}
