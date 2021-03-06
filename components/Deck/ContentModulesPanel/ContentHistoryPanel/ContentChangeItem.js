import PropTypes from 'prop-types';
import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
//import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common

import cheerio from 'cheerio';
import {NavLink} from 'fluxible-router';

import {getLanguageName, getLanguageNativeName} from '../../../../common';

class ContentChangeItem extends React.Component {

    handleRevertClick() {
        swal({
            text: 'This action will restore the slide to an earlier version. Do you want to continue?',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, restore slide',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            this.context.executeAction(revertRevision, {
                selector: this.props.selector, revisionId: this.props.change.oldValue.ref.revision
            });
        }, (reason) => {
            //done(reason);
        });
    }

    handleViewSlideClick() {
        //open the slide revision in a new tab
        window.open('/slideview/' + this.props.change.value.ref.id + '-' + this.props.change.value.ref.revision, '_blank');
    }

    handleDiffViewClick() {
        const { sid, stype } = this.props.selector;
        const did = this.props.change.value.ref.revision;
        window.open(`/diffview/${stype}/${sid}/${did}`);
    }

    render() {
        let change = this.props.change;

        let description, actionText;
        let iconName = 'write';

        if (change.value && change.value.ref) {
            change.value.ref.title = cheerio.load(change.value.ref.title).text();
        }
        if (change.value && change.value.origin) {
            change.value.origin.title = cheerio.load(change.value.origin.title).text();
        }
        if (change.oldValue && change.oldValue.ref) {
            change.oldValue.ref.title = cheerio.load(change.oldValue.ref.title).text();
        }
        if (change.translated) {
            change.translated.title = cheerio.load(change.translated.title).text();
        }
        switch (change.action) {
            case 'add':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>added {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'copy':
                description = <span>created a duplicate of {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'attach':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>attached {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'fork':
                iconName = 'fork';
                description = <span>created a fork of deck <NavLink href={'/deck/' + change.value.origin.id + '-' + change.value.origin.revision}>{change.value.origin.title}</NavLink></span>;
                break;
            case 'translate':
                iconName = 'translate';
                description =
                    <span>added { getLanguageName(change.translated.language) } translation for {change.translated.kind} <em>{change.translated.title}</em>
                    </span>;
                break;
            case 'revise':
                iconName = 'save';
                description = <span>created a new version of {change.oldValue.kind} <em>{change.oldValue.ref.title}</em></span>;
                break;
            case 'rename':
                description = <span>renamed {change.renamed.kind} <em>{change.renamed.from}</em> to <em>{change.renamed.to}</em></span>;
                break;
            case 'revert':
                iconName='history';
                description = <span>restored {change.oldValue.kind} <em>{change.oldValue.ref.title}</em> to an earlier version</span>;
                break;
            case 'remove':
                iconName = 'trash alternate';
                description = <span>removed {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'edit':
                actionText = change.value.variant ? 'edited slide translation' : 'edited slide';
                description = <span>{actionText} <em>{change.value.ref.title}</em></span>;
                break;
            case 'move':
                iconName = 'move';
                if (this.props.selector.stype === 'slide') {
                    description = 'moved the slide';
                } else if (parseInt(this.props.selector.sid) === change.value.ref.id) {
                    description = 'moved the deck';
                } else {
                    description = <span>moved {change.value.kind} <em>{change.value.ref.title}</em></span>;
                }
                break;
            case 'update':
                description = <span>updated deck <em>{change.path[change.path.length - 1].title}</em></span>;
                break;
            case 'translate':
                
                break;
            default:
                description = <span>updated the deck</span>;
        }

        let buttons;
        if (this.props.selector.stype === 'slide' && ['add', 'attach', 'copy', 'edit', 'rename', 'revert'].includes(change.action) ) {
            // buttons are shown only for slide history and only for changes that result in new slide revisions

            const canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
            const isCurrent = this.props.selector.sid === `${this.props.change.value.ref.id}-${this.props.change.value.ref.revision}`;

            const currentRev = parseInt(this.props.selector.sid.split('-')[1]);
            const shouldView = currentRev !== change.value.ref.revision;

            const canRestore = this.props.permissions.edit && !this.props.permissions.readOnly
                && change.oldValue && currentRev !== change.oldValue.ref.revision;

            buttons = <Button.Group basic size='tiny' floated='right'>
                            <Button aria-label='Compare to current slide version' icon='exchange' disabled={isCurrent} onClick={this.handleDiffViewClick.bind(this)}/>
                            <Button aria-label='Restore slide' icon='history' disabled={!canEdit || !canRestore}
                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                        <Button aria-label='View slide' icon tabIndex='0' disabled={!shouldView} onClick={this.handleViewSlideClick.bind(this)}>
                            <Icon.Group>
                                <Icon name='unhide'/>
                                <Icon name='external' corner/>
                            </Icon.Group>
                        </Button>
            </Button.Group>;
        }

        const datechange = new Date(change.timestamp);
        return (
            <List.Item>
                <Icon name={iconName} />
                <List.Content style={{width:'100%'}} tabIndex='0'>
                    <List.Header>
                        <NavLink className="user"
                                          href={'/user/' + change.username}> {change.userDisplayName}</NavLink> {description} {buttons}
                    </List.Header>
                    {/*<List.Description>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</List.Description>*/}
                    <List.Description>{formatDate(change.timestamp)}, on { datechange.toLocaleDateString('en-GB')} at {datechange.toLocaleTimeString('en-GB')}</List.Description>
                </List.Content>
            </List.Item>
        );
    };
}

ContentChangeItem.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default ContentChangeItem;
