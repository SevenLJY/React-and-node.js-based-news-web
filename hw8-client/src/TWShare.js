import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {TwitterIcon, TwitterShareButton} from "react-share";
const hashtag = "CSCI_571_NewsApp";
class TWShare extends React.Component {
    render () {
        return <OverlayTrigger placement="top" overlay={
            <Tooltip id="tw">
                Twitter
            </Tooltip>
        }>
            <TwitterShareButton url={this.props.share} hashtags={[hashtag]}>
                <TwitterIcon round={true} size={this.props.size}/>
            </TwitterShareButton>
        </OverlayTrigger>
    }
}

export default TWShare;