import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import UserGroupsStore from '../../stores/UserGroupsStore';
import UserProfileStore from '../../stores/UserProfileStore';
import Info from './Info';
import Menu from './Menu';
import Details from './Details';



//import UserDecks from './UserDecks';
//import UserCollections from '../../../DeckCollection/UserCollections';

class UserGroupPage extends React.Component {
    constructor(props){
        super(props);
    }

    showDecks(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });
        return '';
        // return <UserDecks decks={this.props.decks} decksMeta={this.props.decksMeta} deckListType={this.props.categoryItem} loadMoreLoading={this.props.loadMoreLoading} loadMoreError={this.props.loadMoreError} user={this.props.user} loggedinuser={this.props.loggedinuser} isAdmin={ isAdmin } isCreator={ isCreator } />;
    }

    showCollections(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });
        return '';
        // return <UserCollections user={this.props.user} loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} isAdmin={ isAdmin } isCreator={ isCreator } />;
    }

    showDetails(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator && group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });
        const isMember = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid;
        });
        return <Details currentUsergroup={ this.props.UserGroupsStore.currentUsergroup }
            isAdmin={ isAdmin } isCreator={ isCreator } isMember={isMember}
            saveUsergroupError={this.props.UserGroupsStore.saveUsergroupError}
            username={this.props.UserProfileStore.username}
            displayName={this.props.UserProfileStore.user.displayName}
            userid={this.props.UserProfileStore.userid}
            saveUsergroupIsLoading={this.props.UserGroupsStore.saveUsergroupIsLoading}
            picture={this.props.UserProfileStore.user.picture} />;
    }

    chooseView(){
      console.log('chooseView', this.props.UserGroupsStore.category);
        switch(this.props.UserGroupsStore.category){
            case 'settings':
                return this.showDetails();
            case 'decks':
                return this.showDecks();
            case 'playlists':
                return this.showCollections();
            default:
                return this.showDetails();
        }
    }

    render() {
        let profileClasses = classNames({
            'tablet': true,
            'computer': true,
            'only': true,
            'sixteen': true,
            'wide': true,
            'column': true
        });
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                <div className = "ui stackable grid ">
                  <div className = {profileClasses}>
                      <Info group={ this.props.UserGroupsStore.currentUsergroup } />
                  </div>
                  <div className = "sixteen wide column">
                      <Menu group={ this.props.UserGroupsStore.currentUsergroup } />
                  </div>
                </div>
              </div>
              <div className = "twelve wide column" >
                  {this.chooseView()}
              </div>
              <div className="ui tab" data-tab="activity"></div>
          </div>
        );
    }
}

UserGroupPage.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

UserGroupPage = connectToStores(UserGroupPage, [UserGroupsStore, UserProfileStore], (context, props) => {
    return {
        UserGroupsStore: context.getStore(UserGroupsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default UserGroupPage;
