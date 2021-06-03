import React, { Component } from 'react';
import './sidebar.css';
import LoginService from './../../services/loginService';
import UserInformationModal from './../../pages/userInformationModals/ChangeUserInformation';
import UserPasswordModal from './../../pages/userInformationModals/ChangeUserPassword';
import UserService from './../../services/userService';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.infoRef = React.createRef();
        this.passwordRef = React.createRef();

        this.state = {
            userId: 0,
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
            this.setState({parentPreviewProfile: false});
            this.setState({parentUserProfile: true});

            const currentUser = await LoginService.getCurrentUser();
            this.setUserInformationStates(currentUser);

        }else if(this.props.parentComponent == 'previewProfile'){
            this.setState({parentUserProfile: false});
            this.setState({parentPreviewProfile: true});

            if(this.props.userId != 0){
                const myUser = await UserService.getUserById(this.props.userId);
                this.setUserInformationStates(myUser);
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.userId != this.props.userId){
            const myUser = await UserService.getUserById(this.props.userId);
            this.setUserInformationStates(myUser);
        }
    }

    setUserInformationStates = myUser => {
        this.setState({userId: myUser.id});
        this.setState({email: myUser.email});
        this.setState({firstName: myUser.firstName});
        this.setState({lastName: myUser.lastName});
        this.setState({phoneNumber: myUser.phoneNumber});
        this.setState({age: myUser.age});
        this.setState({gender: myUser.gender});
        this.setState({location: myUser.location});
        this.setState({website: myUser.website});

        if(myUser.phoneNumber != "")
            this.setState({showPhone: true});
        else 
            this.setState({showPhone: false});

        if(myUser.age != 0 && myUser.age != "")
            this.setState({showAge: true});
        else
            this.setState({showAge: false});

        if(myUser.location != "")
            this.setState({showLocation: true});
        else
            this.setState({showLocation: false});

        if(myUser.website != "")
            this.setState({showWebsite: true});
        else
            this.setState({showWebsite: false});

        if(myUser.gender != "" && myUser.gender != "None")
            this.setState({showGender: true});
        else
            this.setState({showGender: false});
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
                            <button onClick={this.userInformationModal} style={{display: this.state.parentUserProfile ? 'block' : 'none'}} className="changeUserInfo">Update your information</button>
                            <button onClick={this.userPasswordModal} style={{display: this.state.parentUserProfile ? 'block' : 'none'}} className="changeUserPassword">Change your password</button>
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
