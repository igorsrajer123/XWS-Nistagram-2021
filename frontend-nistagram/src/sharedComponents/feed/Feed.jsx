import React, { Component } from 'react';
import './feed.css';
import Share from './../share/Share';

export default class Feed extends Component {
    render() {
        return (
            <div className="feed">
                <div className="feedWrapper">
                    <Share />
                </div>
            </div>
        )
    }
}
