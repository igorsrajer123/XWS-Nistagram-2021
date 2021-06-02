import React, { Component } from 'react';
import Modal from 'react-modal';
import './previewUserProfile.css';
import ProfilePicture from './../../assets/noPicture.jpg';
import CoverPicture from './../../assets/2.jpg';
import Sidebar from './../../sharedComponents/sidebar/Sidebar';  
import UserService from '../../services/userService';

export default class PreviewUserProfile extends Component {
    constructor(props){
		super(props);

		this.state = {
			isOpen: false,
            userEmail: "",
            userFirstName: "",
            userLastName: "",
            userLocation: "",
            userAge: "",
            userGender: "",
            userWebsite: "",
            userDescription: "",
            userPhone: ""
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async componentDidMount() {
        const myUser = await UserService.getUserById(this.props.userId);

        this.setState({userEmail: myUser.email});
        this.setState({userFirstName: myUser.firstName});
        this.setState({userLastName: myUser.lastName});
        this.setState({userAge: myUser.age});
        this.setState({userGender: myUser.gender});
        this.setState({userWebsite: myUser.website});
        this.setState({userLocation: myUser.location});
        this.setState({userPhone: myUser.phoneNumber});
        this.setState({userDescription: myUser.description});
    }

    

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="previewUserModal">
                <div className="previewProfile">
                    <div className="previewProfileTop">
                        <div className="previewProfileCover">
                            <img src={CoverPicture} alt="" className="previewCoverImage"/>
                            <img src={ProfilePicture} alt="" className="previewProfileImage"/>
                        </div>
                    </div>
                    <div className="previewProfileCenter">
                            <h4 className="previewProfileName">{this.state.userFirstName} {this.state.userLastName}</h4>
                            <span className="previewProfileDescription">PROFILE SECRIPTION BLA BLA BLA <br/>adasadad</span>
                            <div className="previewFollowings">
                                <span className="previewFollowing"><b>Following:</b> 69</span>
                                <span className="previewFollowers"><b>Followers:</b> 69</span>
                                <button className="previewFollow">Follow</button>
                            </div>
                    </div>
                    <div className="previewProfileBottom">
                        <div className="previewSidebar">
                            <Sidebar parentComponent={'previewProfile'} />
                        </div>
                        <div className="previewFeed">
                            feed
                        </div>                   
                    </div>
                </div>
            </Modal>
        )
    }
}
