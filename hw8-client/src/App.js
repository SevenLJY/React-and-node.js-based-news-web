import React from 'react';
import MyNav from "./MyNav";
import MainContent from './MainContent';

class App extends React.Component {
    constructor (props) {
        super (props);
        /* pageStatus
        * 0: loading
        * 1: home/section news
        * 2: search news
        * 3: detail page
        * 4: favFolder page
        * */
        this.state = {
            isFavView: false,
            dataList: [],
            pageStatus: 0,
            needHidden: false,
            openFav: false,
            searchValue: ''
        };
        this.handleNavChange = this.handleNavChange.bind (this);
        this.handleSearchChange = this.handleSearchChange.bind (this);
        this.handleDetailView = this.handleDetailView.bind (this);
        this.handleFavView = this.handleFavView.bind (this);
        this.handleLoading = this.handleLoading.bind (this);
        this.setSearchValue = this.setSearchValue.bind(this);
        this.clearSearchValue = this.clearSearchValue.bind(this);
    }

    setSearchValue(keyword){
        this.setState({searchValue: keyword});
    }

    clearSearchValue(){
        this.setState({searchValue: ''})
    }

    handleLoading () {
        this.setState ({pageStatus: 0})
    }

    handleNavChange (data) {
        this.setState ({pageStatus: 1, dataList: data, needHidden: false, openFav:false});
    }


    handleSearchChange (data) {
        this.setState ({pageStatus: 2, dataList: data, needHidden: true, openFav: false});
    }

    handleDetailView (data, isFav) {
        this.setState ({pageStatus: 3, dataList: data, isFavView: isFav, needHidden: true, openFav: false});
    }

    handleFavView (data) {
        this.setState ({pageStatus: 4, dataList: data, needHidden: true, openFav: true});
    }

    componentDidMount () {
        const items = {items: []};
        localStorage.setItem ('fav_ljy', JSON.stringify (items));
    }

    render () {
        return (
            <div className="App">
                <MyNav onNavLinkChange={this.handleNavChange}
                       onSearchChange={this.handleSearchChange}
                       onFav={this.handleFavView}
                       hidden={this.state.needHidden}
                       searchValue={this.state.searchValue}
                       onSetValue={this.setSearchValue}
                       onClearValue={this.clearSearchValue}
                       openFav={this.state.openFav}
                       onLoading={this.handleLoading}/>
                <MainContent status={this.state.pageStatus}
                             dataList={this.state.dataList}
                             onDetail={this.handleDetailView}
                             isFavView={this.state.isFavView}
                             onClearValue={this.clearSearchValue}
                             onFav={this.handleFavView}
                             onLoading={this.handleLoading}/>
            </div>
        );
    }
}

export default App;