import React from "react";
import FavItem from "./FavItem";
import {toast} from "react-toastify";
import "../src/css/CardItem.css";
toast.configure ();
class FavList extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            showAlert: false,
            title: '',
        };
        this.handleToast = this.handleToast.bind(this);
    }

    handleToast(title){
        toast ("Removing " + title, {
            position: toast.POSITION.TOP_CENTER,
            bodyClassName: "toastbody",
            autoClose: 3000,
            progressClassName: 'toastProgress',
        });
    }


    render () {
        if (this.props.dataList.length === 0) {
            return <p style={{textAlign: 'center', fontSize: '18px'}}> You have no saved articles</p>
        }
        return <>
            <h3 style={{paddingLeft: '20px'}}> Favorites </h3>
            <div>
                {this.props.dataList.map (data => (
                    <FavItem key={data.id} data={data}
                             onDetail={this.props.onDetail}
                             onFav={this.props.onFav}
                             onLoading={this.props.onLoading}
                             onAlert={this.handleToast}
                    />
                ))}
            </div>
        </>;
    }
}

export default FavList;