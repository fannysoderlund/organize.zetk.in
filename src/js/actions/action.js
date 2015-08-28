import { Actions } from 'flummox';
import Z from 'zetkin';


export default class ActionActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveAllActions() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions').get();
    }

    retrieveAction(id) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', id).get();
    }

    updateAction(id, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', id).patch(data);
    }

    clearActionHighlights() {
        return true;
    }

    highlightActionPhase(locId, phase) {
        return {
            locId,
            phase
        };
    }

    highlightActionLocation(locId) {
        return locId;
    }

    highlightActions(actionIds) {
        return actionIds;
    }

    createAction(campId, data) {
        const orgId = this.flux.getStore('org').getActiveId();
        const res = Z.resource('orgs', orgId, 'campaigns', campId, 'actions');
        return res.post(data);
    }
}
