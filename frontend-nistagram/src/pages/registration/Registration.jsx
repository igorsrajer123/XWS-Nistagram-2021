import background from "./../../assets/wallpaper.webp"
import React, { Component } from 'react'
import "./registration.css"

export default class Registration extends Component {
    constructor() {
        super();

        this.loginPageClick = this.loginPageClick.bind(this);
    }

    loginPageClick = () => window.location.href = "http://localhost:3000/login"

    render() {
        return (
            <div className="registration" style={{ backgroundImage: `url(${background})`, backgroundSize: `cover` }}>
                <div className="registrationWrapper">
                    <div className="registrationLeft">
                        <h3 className="registrationLogo">Ništagram</h3>
                        <span className="registrationDescription">
                            <b>
                                <i>
                                    Connect with friends and the world around you on Ništagram! :)
                                </i>
                            </b>
                        </span>
                    </div>
                    <div className="registrationRight">
                        <div className="registrationBox">
                            <input placeholder="Email" type="text" className="registrationInput" />
                            <input placeholder="Password" type="password" className="registrationInput" />
                            <input placeholder="Password Again" type="password" className="registrationInput" />
                            <button className="registrationButton">Sign Up</button>
                            <button className="loginRegistrationButton" onClick={this.loginPageClick}>Log into Account</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
