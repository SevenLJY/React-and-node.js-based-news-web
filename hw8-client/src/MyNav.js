import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import {MdBookmark, MdBookmarkBorder} from "react-icons/md";
import {IconContext} from "react-icons";
import _ from "lodash";
import AsyncSelect from 'react-select/lib/Async';
import styles from '../src/css/MyNav.css';
import classNames from 'classnames';
import Col from "react-bootstrap/Col";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


class MyNav extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            category: "home",
            source: true,
        };
        this.handleNav = this.handleNav.bind (this);
        this.handleNavResult = this.handleNavResult.bind (this);
        this.handleSwitch = this.handleSwitch.bind (this);
        this.handleSuggestQuery = this.handleSuggestQuery.bind (this);
        // this.handleSearch = _.debounce (this.getAsyncOptions, 500);
        this.handleSuggestClick = this.handleSuggestClick.bind (this);
        this.sendSearchRequest = this.sendSearchRequest.bind (this);
        this.handleFavFolder = this.handleFavFolder.bind (this);
    }

    sendNavRequest (selectKey, source) {
        const url = '/nav/category?key=' + selectKey + '&source=' + source;
        fetch (url)
            .then (res => res.text ())
            .then (res => this.handleNavResult (res))
            .catch ("Unable to get news according to the nav bar");
    }

    handleNav (selectKey) {
        document.body.click();
        this.props.onLoading ();
        this.props.onClearValue();
        this.setState ({category: selectKey, showSwitch: 'inline', showFav: false});
        this.sendNavRequest (selectKey, this.state.source ? 'G' : 'N');
    }

    handleNavResult (rawData) {
        let data = JSON.parse (rawData);
        this.props.onNavLinkChange (data);
    }

    handleSwitch () {
        this.props.onLoading ();
        this.props.onClearValue();
        this.setState ({source: !this.state.source, showFav: false});
        this.sendNavRequest (this.state.category, !this.state.source ? 'G' : 'N');
    }

    getAsyncOptions (keyword) {
        if (keyword === '')
            return;
        return new Promise ((resolve, reject) => {

            const myKey = 'e7ca0169e80245d0b8ae4359514d3211';
            const url = 'https://api.cognitive.microsoft.com/bing/v7.0/Suggestions?mkt=en-US&q=' + keyword;
            fetch (url, {
                headers: {
                    'Ocp-Apim-Subscription-Key': myKey,
                }
            })
                .then (res => res.json ())
                .then (res => resolve (this.handleSuggestQuery (res)))
                .catch ((e) => reject (e));


        });
    }

    handleSuggestQuery (data) {
        const suggestList = data.suggestionGroups[0].searchSuggestions;
        return suggestList.map (function (x) {
            return {label: x.displayText, value: x.displayText}
        });
    }

    handleSuggestClick (mySelect) {
        if (mySelect === null)
            return;
        this.props.onLoading ();
        this.props.onSetValue(mySelect);
        this.setState({value: mySelect});
        this.sendSearchRequest (mySelect.label);
    }

    sendSearchRequest (keyword) {
        const url = '/nav/search?keyword=' + keyword + '&source=' + (this.state.source ? 'G' : 'N');
        fetch (url)
            .then (res => res.json ())
            .then (res => this.handleSearchResult (res))
            .catch (() => console.log ("cannot get search data from backend"));
    }

    handleSearchResult (rawData) {
        this.props.onSearchChange (rawData.data);
        this.setState ({showFav: false});
    }

    handleFavFolder () {
        this.props.onLoading ();
        this.props.onClearValue();
        const dataList = JSON.parse (localStorage.getItem ('fav_ljy')).items;
        this.setState ({showFav: true});
        this.props.onFav (dataList);
    }

    componentDidMount () {
        this.sendNavRequest (this.state.category, this.state.source ? 'G' : 'N');
    }


    render () {

        return (
            <Navbar collapseOnSelect expand="lg" className={styles.navbar} variant='dark'>
                <Col md={2} lg={2} sm={2} xs={9} style={{padding: 0}}>
                    <AsyncSelect isSearchable={true}
                                 isClearable
                                 className={classNames ('basic-single')}
                                 classNamePrefix="select"
                                 name="search"
                                 value={this.props.searchValue}
                                 noOptionsMessage={() => "No Match"}
                                 placeholder={'Enter keyword..'}
                                 loadOptions={inputValue => this.getAsyncOptions (inputValue)}
                                 onChange={this.handleSuggestClick}/>
                </Col>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav defaultActiveKey="home" className="mr-auto" onSelect={selectKey => this.handleNav (selectKey)}>
                        <Nav.Link eventKey="home">Home</Nav.Link>
                        <Nav.Link eventKey="world">World</Nav.Link>
                        <Nav.Link eventKey="politics">Politics</Nav.Link>
                        <Nav.Link eventKey="business">Business</Nav.Link>
                        <Nav.Link eventKey="technology">Technology</Nav.Link>
                        <Nav.Link eventKey="sports">Sports</Nav.Link>
                    </Nav>

                    <OverlayTrigger placement="bottom"
                                    rootClose={true}
                                    overlay={
                        <Tooltip id="favFolder">Bookmark</Tooltip>
                    }>
                        <button style={{
                            backgroundColor: 'Transparent',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            padding: 0,
                            margin: 0
                        }}>
                            <IconContext.Provider value={{color: "white", size: "2.5em", className: 'nav-bookmark'}}>
                                {this.props.openFav ? <MdBookmark/> :
                                    <MdBookmarkBorder onClick={this.handleFavFolder}/>}
                            </IconContext.Provider>
                        </button>
                    </OverlayTrigger>
                    <div style={{
                        color: 'white',
                        padding: '8px',
                        paddingLeft: 0,
                        display: this.props.hidden ? 'none' : 'block'
                    }}>NY Times
                    </div>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label=""
                        style={{display: this.props.hidden ? 'none' : 'block'}}
                        checked={this.state.source}
                        onChange={this.handleSwitch}
                    />
                    <div style={{
                        color: 'white',
                        padding: '8px',
                        paddingLeft: 0,
                        display: this.props.hidden ? 'none' : 'block'
                    }}>Guardian
                    </div>
                </Navbar.Collapse>


            </Navbar>);
    }
}

export default MyNav;