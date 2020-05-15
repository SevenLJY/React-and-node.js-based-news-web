import React from "react";
import {FacebookIcon, FacebookShareButton} from "react-share";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const hashtag = "#CSCI_571_NewsApp";

class FBShare extends React.Component {
    render () {
        return <OverlayTrigger placement="top" overlay={
            <Tooltip id="fb">
                Facebook
            </Tooltip>
        }>
            <FacebookShareButton url={this.props.share} hashtag={hashtag}>
                <FacebookIcon round={true} size={this.props.size}/>
            </FacebookShareButton>
        </OverlayTrigger>
    }
}

export default FBShare;
