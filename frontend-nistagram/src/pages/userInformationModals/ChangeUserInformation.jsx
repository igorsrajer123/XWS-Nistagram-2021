import React, { Component } from 'react'
import Modal from 'react-modal';
import './changeUserInformation.css';
import LoginService from './../../services/loginService';

export default class changeUserInformation extends Component {
    constructor(){
		super();

		this.state = {
			isOpen: false,
            email: "",
            firstName: "",
            lastName: "",
            age: 0,
            phoneNumber: "",
        }

        this.toggleUserModal = this.toggleUserModal.bind(this);
    }

    toggleUserModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        
        this.setState({email: currentUser.email});
        this.setState({firstName: currentUser.firstName});
        this.setState({lastName: currentUser.lastName});
        this.setState({phoneNumber: currentUser.phoneNumber});
        this.setState({age: currentUser.age});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleUserModal} className="userInformationModal">
                <div className="userInfoTop">
                    <b className="data">Email:</b><input type="text" placeholder="Email" className="userInfo1" value={this.state.email} disabled={true} />
                    <b className="data">First Name:</b><input type="text" placeholder="First Name" className="userInfo1" value={this.state.firstName} />
                    <b className="data">Last Name:</b><input type="text" placeholder="Last Name" className="userInfo1" value={this.state.lastName} />
                    <b className="data">Phone Number:</b><input type="text" placeholder="Phone Number" className="userInfo1" value={this.state.phoneNumber}/>
                    <b className="data">Age:</b><input type="text" placeholder="Age" className="userInfo1" onChange={this.ageInputChange} value={this.state.age} />
                </div>
                <div className="userInfoBottom">
                    <button className="saveChanges">Save Changes!</button>
                </div>
            </Modal>
        )
    }
}
