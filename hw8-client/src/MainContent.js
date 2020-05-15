import React from "react";
import CardList from "./CardList";
import DetailPage from "./DetailPage";
import SearchList from "./SearchList";
import FavList from "./FavList";
import LoadPage from "./LoadPage";


class MainContent extends React.Component {
    render () {

        const status = this.props.status;
        const dataList = this.props.dataList;
        let showPage;

        if (status === 0) {
            showPage = <LoadPage/>
        } else if (status === 1) {
            showPage = <CardList dataList={dataList} onDetail={this.props.onDetail} onLoading={this.props.onLoading}/>;
        } else if (status === 2) {
            const nav = document.getElementsByClassName ("navbar-nav")[0];
            const aList = nav.children;
            const len = aList.length;
            for (let i = 0; i < len; ++i) {
                aList[i].classList.remove ("active");
            }
            showPage = <>
                <h3 style={{paddingLeft: '20px'}}> Results </h3>
                <SearchList dataList={dataList} onDetail={this.props.onDetail} onLoading={this.props.onLoading} onClearValue={this.props.onClearValue}/>
            </>;
        } else if (status === 3) {
            const nav = document.getElementsByClassName ("navbar-nav")[0];
            const aList = nav.children;
            const len = aList.length;
            for (let i = 0; i < len; ++i) {
                aList[i].classList.remove ("active");
            }
            showPage = (<div>
                <DetailPage data={dataList} isFavView={this.props.isFavView}/>
            </div>);
        } else {
            const nav = document.getElementsByClassName ("navbar-nav")[0];
            const aList = nav.children;
            const len = aList.length;
            for (let i = 0; i < len; ++i) {
                aList[i].classList.remove ("active");
            }
            showPage = <FavList dataList={dataList} onDetail={this.props.onDetail} onFav={this.props.onFav}
                                onLoading={this.props.onLoading}/>
        }
        return showPage;
    }
}

export default MainContent;