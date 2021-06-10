import React, { Component } from 'react';
import './search.css';
import SearchService from './../../services/searchService';
import ProfilePicture from './../../assets/noPicture.jpg';
import Topbar from './../../sharedComponents/topbar/Topbar';
import PreviewUserProfile from './../../pages/previewUserProfileModal/PreviewUserProfile';
import Post from './../../sharedComponents/post/Post';

export default class Search extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            publicSearch: false,
            searchParams: "",
            searchedUsers: [],
            searchedUserId: 0,
            searchedPosts: [],
            noResultsFound: false
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
            const searchedUsersResult = await SearchService.publicSearch(search);
            this.setState({searchedUsers: searchedUsersResult});
            const searchedPostsResult = await SearchService.publicPostsSearch(search)
            this.setState({searchedPosts: searchedPostsResult});
        }else {
            const searchedUsersResult = await SearchService.privateSearch(search);
            this.setState({searchedUsers: searchedUsersResult});
            const searchedPostsResult = await SearchService.privatePostsSearch(search);
            this.setState({searchedPosts: searchedPostsResult});
        }

        if(this.state.searchedPosts == null && this.state.searchedUsers == null){
            this.setState({noResultsFound: true});
        }
    }

    userNameClick(userId) {
            this.setState({searchedUserId: userId});
            this.child.current.toggleModal();
    }  

    SearchedUsers = () => {
        if(this.state.searchedUsers == null){
            return <div>
                    
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

    SearchedPosts = () => {
        if(this.state.searchedPosts != null){
            return this.state.searchedPosts.map(post =>
                <div className="searchPost" key={post.id}>
                    <Post key={post.id} post={post} parentComponent="Search" />
                </div>
            );
        }else {
            return <div>
                        
                    </div>
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
                    <div className="searchUsersWrapper">
                        <this.SearchedUsers />
                        <PreviewUserProfile ref={this.child} userId={this.state.searchedUserId} />
                    </div>
                    <div className="searchPostsWrapper">
                        <this.SearchedPosts />
                    </div>
                    <p style={{display: this.state.noResultsFound ? 'block' : 'none'}} className="noResultsFound"><b>No Results Found for your Search!</b></p>
                </div>
            </div>
        )
    }
}
