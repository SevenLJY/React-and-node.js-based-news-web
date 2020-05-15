import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {EmailIcon, EmailShareButton} from "react-share";

const subject = '#CSCI_571_NewsApp';
class EmailShare extends React.Component {
    render () {
        return <OverlayTrigger placement="top" overlay={
            <Tooltip id="email">Email</Tooltip>
        }>
            <EmailShareButton url={this.props.share} subject={subject}>
                <EmailIcon round={true} size={this.props.size}/>
            </EmailShareButton>
        </OverlayTrigger>
    }
}

export default EmailShare;