import React from 'react';
import Thumbnail from '../../common/Thumbnail';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';
import { Microservices } from '../../../configs/microservices';

class CardSearchResultItem extends React.Component {


    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        // console.log('DeckCard: cardContent', this.props);
        console.log(this.props.data);

        let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/`;
        let thumbnailId = (this.props.kind === 'Deck') ? this.props.data.firstSlide : this.props.data.db_id;
        if (thumbnailId) {
            thumbnailURL += thumbnailId;
            if (this.props.data.theme) {
                thumbnailURL += '/' + this.props.data.theme;
            }
        } else {
            thumbnailURL = this.props.data.picture;
        }

        let description = (this.props.data.description && this.props.data.description.length > 100) ? this.props.data.description.slice(0,99) + '...' : this.props.data.description;
        return (
            <div className='card'>
                
                <NavLink className="ui medium centered spaced image" aria-hidden={'true'}  tabIndex={'-1'} href={'/deck/' + this.props.data.db_id}>
                    <Thumbnail url={thumbnailURL} alt={''}
                        slideId={this.props.data.db_id} />
                </NavLink>
                

                <div className="content">
                    {
                        this.props.data.title.length > 25 ? (
                            <a href={'/deck/' + this.props.data.db_id} data-tooltip={this.props.data.title}><h3 className="header" tabIndex="0">{this.props.data.title.slice(0,24) + '...'}</h3></a>
                        ) : (
                            <a href={'/deck/' + this.props.data.db_id}><h3 className="header" tabIndex="0">{this.props.data.title}</h3></a>
                        )
                    }
                    <div className="meta">
                    {this.props.data.kind}
                    {
                        // <span className="right floated meta">
                        //     <i className="thumbs up icon" aria-label="Number of likes"></i>{this.props.cardContent.noOfLikes}
                        // </span>
                    }
                        <i className="edit icon" aria-label="Last updated">{this.props.data.lastUpdate}</i>

                    </div>
                </div>
                <div className="ui menu top attached">
                    <div className="ui fluid basic buttons">
                        <a href={'/deck/' + this.props.data.db_id} data-tooltip="Open deck" type="button" role="button" className="ui button" aria-label="Open deck">
                            <i className="blue external square large icon" tabIndex="0"></i>
                        </a>
                        <a href={'/presentation/' + this.props.data.db_id + '/' + this.props.data.db_id} target="_blank" className="ui button" type="button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                            <i className="grey circle play large icon" tabIndex="0"></i>
                        </a>
                        <a href={'/presentation/' + this.props.data.db_id + '/' + this.props.data.db_id} target="_blank" className="ui button" type="button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                            <i className="grey plus large icon" tabIndex="0"></i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

CardSearchResultItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CardSearchResultItem;
