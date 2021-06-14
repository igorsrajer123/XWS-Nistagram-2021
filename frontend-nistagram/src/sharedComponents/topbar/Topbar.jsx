import React, { Component } from 'react';
import './topbar.css';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import ProfilePicture from './../../assets/noPicture.jpg';
import LoginService from '../../services/loginService';
import FollowService from './../../services/followService';
import PreviewFollowRequests from './../../pages/previewFollowRequestsModal/PreviewFollowRequests';
import UserService from './../../services/userService';

export default class Topbar extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();

        this.state = {
            parentUserProfile: false,
            parentSearchPage: false,
            parentHomePage: false,
            searchInput: "",
            publicSearch: false,
            requestsIconVisible: false,
            bubbleIconVisible: false,
            numberOfRequests: 0,
            profilePhoto: null
        }

        this.goHome = this.goHome.bind(this);
        this.goToMyProfile = this.goToMyProfile.bind(this);
        this.searchInputChange = this.searchInputChange.bind(this);
    }

    goHome = () => window.location.href = "http://localhost:3000/home";

    goToMyProfile = () => window.location.href = "http://localhost:3000/userProfile";

    searchInputChange = (event) => this.setState({searchInput: event.target.value});

    async logoutClick(){
        await LoginService.logout();
    }

    async componentDidMount() {
        if(this.props.parentComponent == 'userProfile'){
            this.setState({parentUserProfile: true});
            this.setState({parentHomePage: false});
            this.setState({parentSearchPage: false});

            const currentUser = await LoginService.getCurrentUser();
            if(currentUser != null){
                const requests = await FollowService.getFollowRequests(currentUser.id);

                if(requests.length > 0){
                    this.setState({bubbleIconVisible: true});
                    this.setState({requestsIconVisible: true});
                    this.setState({numberOfRequests: requests.length});
                }
            }
        }else if(this.props.parentComponent == 'searchPage'){
            this.setState({parentUserProfile: false});
            this.setState({parentHomePage: false});
            this.setState({parentSearchPage: true});
            this.setState({requestsIconVisible: false});
            this.setState({bubbleIconVisible: false});

            const queryParams = new URLSearchParams(window.location.search);
            const publ = queryParams.get('public');
            if(publ == 'true')
                this.setState({publicSearch: true});
            else if(publ == 'false')
                this.setState({publicSearch: false});

        }else if(this.props.parentComponent == 'homePage'){
            this.setState({parentUserProfile: false});
            this.setState({parentHomePage: true});
            this.setState({parentSearchPage: false});
            this.setState({requestsIconVisible: false});
            this.setState({bubbleIconVisible: false});

            const currentUser = await LoginService.getCurrentUser();
            if(currentUser != null){
                const data = await UserService.getUserProfilePhoto(currentUser.profileImageId);
                if(data == null)
                    this.setState({profilePhoto: ProfilePicture});
                else
                this.setState({profilePhoto: data});
            }else{
                window.location.href = "/";
            }
        }
    }
    
    followRequestsClick = () => {
        this.child.current.toggleModal();
    }

    render() {
        return (
            <div className="topbarContainer">
                <div className="topbarLeft" style={{visibility: this.state.publicSearch ? 'hidden' : 'visible'}}>
                    <span onClick={this.goHome} className="logo">Ništagram</span>
                </div>
                <div className="topbarCenter">
                    <div className="searchbar" style={{visibility: this.state.publicSearch ? 'hidden' : 'visible'}}>
                        <SearchIcon className="searchIcon" style={{visibility: this.state.searchInput == "" ? 'hidden' : 'visible'}} onClick={() => window.location.href="/searchPage?public=false&search=" + this.state.searchInput} />
                        <input type="text" className="searchInput" onChange={this.searchInputChange} placeholder="Search for friend, post or page..." />
                    </div>
                </div>
                <div className="topbarRight">
                    <div className="topbarIcons">
                        <div className="topbarIconItem">
                                <PersonIcon onClick={this.followRequestsClick} style={{visibility: this.state.requestsIconVisible ? 'visible' : 'hidden',
                                                    cursor: this.state.bubbleIconVisible ? 'pointer' : 'auto'}}/>
                                <span className="topbarIconBadge" style={{visibility: this.state.bubbleIconVisible ? 'visible' : 'hidden'}}>{this.state.numberOfRequests}</span>
                        </div>
                        <button className="topbarLogout" style={{visibility: this.state.publicSearch ? 'hidden' : 'visible'}} onClick={this.logoutClick}>Log Out</button>
                        <img src={this.state.profilePhoto} onClick={this.goToMyProfile} style={{visibility: this.state.parentUserProfile || this.state.parentSearchPage ? 'hidden' : 'visible'}} alt="" className="topbarImg"/>
                        <PreviewFollowRequests ref={this.child} />
                    </div>
                </div>
            </div>
        )
    }
}
