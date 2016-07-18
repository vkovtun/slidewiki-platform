import async from 'async';
import {shortTitle} from '../configs/general';
import DeckPageStore from '../stores/DeckPageStore';
import loadContent from './loadContent';
import loadDeckTree from './decktree/loadDeckTree';
import loadContributors from './loadContributors';
import loadTranslations from './loadTranslations';
import loadDataSources from './datasource/loadDataSources';
import loadActivities from './activityfeed/loadActivities';
import loadSimilarContents from './loadSimilarContents';
import error_desc from '../components/Error/errorDesc';
let fumble = require('fumble');

export default function loadDeck(context, payload, done) {
    if (!(/^\d+$/.test(payload.params.id) && Number.parseInt(payload.params.id) >= 0)) {
        let error = fumble.http.badRequest(error_desc.DECK_ID_TYPE_INCORRECT);
        context.dispatch('DECK_ID_ERROR', {code: error.statusCode, message: error.message});
        throw error;
    }
    /* TODO
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.dispatch('DECK_CONTENT_TYPE_ERROR', http400);
    }


    if (!(/^[0-9a-zA-Z]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        //console.log('Slide id incorrect. Loading deck failed.');
        context.dispatch('DECK_PARAMS_TYPE_ERROR', http400);
    }

    if (!(payload.params.spath && (/^[0-9:;]+$/.test(payload.params.spath)) || payload.params.spath === undefined)) {
        //console.log('Incorrect path. Loading deck failed.');
        context.dispatch('DECK_PARAMS_TYPE_ERROR', http400);
    }

    if (!(payload.params.mode || payload.params.mode === undefined)) {
        //console.log('Incorrect mode. Loading deck failed.');
        context.dispatch('DECK_PARAMS_TYPE_ERROR', http400);
    }
    */
    //we should store the current content state in order to avoid duplicate load of actions
    let currentState = context.getStore(DeckPageStore).getState();
    let runNonContentActions = 1;
    let pageTitle = shortTitle + ' | Deck | ' + payload.params.id;
    let payloadCustom = payload;
    //if no specific content selector is given, use the deck type, view mode and root deck id as default selector
    if(!payload.params.stype) {
        payloadCustom.params.stype = 'deck';
    }
    if(!payload.params.sid) {
        payloadCustom.params.sid = payload.params.id;
    }
    //path is an optional parameter which might get confused with the mode, therefore we need to disambiguate it:
    if(payload.params.spath) {
        if(!payload.params.mode){
            //if spath does not have ';' and ':' as separator, it means it refers to the mode
            if(payload.params.spath.indexOf(':') === -1 && payload.params.spath.indexOf(';') === -1){
                payloadCustom.params.mode = payload.params.spath;
                payloadCustom.params.spath = '';
            }else{
                payloadCustom.params.mode = 'view';
            }
        }
    }else{
        payloadCustom.params.spath = '';
        payloadCustom.params.mode = 'view';
    }
    context.dispatch('UPDATE_DECK_PAGE_CONTENT', payloadCustom);
    pageTitle = pageTitle + ' | ' + payloadCustom.params.stype + ' | ' + payloadCustom.params.sid + ' | ' + payloadCustom.params.mode;
    if((currentState.selector.id === payloadCustom.params.id) && (currentState.selector.spath === payloadCustom.params.spath)){
        runNonContentActions = 0;
    }
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadContent, payloadCustom, callback);
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadTranslations, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadDeckTree, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadContributors, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadActivities, payloadCustom, callback);
            }else{
                callback();
            }
        },
        (callback) => {
            if(runNonContentActions){
                context.executeAction(loadSimilarContents, payloadCustom, callback);
            }else{
                callback();
            }
        }
    ],
    // final callback
    (err, results) => {
        if (err){
            console.log(err, 'Something extra');
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
