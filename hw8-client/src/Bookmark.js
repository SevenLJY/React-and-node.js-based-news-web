import React from "react";
import {IconContext} from "react-icons";
import {FaBookmark, FaRegBookmark} from "react-icons/fa";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import _ from "lodash";

const STORAGE_KEY = 'fav_ljy';

class Bookmark extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            isFav: this.props.fav,
            showAlert: false,
        };
        this.handleFav = this.handleFav.bind (this);
        this.handleCancel = this.handleCancel.bind (this);
        this.setLocalStorage = this.setLocalStorage.bind (this);
        this.removeFromLocalStorage = this.removeFromLocalStorage.bind (this);
    }

    handleFav (e) {
        e.stopPropagation ();
        this.setState ({isFav: true});
        this.setLocalStorage ();
        this.props.onAlert ("Saving ");
    }

    handleCancel () {
        this.setState ({isFav: false});
        this.removeFromLocalStorage ();
        this.props.onAlert ("Removing ");
    }


    setLocalStorage () {
        let items = JSON.parse (localStorage.getItem (STORAGE_KEY)).items;
        const props = this.props;
        const article = {
            'id': props.id,
            'image': props.image,
            'section': [props.section, props.source],
            'title': props.title,
            'date': props.date,
            'share': props.share,
        };
        items.push (article);
        localStorage.setItem (STORAGE_KEY, JSON.stringify ({'items': items}));
    }

    removeFromLocalStorage () {
        let items = JSON.parse (localStorage.getItem (STORAGE_KEY)).items;
        const id = this.props.id;
        let newItems = _.remove (items, (item) => {
            return item.id !== id;
        });
        localStorage.setItem (STORAGE_KEY, JSON.stringify ({'items': newItems}));
    }

    render () {
        return <OverlayTrigger placement="top" overlay={
            <Tooltip id="bookmark">Bookmark</Tooltip>
        }>
            <button style={{backgroundColor: 'Transparent', border: 'none', outline: 'none', cursor: 'pointer', overflow: 'hidden', padding: 0, margin: 0}}>
                <IconContext.Provider value={{color: "#DC143C", size: "1.6em"}}>
                    {this.state.isFav ? <FaBookmark onClick={this.handleCancel}/> :
                        <FaRegBookmark onClick={this.handleFav}/>}
                </IconContext.Provider>
            </button>
        </OverlayTrigger>

    }
}

export default Bookmark;