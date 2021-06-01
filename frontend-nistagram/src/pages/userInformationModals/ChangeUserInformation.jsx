import React, { Component } from 'react'
import Modal from 'react-modal';
import './changeUserInformation.css';
import LoginService from './../../services/loginService';
import { TitleSharp, TransferWithinAStationTwoTone } from '@material-ui/icons';
import UserService from './../../services/userService';

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
            website: "",
            description: "",
            validFirstName: true,
            validLastName: true
        }

        this.toggleUserModal = this.toggleUserModal.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.changeAge = this.changeAge.bind(this);
        this.changeWebsite = this.changeWebsite.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.changeFirstName = this.changeFirstName.bind(this);
        this.changeLastName = this.changeLastName.bind(this);
        this.editUserInformation = this.editUserInformation.bind(this);
    }

    async editUserInformation(event) {
        event.preventDefault();

        let firstNameValid = false;
        let lastNameValid = false;

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

        if(firstNameValid && lastNameValid){
            const object = {
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                age: this.state.age,
                phoneNumber: this.state.phoneNumber,
                location: this.state.location,
                website: this.state.website,
                description: this.state.description
            };

            const editedUser = await UserService.editUserInfo(object);
        }
    }

    toggleUserModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    changeDescription = (event) => this.setState({description : event.target.value});

    changeAge = (event) => this.setState({age : parseInt(event.target.value)});

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
        this.setState({description : currentUser.description});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleUserModal} className="userInformationModal">
                <div className="userInfoTop">
                    <b className="data">Email:</b><input type="text" placeholder="Email" className="userInfo1" value={this.state.email} disabled={true} />
                    <b className="data">First Name:</b><input type="text" style={{border: this.state.validFirstName ? '' : '3px solid red'}} placeholder="First Name" className="userInfo1" value={this.state.firstName} onChange={this.changeFirstName} />
                    <b className="data">Last Name:</b><input type="text" style={{border: this.state.validLastName ? '' : '3px solid red'}} placeholder="Last Name" className="userInfo1" value={this.state.lastName} onChange={this.changeLastName} />
                    <b className="data">Phone Number:</b><input type="text" placeholder="Phone Number" className="userInfo1" value={this.state.phoneNumber} onChange={this.changePhone} />
                    <b className="data">Age:</b><input type="text" placeholder="Age" className="userInfo1" value={this.state.age} onChange={this.changeAge} />
                    <b className="data">Location:</b><input type="text" placeholder="Location" className="userInfo1" value={this.state.location} onChange={this.changeLocation} />
                    <b className="data">Website:</b><input type="text" placeholder="Website" className="userInfo1" value={this.state.website} onChange={this.changeWebsite} />
                    <b className="data">Profile Description:</b><textarea placeholder="Description" className="userDescription" value={this.state.description} onChange={this.changeDescription} rows="7" cols="35" />
                </div>
                <div className="userInfoBottom">
                    <button className="saveChanges" onClick={this.editUserInformation}>Save Changes!</button>
                </div>
            </Modal>
        )
    }
}
