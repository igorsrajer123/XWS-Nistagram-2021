import React, { Component } from 'react';
import './reportModal.css';
import Modal from 'react-modal';
import ReportService from './../../services/reportService';

export default class ReportModal extends Component {
    constructor(){
        super();

        this.state = {
			isOpen: false,
            postId: 0,
            selected: 0,
            parentComponent: ""
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.checkReason = this.checkReason.bind(this);
        this.submitReport = this.submitReport.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({ isOpen : false});
        else 
            this.setState({ isOpen : true});
    }

    checkReason(event){
        this.setState({selected: event.target.id})
        event.target.checked = true;
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.postId != this.props.postId){
            this.setState({parentComponent: this.props.parentComponent});
            this.setState({postId: this.props.postId});
        }
    }

    async submitReport(){
        var reportReason = "";
        if(this.state.selected == 1)
            reportReason = "It's annoying or distasteful";
    
        if(this.state.selected == 2)
            reportReason = "I think it shouldn't be on Nistagram";
        
        if(this.state.selected == 3)
            reportReason = "It's spam";

        if(this.state.selected == 4)
            reportReason = "It's false news";
        
        if(this.state.selected == 5)
            reportReason = "Something else";
        
        if(reportReason != ""){
            if(this.state.parentComponent == 'ReportPost'){
                var object = {
                    postId: this.state.postId,
                    reportReason: reportReason,
                    reportType: 'POST'
                }
                
                const newReport = await ReportService.submitReport(object);
                console.log(newReport);
            }else {
                var object = {
                    postId: this.state.postId,
                    reportReason: reportReason,
                    reportType: 'STORY'
                }

                const newReport = await ReportService.submitReport(object);
                console.log(newReport);
            }
        }
    }

    RenderReport = () => {
        if(this.state.postId != 0){  
            return <div className="reportWrapper">
                <div className="reportTop">
                    <div className="reportHeader">
                        <h2>What's wrong with this?</h2>
                        <hr/>
                    </div>
                    <div className="oneReportReason">
                        <input className="reportItem" type="checkbox" id="1" onClick={this.checkReason} checked={this.state.selected == 1 ? 'checked' : ''}/>
                        <span>It's annoying or distasteful</span>
                    </div>
                    <div className="oneReportReason">
                        <input className="reportItem" type="checkbox" id="2" onClick={this.checkReason} checked={this.state.selected == 2 ? 'checked' : ''}/>
                        <span>I think it shouldn't be on Ništagram</span>
                    </div>
                    <div className="oneReportReason">
                        <input className="reportItem" type="checkbox" id="3" onClick={this.checkReason} checked={this.state.selected == 3 ? 'checked' : ''}/>
                        <span>It's spam</span>
                    </div>
                    <div className="oneReportReason">
                        <input className="reportItem" type="checkbox" id="4" onClick={this.checkReason} checked={this.state.selected == 4 ? 'checked' : ''}/>
                        <span>It's false news</span>
                    </div>
                    <div className="oneReportReason">
                        <input className="reportItem" type="checkbox" id="5" onClick={this.checkReason} checked={this.state.selected == 5 ? 'checked' : ''}/>
                        <span>Something else</span>
                    </div>
                </div>
                <div className="reportBot">
                    <button className="submitReport" onClick={this.submitReport} style={{disabled: this.state.selected == 0 ? 'disabled' : ''}}>Submit Report</button>
                </div>
            </div>
        }

        return <div></div>
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} className="reportPostModal">
                <this.RenderReport />
            </Modal>
        )
    }
}
