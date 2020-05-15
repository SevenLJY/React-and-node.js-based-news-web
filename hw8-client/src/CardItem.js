import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import {MdShare} from "react-icons/md";
import ShareModal from "./ShareModal";
import "../src/css/CardItem.css"
import {Col, Container, Image, Row} from "react-bootstrap";

class CardItem extends React.Component {
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
        this.props.onLoading ();
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
                badgeColor = 'black';
                badgeBackground = '#dddddd';
        }
        return [badgeColor, badgeBackground];
    }


    render () {
        const props = this.props.data;
        const styleBadge = this.getBadgeStyle (props.section);
        return <div>
            <ShareModal show={this.state.isShow} onHide={this.handleClose} title={props.title} share={props.share}/>
            <Card onClick={this.handleClick} className='cardItem' style={{paddingBottom: '20px'}}>
                <Container fluid>
                    <Row>
                        <Col lg={3} md={3} sm={3} xs={12}>
                            <Image src={props.image} className='cardImg' thumbnail/>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={12}>
                            <Card.Body>
                                <Card.Title style={{fontStyle: 'italic', fontSize: '25px'}}>{props.title}
                                    <MdShare onClick={this.handleOpen}/>
                                </Card.Title>
                                <Card.Text className="description">
                                    {props.description}
                                </Card.Text>
                                <Card.Text>
                                    <span style={{fontStyle: 'italic'}}>{props.date}</span>
                                    <Badge style={{color: styleBadge[0], backgroundColor: styleBadge[1]}}
                                           className='badge'> {props.section}</Badge>
                                </Card.Text>
                            </Card.Body>
                        </Col>
                    </Row>
                </Container>
            </Card>

        </div>
    }
}


export default CardItem;