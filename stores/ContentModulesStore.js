import {BaseStore} from 'fluxible/addons';
import { isLocalStorageOn } from '../common.js';

class ContentModulesStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.moduleType = 'questions';
        this.moduleCount = {'questions': 0, 'datasource': 0, 'comments': 0, 'tags': 0, 'playlists': 0};
        this.selector = {};
    }
    updateContentModules(payload) {
        this.moduleType = payload.moduleType;
        this.selector = payload.selector;
        this.emitChange();
    }
    updateModuleType(payload) {
        this.moduleType = payload.moduleType;
        this.emitChange();
    }
    updateDataSourceCount(payload) {
        this.moduleCount.datasource = payload.count;
        this.emitChange();
    }
    updateTagAndDatasourceCount(payload) {
        this.moduleCount.tags = payload.slide.tags?
            payload.slide.tags.length : 0;

        this.moduleCount.datasource = payload.slide.dataSources?
            payload.slide.dataSources.length : 0;

        this.emitChange();
    }
    updateTagCountDeck(payload) {
        this.moduleCount.tags = payload.deckData.tags?
            payload.deckData.tags.length : 0;

        this.emitChange();
    }
    updateTagsCount(payload){
        this.moduleCount.tags = payload.tagsCount;
        this.emitChange();
    }
    updateQuestionsCount(payload){
        this.moduleCount.questions = payload.count;
        this.emitChange();
    }
    addQuestionSuccess() {
        this.moduleCount.questions++;
        this.emitChange();
    }
    deleteQuestionSuccess() {
        this.moduleCount.questions--;
        this.emitChange();
    }
    updateCommentsCount(payload) {
        this.moduleCount.comments = payload.count;
        this.emitChange();
    }
    addCommentSuccess() {
        this.moduleCount.comments++;
        if (isLocalStorageOn()) {
            localStorage.setItem('commentsCount', this.moduleCount.comments);// save this to compare it later with rehydrated data
        }
        this.emitChange();
    }
    deleteCommentSuccess() {
        this.moduleCount.comments--;
        if (isLocalStorageOn()) {
            localStorage.setItem('commentsCount', this.moduleCount.comments);// save this to compare it later with rehydrated data
        }
        this.emitChange();
    }
    addTagSuccess() {
        this.moduleCount.tags++;
        this.emitChange();
    }
    removeTagSuccess() {
        this.moduleCount.tags--;
        this.emitChange();
    }
    updateDataSourcesSuccess(payload) {
        this.moduleCount.datasource = payload.dataSources.length;

        if (isLocalStorageOn()) {
            localStorage.setItem('sourcesCount', this.moduleCount.datasource);// save this to compare it later with rehydrated data
        }

        this.emitChange();
    }
    getState() {
        return {
            moduleType: this.moduleType,
            selector: this.selector,
            moduleCount: this.moduleCount
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.moduleType = state.moduleType;
        this.selector = state.selector;
        this.moduleCount = state.moduleCount;
    }
    loadPlaylistsCount(payload){
        this.moduleCount.playlists = payload;
        this.emitChange();
    }
    loadPlaylistsCountError(){
        // not critical to show an error
        this.moduleCount.playlists = 0;
        this.emitChange();
    }
    increasePlaylistsCount(){
        this.moduleCount.playlists++;
        this.emitChange();
    }
    decreasePlaylistsCount(){
        this.moduleCount.playlists--;
        this.emitChange();
    }
}

ContentModulesStore.storeName = 'ContentModulesStore';
ContentModulesStore.handlers = {
    'LOAD_CONTENT_MODULES_SUCCESS': 'updateContentModules',
    'UPDATE_MODULE_TYPE_SUCCESS': 'updateModuleType',
    'LOAD_AMOUNT_OF_DATA_SOURCES_SUCCESS': 'updateDataSourceCount',
    'LOAD_AMOUNT_OF_QUESTIONS_SUCCESS': 'updateQuestionsCount',
    'LOAD_AMOUNT_OF_COMMENTS_SUCCESS': 'updateCommentsCount',
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateTagAndDatasourceCount',
    'LOAD_DECK_CONTENT_SUCCESS': 'updateTagCountDeck',
    'ADD_REPLY_SUCCESS': 'addCommentSuccess',
    'REMOVE_TAG': 'removeTagSuccess',
    'NEW_TAG': 'addTagSuccess',
    'ADD_COMMENT_SUCCESS': 'addCommentSuccess',
    'DELETE_COMMENT_SUCCESS': 'deleteCommentSuccess',
    'UPDATE_DATASOURCES_SUCCESS': 'updateDataSourcesSuccess',
    'LOAD_DATASOURCES_SUCCESS': 'updateDataSourcesSuccess',
    'LOAD_AMOUNT_OF_TAGS_SUCCESS': 'updateTagsCount',
    'ADD_QUESTION': 'addQuestionSuccess',
    'DELETE_QUESTION': 'deleteQuestionSuccess', 
    'LOAD_PLAYLISTS_COUNT': 'loadPlaylistsCount', 
    'LOAD_PLAYLISTS_COUNT_FAILURE': 'loadPlaylistsCountError',
    'ADD_DECK_TO_COLLECTION_SUCCESS': 'increasePlaylistsCount', 
    'REMOVE_DECK_FROM_COLLECTION_SUCCESS': 'decreasePlaylistsCount',
};

export default ContentModulesStore;
