import React, { Component } from "react";
import "./login.css";
import background from "./../../assets/wallpaper.webp";
import LoginService from "./../../services/loginService";

export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: ""
        }

        this.registrationPageClick = this.registrationPageClick.bind(this);
        this.emailInputChange = this.emailInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    registrationPageClick = () => window.location.href = "http://localhost:3000/registration";

    emailInputChange = (event) => this.setState({email : event.target.value});

    passwordInputChange = (event) => this.setState({ password : event.target.value});

    async login(event) {      
        event.preventDefault();

        const object = {
            email: this.state.email,
            password: this.state.password
        };

        const ret = await LoginService.login(object);
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
                    Connect with friends and the world around you on Ništagram! :)
                    </i>
                </b>
                </span>
            </div>
            <div className="loginRight">
                <div className="loginBox">
                <input placeholder="Email" type="text" className="loginInput" onChange={this.emailInputChange} />
                <input placeholder="Password" type="password" className="loginInput" onChange={this.passwordInputChange}/>
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
