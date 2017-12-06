import React from 'react';
import { getIntlLanguage } from '../../../common.js';
import CategoryBox from './CategoryBox';
import ChangePicture from './ChangePicture';
import ChangePassword from './ChangePassword';
import DeactivateAccount from './DeactivateAccount';
import ChangePersonalData from './ChangePersonalData';
import IntlStore from '../../../stores/IntlStore';
import UserGroups from './UserGroups';
import UserGroupEdit from './UserGroupEdit';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import PrivatePublicUserProfile from './PrivatePublicUserProfile/PrivatePublicUserProfile';
import Integrations from './Integrations';
import { categories } from '../../../actions/user/userprofile/chooseAction';

class UserProfile extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {
        if (this.props.UserProfileStore.dimmer.success === true)
            swal({
                type: 'success',
                text: '',
                title: 'Changes have been applied',
                timer: 2600,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {
            },() => {//dismiss function
                if(this.props.IntlStore.currentLocale !== getIntlLanguage() ||
                (this.props.UserProfileStore.category === categories.categories[0] && this.props.UserProfileStore.categoryItem === categories.settings[0]) ) //user to reload page beacuse of cookie change or picture change
                    window.location.reload();
            }).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.userdeleted === true)
            swal({
                type: 'success',
                text: '',
                title: 'Your Account has been deleted',
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {}).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.failure === true)
            swal({
                title: 'Error',
                text: 'Something went wrong',
                type: 'error',
                allowEscapeKey: false,
                allowOutsideClick: false,
                confirmButtonText: 'OK',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            })
            .then(() => {}).catch(swal.noop);
    }

    chooseView() {
        switch(this.props.UserProfileStore.category){
            case categories.categories[0]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.settings[0]:
                        return this.displayUserSettings();
                        break;
                    case categories.settings[1]:
                        return this.displayAccounts();
                        break;
                    case categories.settings[2]:
                        return this.displayIntegrations();
                        break;
                    default:
                        return this.notImplemented();
                }});
            case categories.categories[1]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.groups[0]:
                        return this.displayGroups();
                        break;
                    case categories.groups[1]:
                        return this.displayGroupedit();
                        break;
                    default:
                        return this.notImplemented();
                }});
            default:
                return this.displayUserProfile();
        };
    }

    addScaffold(toInsert){
        return (
            <div className = "ui vertically padded stackable grid container" >
                <div className = "four wide column" >
                    <CategoryBox highlight = { this.props.UserProfileStore.categoryItem } username = { this.props.UserProfileStore.username } />
                    <div className = "ui hidden divider" />
                </div>
                <div className = "twelve wide column" >
                    {toInsert()}
                </div>
            </div>
        );
    }

    displayUserSettings() {
        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Exchange picture</h3>
                  </div>
                  <div className="ui segment">
                      <ChangePicture user={ this.props.UserProfileStore.user }/>
                  </div>

              </div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Alter my personal data</h3>
                  </div>
                  <div className="ui segment">
                      <ChangePersonalData localeFlags={false} user={ this.props.UserProfileStore.user } failures={ this.props.UserProfileStore.failures } saveProfileIsLoading={this.props.UserProfileStore.saveProfileIsLoading} />
                  </div>

              </div>
          </div>);
    }

    displayAccounts() {
        let changePassword = (this.props.UserProfileStore.user.hasPassword) ? (
                <div className="ui segments">
                  <div className="ui secondary segment">
                    <h3>Change password</h3>
                  </div>

                  <div className="ui segment">
                    <ChangePassword failures={ this.props.UserProfileStore.failures } dimmer={this.props.UserProfileStore.dimmer}/>
                  </div>
                </div>
            ) : '';
        return (
          <div>
            {changePassword}
            <div className="ui segments">
              <div className="ui red inverted segment">
                <h3>Deactivate Account</h3>
              </div>

              <div className="ui segment">
                <DeactivateAccount />
              </div>
            </div>
        </div>);
    }

    displayUserProfile() {
        return (<PrivatePublicUserProfile user={this.props.UserProfileStore.user} decks={this.props.UserProfileStore.userDecks} loggedinuser={this.props.UserProfileStore.username} category={this.props.UserProfileStore.category} deckCollections={this.props.UserProfileStore.userDeckCollections} loadDeckCollectionsError={this.props.UserProfileStore.updateDeckCollectionsError}/>);
    }

    displayIntegrations() {
        return (
            <Integrations removeProviderError={this.props.UserProfileStore.removeProviderError} addProviderError={this.props.UserProfileStore.addProviderError} addProviderAlreadyUsedError={this.props.UserProfileStore.addProviderAlreadyUsedError} providerAction={this.props.UserProfileStore.providerAction} providers={this.props.UserProfileStore.user.providers} hasPassword={this.props.UserProfileStore.user.hasPassword}/>
        );
    }

    displayGroups() {
        return (<UserGroups error={this.props.UserProfileStore.deleteUsergroupError} status={this.props.UserProfileStore.usergroupsViewStatus} groups={this.props.UserProfileStore.user.groups} username={this.props.UserProfileStore.username} userid={this.props.UserProfileStore.userid} />);
    }

    displayGroupedit() {
        return (<UserGroupEdit saveUsergroupError={this.props.UserProfileStore.saveUsergroupError} username={this.props.UserProfileStore.username} currentUsergroup={this.props.UserProfileStore.currentUsergroup} userid={this.props.UserProfileStore.userid} saveUsergroupIsLoading={this.props.UserProfileStore.saveUsergroupIsLoading} picture={this.props.UserProfileStore.user.picture} />);
    }

    notImplemented() {
        return (<h3>This feature is curently not implemented. Please wait for future releases of SlideWiki</h3>);
    }

    render() {
        return (this.chooseView());
    }
}

UserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserProfile = connectToStores(UserProfile, [UserProfileStore,IntlStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        IntlStore: context.getStore(IntlStore).getState()
    };
});

export default UserProfile;
