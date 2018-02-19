import React from 'react';
import CardSearchResultItem from './CardSearchResultItem';

class SearchRestulsList extends React.Component {
    render() {
        let results = this.props.items.map( (data, index) => {
            return <CardSearchResultItem key={index} data={data} />;
        });

        return (
            <div className="ui four stackable doubling cards">
                { results }
            </div>
        );
    }
}

export default SearchRestulsList;
