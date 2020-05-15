import React from "react";
import ShareModal from "./ShareModal";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import {MdShare} from "react-icons/md";
import Image from "react-bootstrap/Image";

class SearchItem extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            isShow: false,
        };
        this.id = this.props.data.id;
        this.source = this.props.data.source;
        this.handleClick = this.handleClick.bind (this);
        this.handleResult = this.handleResult.bind (this);
        this.handleOpen = this.handleOpen.bind (this);
        this.handleClose = this.handleClose.bind (this);
    }

    handleClick () {
        this.props.onLoading();
        this.props.onClearValue();
        const url = '/article?id=' + this.id + '&source=' + this.source;
        fetch (url)
            .then (res => res.text ())
            .then (res => (this.handleResult (res)))
    }

    handleResult (res) {
        let data = JSON.parse (res);
        this.props.onDetail (data, false);
    }

    handleClose () {
        this.setState ({isShow: false});
    }

    handleOpen (e) {
        e.stopPropagation (); // important to stop the bubble event
        this.setState ({isShow: true});
    }

    getBadgeStyle (section) {
        let badgeColor = '';
        let badgeBackground = '';
        switch (section) {
            case 'SPORTS':
                badgeColor = 'black';
                badgeBackground = '#f6c244';
                break;
            case 'TECHNOLOGY':
                badgeColor = 'black';
                badgeBackground = '#cedc39';
                break;
            case 'WORLD':
                badgeColor = 'white';
                badgeBackground = '#7c4eff';
                break;
            case 'POLITICS':
                badgeColor = 'white';
                badgeBackground = '#419488';
                break;
            case 'BUSINESS':
                badgeColor = 'white';
                badgeBackground = '#4696ec';
                break;
            case 'HEALTH':
                badgeColor = 'white';
                badgeBackground = '#6e757c';
                break;
            case 'NYTIMES':
                badgeColor = 'black';
                badgeBackground = '#dddddd';
                break;
            case 'GUARDIAN':
                badgeColor = 'white';
                badgeBackground = '#14284a';
                break;
            default:
                badgeColor = 'white';
                badgeBackground = '#aaaaaa';
        }
        return [badgeColor, badgeBackground];
    }

    getDecorated(title){
        if(title.length < 75)
            return title;
        return title.substr(0, 75) + '... ';
    }


    render () {
        const props = this.props.data;
        const styleBadge = this.getBadgeStyle (props.section);
        const title = this.getDecorated(props.title);
        return <div className="col-md-3 col-lg-3 col-sm-3 col-xs-12"
                    style={{display: 'inline-block', marginBottom: '10px'}}>
            <ShareModal show={this.state.isShow} onHide={this.handleClose} title={props.title} share={props.share}/>
            <Card onClick={this.handleClick} style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
                <Card.Body>
                    <Card.Title style={{fontStyle: 'italic'}}>
                        {/*<span className="title">{props.title}</span>*/}
                        {title}
                        <MdShare onClick={this.handleOpen}/>

                    </Card.Title>
                    <Image src={props.image} thumbnail/>
                    <Card.Text style={{marginTop: '15px'}}>
                        <span style={{fontStyle: 'italic', fontSize: '17px'}}>{props.date}</span>
                        <Badge style={{color: styleBadge[0], backgroundColor: styleBadge[1]}}> {props.section}</Badge>
                    </Card.Text>

                </Card.Body>
            </Card>
        </div>
    }
}

export default SearchItem;