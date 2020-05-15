import React from "react";
import CardItem from "./CardItem";
import {animateScroll as scroller} from "react-scroll";
class CardList extends React.Component{
    componentDidMount () {
        scroller.scrollToTop ({smooth: true});
    }

    render () {
        const list = this.props.dataList.data;
        return <div>
            {list.map(data => (
                <CardItem data = {data} key={data.id} onDetail={this.props.onDetail} onLoading={this.props.onLoading}/>
            ))}
        </div>
    }
}
export default CardList;