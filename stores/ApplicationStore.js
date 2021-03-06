import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = '';
        //this.frozen = false;
    }
    handlePageTitle(payload) {
        this.dispatcher.waitFor(RouteStore, () => {
            //if (!this.frozen || payload.allowUnfreeze) {
            this.pageTitle = payload.pageTitle;
            //    this.frozen = payload.frozen;
            //}
            this.emitChange();
        });
    }
    getPageTitle() {
        return this.pageTitle;
    }
    dehydrate() {
        return {
            pageTitle: this.pageTitle
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
    }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
    'UPDATE_PAGE_TITLE': 'handlePageTitle'
};

export default ApplicationStore;
