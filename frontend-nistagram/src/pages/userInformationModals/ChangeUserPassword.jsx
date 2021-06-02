import React, { Component } from 'react';
import Modal from 'react-modal';
import './changeUserPassword.css';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';

export default class changeUserPassword extends Component {
    constructor(props){
		super(props);

		this.state = {
			isOpen: false,
            email: "",
            password1: "",
            password2: "",
            validPassword: true
        }

        this.togglePasswordModal = this.togglePasswordModal.bind(this);
        this.changeUserPassword = this.changeUserPassword.bind(this);
        this.changePasswordInput = this.changePasswordInput.bind(this);
        this.changeRepeatedPasswordInput = this.changeRepeatedPasswordInput.bind(this);
    }

    togglePasswordModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async changeUserPassword(event) {
        event.preventDefault();

        let passwordValid = false;

        if(this.state.password1 == this.state.password2 && this.state.password1 != ""){
            passwordValid = true;
            this.setState({validPassword: passwordValid});
        }else {
            passwordValid = false;
            this.setState({validPassword: passwordValid});
        }

        if(passwordValid){
            const object = {
                email: this.state.email,
                password: this.state.password1
            }

            const editedUser = await UserService.changePassword(object);
        }
    }

    async componentDidMount() {
        
        if(this.props.parentComponent == 'userProfile'){
            const currentUser = await LoginService.getCurrentUser();
        
            this.setState({email: currentUser.email});
        }
    }


    changePasswordInput = (event) => this.setState({password1: event.target.value});

    changeRepeatedPasswordInput = (event) => this.setState({password2: event.target.value});

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.togglePasswordModal} className="userPasswordModal">
                <div className="userPasswordTop">
                    <b className="data">Old Password:</b><input type="password" placeholder="Old Password" className="userPass" />
                    <b className="data">New Password:</b><input type="password" style={{border: this.state.validPassword ? '' : '3px solid red'}} placeholder="New Password" className="userPass" onChange={this.changePasswordInput} />
                    <b className="data">Repeat New Password:</b><input type="password" style={{border: this.state.validPassword ? '' : '3px solid red'}} placeholder="New Password" className="userPass" onChange={this.changeRepeatedPasswordInput} />
                </div>
                <div className="userPasswordBottom">
                    <button className="savePassword" onClick={this.changeUserPassword}>Save Changes!</button>
                </div>
            </Modal>
        )
    }
}
