import React, { Component } from 'react';
import './accountVerification.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import ValidationService from './../../services/validationService';

export default class AccountVerification extends Component {
    constructor() {
        super();

        this.state = {
            isOpen: false,
            currentUserId: -1,
            accountVerified: true
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    async componentDidMount(){
        const user = await LoginService.getCurrentUser();
        if(user != null){
            this.setState({currentUserId: user.id});
            const verified = await ValidationService.getUserStatus(user.id);

            if(verified)
                this.setState({accountVerified: "VERIFIED"});
            else
                this.setState({accountVerified: "NOT VERIFIED"});
        }
    }

    clickSubmit = () => window.location.reload();

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="accountVerificationModal">
                <iframe name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
                <form className="accountVerificationWrapper" action={"http://localhost:8000/api/user/submitVerificationRequest"} target="dummyframe" enctype="multipart/form-data" method="POST">
                    <div className="accountVerificationTop">
                        <h1 style={{textAlign: 'center', fontFamily: 'monospace'}}>Verify your Account</h1>
                        <h3 style={{textAlign: 'center', fontFamily: 'monospace'}}>Please provide accurate information and documentation about yourself</h3>
                        <h4 style={{textAlign: 'center', fontFamily: 'monospace', color: 'red', fontWeight: 'bold'}}>All fields required*</h4>
                        <hr />
                    </div>
                    <div className="accountVerificationCenter">
                        <span className="accountVerificationCenterItem" style={{fontSize: '20px'}}>Account status:<i style={{color: 'red'}}>{this.state.accountVerified}</i></span>
                        <div className="accountVerificationCenterItem">
                            <span className="accountVerificationItem">First Name:</span>
                            <input type="text" className="accountVerificationInput" placeholder="First Name" name="firstName" id="firstName"/>
                            <span className="accountVerificationItem">Last Name:</span>
                            <input type="text" className="accountVerificationInput" placeholder="Last Name" name="lastName" id="lastName"/>
                            <input type="text" name="user" id="user" value={this.state.currentUserId} style={{display: 'none'}}/>
                        </div>
                        <div className="accountVerificationCenterItem">
                            <span className="accountVerificationItem">Account Category: </span>
                            <select className="accountVerificationItem" name="category" id="category">
                                <option value="influencer">Influencer</option>
                                <option value="sports">Sports</option>
                                <option value="news">News/Media</option>
                                <option value="business">Business</option>
                                <option value="brand">Brand</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>
                        <div className="accountVerificationCenterItem">
                            <span className="accountVerificationItem">Legal document:</span>
                            <input type="file" name="file" style={{backgroundColor: 'lightgray', borderColor: 'lemonchiffon'}} className="accountVerificationItem" />                    
                        </div>
                    </div>
                    <div className="accountVerificationBot">
                        <hr />  
                        <input type="submit" value="Submit" className="submitAccountVerificationRequest" onClick={this.clickSubmit} />
                    </div>
                </form>
            </Modal>
        )
    }
}
