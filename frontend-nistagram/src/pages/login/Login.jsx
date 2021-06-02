import React, { Component } from "react";
import "./login.css";
import background from "./../../assets/wallpaper.webp";
import LoginService from "./../../services/loginService";
import RegistrationModal from "./../registration/RegistrationModal";
import SearchIcon from '@material-ui/icons/Search';

export default class Login extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            email: "",
            password: "",
            loginErrorVisible: false,
            searchInput: ""
        }

        this.registrationPageClick = this.registrationPageClick.bind(this);
        this.emailInputChange = this.emailInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.searchInputChange = this.searchInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    registrationPageClick = (e) => {
        e.preventDefault();
        this.child.current.toggleModal();
    }

    emailInputChange = (event) => this.setState({email : event.target.value});

    passwordInputChange = (event) => this.setState({ password : event.target.value});

    searchInputChange = (event) => this.setState({searchInput: event.target.value});

    async login(event) {      
        event.preventDefault();

        const object = {
            email: this.state.email,
            password: this.state.password
        };

        const ret = await LoginService.login(object);
        
        if(ret == 200){
            this.setState({loginErrorVisible: false});
            window.location.href = "http://localhost:3000/userProfile";
        }

        if(ret == 401)
            this.setState({loginErrorVisible: true});
    }

    render() {
        return (
        <div
            className="login"
            style={{
            backgroundImage: `url(${background})`,
            backgroundSize: `cover`,
            }}
        >
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Ništagram</h3>
                    <span className="loginDescription">
                    <b>
                        <i>
                        Connect with friends and the world <br/> around you on Ništagram! :)
                        </i>
                    </b>
                    </span>
                    <div className="searchBar">
                        <input placeholder="Search for friends, locations, celebrities..." className="searchLoggedOut" onChange={this.searchInputChange}/>
                        <SearchIcon className="searchIconIndex" onClick={() => window.location.href="/searchPage?public=true&search=" + this.state.searchInput} />
                    </div>
                </div>
                <div className="loginCenter">
                    <RegistrationModal ref={this.child} />
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <input placeholder="Email" type="text" className="loginInput" onChange={this.emailInputChange} />
                        <input placeholder="Password" type="password" className="loginInput" onChange={this.passwordInputChange}/>
                        <p style={{color: 'red', fontWeight: 'bold', fontSize: '20px',visibility: this.state.loginErrorVisible ? 'visible' : 'hidden'}} className="loginWarning">Wrong Email or Password!</p>
                        <button className="loginButton" onClick={this.login}>Log In</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="registrationLoginButton" onClick={this.registrationPageClick}>
                            Create a New Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
