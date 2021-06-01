import React, { Component } from 'react'
import Modal from 'react-modal';
import './changeUserInformation.css';
import LoginService from './../../services/loginService';
import { TransferWithinAStationTwoTone } from '@material-ui/icons';

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
            location: "",
            gender: "",
            website: "",
            description: ""
        }

        this.toggleUserModal = this.toggleUserModal.bind(this);
    }

    toggleUserModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    changeDescription = (event) => this.setState({description : event.target.value});

    changeAge = (event) => this.setState({age : event.target.value});

    changeWebsite = (event) => this.setState({website : event.target.value});

    changeLocation = (event) => this.setState({location : event.target.value});

    changePhone = (event) => this.setState({phoneNumber : event.target.value});

    changeFirstName = (event) => this.setState({firstName : event.target.value});

    changeLastName = (event) => this.setState({lastName : event.target.value});

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        
        this.setState({email: currentUser.email});
        this.setState({firstName: currentUser.firstName});
        this.setState({lastName: currentUser.lastName});
        this.setState({phoneNumber: currentUser.phoneNumber});
        this.setState({age: currentUser.age});
        this.setState({location: currentUser.location});
        this.setState({website: currentUser.website});
        this.setState({gender: currentUser.gender});
        this.setState({description : currentUser.description});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleUserModal} className="userInformationModal">
                <div className="userInfoTop">
                    <b className="data">Email:</b><input type="text" placeholder="Email" className="userInfo1" value={this.state.email} disabled={true} />
                    <b className="data">First Name:</b><input type="text" placeholder="First Name" className="userInfo1" value={this.state.firstName} onChange={this.changeFirstName} />
                    <b className="data">Last Name:</b><input type="text" placeholder="Last Name" className="userInfo1" value={this.state.lastName} onChange={this.changeLastName} />
                    <b className="data">Phone Number:</b><input type="text" placeholder="Phone Number" className="userInfo1" value={this.state.phoneNumber} onChange={this.changePhone} />
                    <b className="data">Age:</b><input type="text" placeholder="Age" className="userInfo1" value={this.state.age} onChange={this.changeAge} />
                    <b className="data">Location:</b><input type="text" placeholder="Location" className="userInfo1" value={this.state.location} onChange={this.changeLocation} />
                    <b className="data">Website:</b><input type="text" placeholder="Website" className="userInfo1" value={this.state.website} onChange={this.changeWebsite} />
                    <b className="data">Profile Description:</b><textarea placeholder="Description" className="userDescription" value={this.state.description} onChange={this.changeDescription} rows="7" cols="35" />
                </div>
                <div className="userInfoBottom">
                    <button className="saveChanges">Save Changes!</button>
                </div>
            </Modal>
        )
    }
}
