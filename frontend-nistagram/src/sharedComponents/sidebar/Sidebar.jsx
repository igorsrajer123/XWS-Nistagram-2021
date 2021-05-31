import React, { Component } from 'react';
import './sidebar.css';
import LoginService from './../../services/loginService';
import UserInformationModal from './../../pages/userInformationModals/ChangeUserInformation';
import UserPasswordModal from './../../pages/userInformationModals/ChangeUserPassword';

export default class Sidebar extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            age: 0
        }
    }

    async componentDidMount(){
        const currentUser = await LoginService.getCurrentUser();
        
        this.setState({email: currentUser.email});
        this.setState({firstName: currentUser.firstName});
        this.setState({lastName: currentUser.lastName});
        this.setState({phoneNumber: currentUser.phoneNumber});
        this.setState({age: currentUser.age});
    }

    userInformationModal = () => this.child.current.toggleUserModal();

    userPasswordModal = () => this.child.current.togglePasswordModal();

    render() {
        return (
            <div className="sidebar">
                <div className="sidebarWrapper">
                    <div className="sidebarUserInfo">
                        <p className="userInfo"><b>Email:</b> {this.state.email}</p>
                        <p className="userInfo"><b>Name:</b> {this.state.firstName} {this.state.lastName}</p>
                        <p className="userInfo"><b>Age:</b> {this.state.age}</p>
                        <p className="userInfo"><b>Contact Phone:</b> {this.state.phoneNumber}</p>
                        <p className="userInfo"><b>Location:</b></p>
                        <div className="userButtons">
                            <button onClick={this.userInformationModal} className="changeUserInfo">Update your information</button>
                            <button onClick={this.userPasswordModal} className="changeUserPassword">Change your password</button>
                        </div>
                    </div>
                    <div>
                        <UserInformationModal ref={this.child} />
                        <UserPasswordModal ref={this.child} />
                    </div>
                </div>
            </div>
        )
    }
}
