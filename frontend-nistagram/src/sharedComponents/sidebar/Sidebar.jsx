import React, { Component } from 'react';
import './sidebar.css';
import LoginService from './../../services/loginService';
import UserInformationModal from './../../pages/userInformationModals/ChangeUserInformation';
import UserPasswordModal from './../../pages/userInformationModals/ChangeUserPassword';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.infoRef = React.createRef();
        this.passwordRef = React.createRef();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            age: 0,
            gender: "",
            location: "",
            website: "",
            showAge: false,
            showPhone: false,
            showLocation: false,
            showWebsite: false,
            showGender: false,
            parentUserProfile: false,
            parentPreviewProfile: false
        }
    }

    async componentDidMount(){
        if(this.props.parentComponent == 'userProfile'){
            const currentUser = await LoginService.getCurrentUser();
        
            this.setState({email: currentUser.email});
            this.setState({firstName: currentUser.firstName});
            this.setState({lastName: currentUser.lastName});
            this.setState({phoneNumber: currentUser.phoneNumber});
            this.setState({age: currentUser.age});
            this.setState({gender: currentUser.gender});
            this.setState({location: currentUser.location});
            this.setState({website: currentUser.website});

            if(currentUser.phoneNumber != "")
                this.setState({showPhone: true});
            
            if(currentUser.age != "")
                this.setState({showAge: true});
            
            if(currentUser.location != "")
                this.setState({showLocation: true});

            if(currentUser.website != "")
                this.setState({showWebsite: true});

            if(currentUser.gender != "" && currentUser.gender != "None")
                this.setState({showGender: true});

        }else if(this.props.parentComponent == 'previewProfile'){
            console.log("PREVIEW JE RODITELJ!");
        }
    }

    userInformationModal = () => this.infoRef.current.toggleUserModal();

    userPasswordModal = () => this.passwordRef.current.togglePasswordModal();

    render() {
        return (
            <div className="sidebar">
                <div className="sidebarWrapper">
                    <div className="sidebarUserInfo">
                        <p className="userInfo"><b>Email:</b> {this.state.email}</p>
                        <p className="userInfo"><b>Name:</b> {this.state.firstName} {this.state.lastName}</p>
                        <p className="userInfo" style={{display: this.state.showAge ? 'block' : 'none'}}><b>Age:</b> {this.state.age}</p>
                        <p className="userInfo" style={{display: this.state.showGender ? 'block' : 'none'}}><b>Gender:</b> {this.state.gender}</p>
                        <p className="userInfo" style={{display: this.state.showPhone ? 'block' : 'none'}}><b>Contact Phone:</b> {this.state.phoneNumber}</p>
                        <p className="userInfo" style={{display: this.state.showLocation ? 'block' : 'none'}}><b>Location:</b> {this.state.location}</p>
                        <p className="userInfo" style={{display: this.state.showWebsite ? 'block' : 'none'}}><b>Website:</b> <a>{this.state.website}</a></p>
                        <div className="userButtons">
                            <button onClick={this.userInformationModal} className="changeUserInfo">Update your information</button>
                            <button onClick={this.userPasswordModal} className="changeUserPassword">Change your password</button>
                        </div>
                    </div>
                    <div>
                        <UserInformationModal ref={this.infoRef} parentComponent={this.props.parentComponent} />
                        <UserPasswordModal ref={this.passwordRef} parentComponent={this.props.parentComponent} />
                    </div>
                </div>
            </div>
        )
    }
}
