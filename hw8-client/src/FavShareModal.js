import React from 'react';
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FBShare from "./FBShare";
import TWShare from "./TWShare";
import EmailShare from "./EmailShare";

const size = "64";

class FavShareModal extends React.Component {
    render () {
        const {show, onHide, title, share, section} = this.props;
        return <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div style={{fontSize: '25px', fontWeight: 'bold'}}>{section}</div>
                    <div style={{fontSize: '20px'}}>{title}</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="show-grid" style={{textAlign: 'center'}}>
                        <Col>
                            <h5>Share via</h5>
                        </Col>
                    </Row>
                    <Row className="show-grid" style={{textAlign: 'center'}}>
                        <Col>
                            <FBShare share={share} size={size}/>
                        </Col>
                        <Col>
                            <TWShare share={share} size={size}/>
                        </Col>
                        <Col>
                            <EmailShare share={share} size={size}/>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    }
}

export default FavShareModal;