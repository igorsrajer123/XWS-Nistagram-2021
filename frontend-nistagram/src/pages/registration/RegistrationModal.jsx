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
            validFirstName: true,
            validLastName: true,
            validEmail: true,
            validPassword: true,
            validAge: true,
            validPhone: true
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

        if(this.state.phoneNumber != ""){
            phoneNumberValid = true;
            this.setState({validPhone: phoneNumberValid});
        }else{
            phoneNumberValid = false;
            this.setState({validPhone: phoneNumberValid});
        }

        if(this.state.age > 0){
            ageValid = true;
            this.setState({validAge: ageValid});
        }else{
            ageValid = false;
            this.setState({validAge: ageValid});
        }

        const existingUser = await RegistrationService.checkEmailUnique(this.state.email);
        if(this.state.email != "" && existingUser.id == 0){
            emailValid = true;
            this.setState({validEmail: emailValid});
        }else{
            emailValid = false;
            this.setState({validEmail: emailValid});
        }

        if(firstNameValid && lastNameValid && ageValid && phoneNumberValid && passwordValid && emailValid){
            const object = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: this.state.age,
                phoneNumber: this.state.phoneNumber
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
                            <input type="text" style={{border: this.state.validFirstName ? '' : '3px solid red'}} placeholder="First Name" className="registrationInput" onChange={this.firstNameInputChange} />
                            <input type="text" style={{border: this.state.validLastName ? '' : '3px solid red'}} placeholder="Last Name" className="registrationInput" onChange={this.lastNameInputChange} />
                        </div>
                        <div className="registrationCredentials">
                            <input type="text" style={{border: this.state.validEmail ? '' : '3px solid red'}} data-tip data-for="emailTip" placeholder="Email" className="registrationInputCredentials" onChange={this.emailOnInputChange} />
                            <ReactTooltip id="emailTip" place="bottom" effect="solid">Email must always be unique!</ReactTooltip>
                            <input type="password" placeholder="Password" className="registrationInputCredentials" onChange={this.passwordInputChange} />
                            <input type="password" data-tip data-for="passwordTip" style={{border: this.state.validPassword ? '' : '3px solid red'}} placeholder="Confirm Password" className="registrationInputCredentials" onChange={this.confirmPasswordInputChange} />
                            <ReactTooltip id="passwordTip" place="bottom" effect="solid">Passwords must always match!</ReactTooltip>
                        </div>
                        <div className="registrationOtherInfo">
                            <input type="text" style={{border: this.state.validPhone ? '' : '3px solid red'}} placeholder="Phone Number" className="registrationInputPhone" onChange={this.phoneNumberInputChange} />
                            <input type="text" style={{border: this.state.validAge ? '' : '3px solid red'}} placeholder="Age" className="registrationInputAge" onChange={this.ageInputChange} />
                        </div>
                        <div className="registrationDone">
                            <button className="register" onClick={this.registration}>Register</button>
                        </div>
                    </div>
            </Modal>
        );
    }
}
