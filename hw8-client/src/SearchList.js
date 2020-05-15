import React from "react";
import SearchItem from "./SearchItem";

class SearchList extends React.Component {

    render () {
        return <div className="view">
            {this.props.dataList.map (data => (
                <SearchItem key={data.id}
                            data={data}
                            onDetail={this.props.onDetail}
                            onLoading={this.props.onLoading}
                            onClearValue={this.props.onClearValue}/>
            ))}
        </div>;

    }
}

export default SearchList;