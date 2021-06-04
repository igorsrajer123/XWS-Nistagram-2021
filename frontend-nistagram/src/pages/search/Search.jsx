import React, { Component } from 'react';
import './search.css';
import SearchService from './../../services/searchService';
import ProfilePicture from './../../assets/noPicture.jpg';
import Topbar from './../../sharedComponents/topbar/Topbar';
import PreviewUserProfile from './../../pages/previewUserProfileModal/PreviewUserProfile';

export default class Search extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            publicSearch: false,
            searchParams: "",
            searchedUsers: [],
            searchedUserId: 0
        }

        this.userNameClick = this.userNameClick.bind(this);
        this.userNameClick = this.userNameClick.bind(this);
    }

    async componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search);
        const search = queryParams.get('search');
        const publ = queryParams.get('public');

        this.setState({searchParams: search});
        this.setState({publicSearch: publ});

        if(publ == "true"){
            console.log("Public Search!");
            const searchedUsersResult = await SearchService.publicSearch(search);
            this.setState({searchedUsers: searchedUsersResult});

        }else {
            console.log("Private Search!");
            const searchedUsersResult = await SearchService.privateSearch(search);
            this.setState({searchedUsers: searchedUsersResult});
        }
    }

    userNameClick(userId) {
            this.setState({searchedUserId: userId});
            this.child.current.toggleModal();
    }  

    SearchedUsers = () => {
        if(this.state.searchedUsers == null){
            return <div>
                    <b style={{fontSize: '25px', color: 'red'}}>No Results Found for Your Search!</b>
                    </div>
        }else{
            return this.state.searchedUsers.map(user =>
                <div className="searchUser" key={user.id}>
                    <img src={ProfilePicture}  alt="" className="searchUserImage"/>
                    <span className="searchUserName" onClick={() => this.userNameClick(user.id)}><b>{user.firstName} {user.lastName}</b> ({user.location})</span>
                </div>
                );
        }
    }

    render() {
        return (
            <div className="searchWrapper">
                <Topbar  parentComponent={'searchPage'} />
                <div className="searchHeader">
                    <h1>Your Searched Results...</h1>
                </div>
                <div className="searchBody">
                    <this.SearchedUsers />
                    <PreviewUserProfile ref={this.child} userId={this.state.searchedUserId} />
                </div>
            </div>
        )
    }
}
