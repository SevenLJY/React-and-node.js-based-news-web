import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import {MdShare, MdDelete} from "react-icons/md";
import _ from "lodash";
import {Image} from "react-bootstrap";
import FavShareModal from "./FavShareModal";

class FavItem extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            isShow: false,
        };
        this.id = this.props.data.id;
        this.source = this.props.data.section[1];
        this.handleCardClick = this.handleCardClick.bind (this);
        this.handleResult = this.handleResult.bind (this);
        this.handleShareOpen = this.handleShareOpen.bind (this);
        this.handleShareClose = this.handleShareClose.bind (this);
        this.handleDelete = this.handleDelete.bind (this);
    }

    handleCardClick () {
        this.props.onLoading ();
        const url = '/article?id=' + this.id + '&source=' + this.source;

        fetch (url)
            .then (res => res.text ())
            .then (res => (this.handleResult (res)))
    }

    handleResult (res) {
        let data = JSON.parse (res);
        this.props.onDetail (data, true);
    }

    handleShareClose () {
        this.setState ({isShow: false});
    }

    handleShareOpen (e) {
        e.stopPropagation (); // important to stop the bubble event
        this.setState ({isShow: true});
    }

    handleDelete (e) {
        e.stopPropagation ();
        let items = JSON.parse (localStorage.getItem ('fav_ljy')).items;
        const id = this.props.data.id;
        let newItems = _.remove (items, (item) => {
            return item.id !== id;
        });
        localStorage.setItem ('fav_ljy', JSON.stringify ({'items': newItems}));
        this.props.onAlert (this.props.data.title);
        this.props.onFav (newItems);
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
        if(title.length < 70)
            return title;
        return title.substr(0, 70) + '... ';
    }


    render () {
        const props = this.props.data;
        const style1 = this.getBadgeStyle (props.section[0]);
        const style2 = this.getBadgeStyle (props.section[1] === 'G' ? 'GUARDIAN' : 'NYTIMES');
        const title = this.getDecorated(props.title);
        return <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12" style={{display: 'inline-block'}}>
            <FavShareModal show={this.state.isShow} onHide={this.handleShareClose} title={props.title}
                           share={props.share} section={props.section[1] === 'G' ? 'GUARDIAN' : 'NYTIMES'}/>
            <Card onClick={this.handleCardClick}>
                <Card.Body>
                    <Card.Title>
                        <span style={{fontStyle: 'italic'}}>{title}</span>
                        <MdShare onClick={this.handleShareOpen}/>
                        <MdDelete onClick={this.handleDelete}/>
                    </Card.Title>
                    <Image src={props.image} thumbnail/>
                    <Card.Text style={{marginTop: '15px'}}>
                        <span style={{fontSize: '17px', fontStyle: 'italic'}}>{props.date} </span>
                        <div style={{display: 'inline-block', float: 'right'}}>
                            <Badge style={{color: style2[0], backgroundColor: style2[1]}}>
                                {props.section[1] === 'G' ? 'GUARDIAN' : 'NYTIMES'}
                            </Badge>
                            <Badge style={{
                                color: style1[0],
                                backgroundColor: style1[1],
                                marginRight: '5px'
                            }}> {props.section[0]}
                            </Badge>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    }
}

export default FavItem;