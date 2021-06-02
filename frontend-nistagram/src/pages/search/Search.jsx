import React, { Component } from 'react';
import './search.css';

export default class Search extends Component {
    constructor() {
        super();


    }

    render() {
        const queryParams = new URLSearchParams(window.location.search);
        const search = queryParams.get('search');
        console.log(search);

        return (
            <div>
                {search}
            </div>
        )
    }
}
