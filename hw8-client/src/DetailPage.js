import React from "react";
import Card from "react-bootstrap/Card";
import commentBox from 'commentbox.io';
import FBShare from "./FBShare";
import TWShare from "./TWShare";
import EmailShare from "./EmailShare";
import Bookmark from "./Bookmark";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../src/css/CardItem.css";
import {animateScroll as scroller} from 'react-scroll'
import {MdExpandMore, MdExpandLess} from 'react-icons/md'
import {IconContext} from "react-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const size = '32';
toast.configure ();

class DetailPage extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            showAlert: false,
            showEllipse: false,
            showDown: 'block',
            showUp: 'none',
        };
        this.handleDownBtn = this.handleDownBtn.bind (this);
        this.handleUpBtn = this.handleUpBtn.bind (this);
        this.handleBookmark = this.handleBookmark.bind (this);
    }

    secondPara = React.createRef ();


    handleBookmark (op) {
        this.setState ({showAlert: !this.state.showAlert});
        toast (op + this.props.data.title, {
            position: toast.POSITION.TOP_CENTER,
            bodyClassName: "toastbody",
            autoClose: 3000,
            progressClassName: 'toastProgress',
        });
    }

    componentDidMount () {
        this.removeCommentBox = commentBox ('5763147759616000-proj', {defaultBoxId: this.props.data.id});
        scroller.scrollToTop ({smooth: true});
    }

    componentWillUnmount () {
        this.removeCommentBox ();
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.state.showDown === 'none' && prevState.showAlert === this.state.showAlert) {
            this.secondPara.current.scrollIntoView ({block: 'start', behavior: 'smooth'});
        }
    }

    checkEllipse (description) {
        let sentences = description.split ('.');
        if (sentences.length <= 4) {
            return [false];
        }
        let paragraph1 = sentences.slice (0, 4).join ('.').concat ('.');
        let paragraph2 = sentences.slice (4).join ('.').concat ('.');
        return [true, paragraph1, paragraph2];
    }

    handleDownBtn () {
        this.setState ({showEllipse: true, showDown: 'none', showUp: 'block'});
    }

    handleUpBtn () {
        scroller.scrollToTop ();
        this.setState ({showEllipse: false, showDown: 'block', showUp: 'none'})
    }

    render () {
        const props = this.props.data;
        const needEllipse = this.checkEllipse (props.description);
        return <>
            <Container fluid>
                <Card style={{
                    display: 'relative',
                    width: '100%',
                    marginTop: '15px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
                }}>
                    <Card.Body>
                        <Card.Title style={{fontSize: '30px', fontStyle: 'italic'}}>{props.title}</Card.Title>
                        <Row>
                            <Col lg={8} md={8} sm={8} xs={5}>
                                <span style={{fontSize: '20px', fontStyle: 'italic', padding: 0}}>{props.date}</span>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={5}>
                                <div
                                    style={{textAlign: 'right', padding: 0}}>
                                    <FBShare share={props.share} size={size}/>
                                    <TWShare share={props.share} size={size}/>
                                    <EmailShare share={props.share} size={size}/>
                                </div>
                            </Col>
                            <Col lg={1} md={1} sm={2} xs={2} style={{testAlign: 'right'}}>
                                <Bookmark title={props.title}
                                          image={props.image}
                                          date={props.date}
                                          source={props.source}
                                          id={props.id}
                                          section={props.section}
                                          share={props.share}
                                          fav={this.props.isFavView}
                                          onAlert={this.handleBookmark}
                                />

                            </Col>

                        </Row>

                        <Card.Img src={props.image} style={{marginTop: '15px'}}/>

                        {needEllipse[0] ?
                            <>
                                <div>
                                    {needEllipse[1]}
                                </div>
                                <IconContext.Provider value={{size: "1.7em"}}>
                                    <MdExpandMore style={{display: this.state.showDown, float: 'right'}}
                                                  onClick={this.handleDownBtn}
                                                  aria-controls="example-collapse-text"
                                                  aria-expanded={this.state.showEllipse}
                                    >
                                    </MdExpandMore>
                                </IconContext.Provider>

                                <br/>
                                <div id="example-collapse-text" ref={this.secondPara}
                                     style={{display: this.state.showEllipse ? 'block' : 'none'}}>
                                    {needEllipse[2]}
                                </div>

                                <IconContext.Provider value={{size: "1.7em"}}>
                                    <MdExpandLess style={{display: this.state.showUp, float: 'right'}}
                                                  onClick={this.handleUpBtn}>
                                    </MdExpandLess>
                                </IconContext.Provider>
                            </> : <Card.Text>{props.description}</Card.Text>}
                    </Card.Body>
                </Card>
                <div className="commentbox" style={{margin: '20px 20px 0 20px'}}/>
            </Container>
        </>

    }
}

export default DetailPage;