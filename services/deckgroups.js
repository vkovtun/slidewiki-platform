import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;
const async = require('async');

export default {
    name: 'deckgroups',

    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        let usergroups = (params.usergroups || []).map( (usergroup) => {
            return usergroup._id;
        }).join('&usergroup=');

        // suggest deck collections that this user can add decks to
        if(resource === 'deckgroups.forUser'){

            // form request call
            let uri = `${Microservices.deck.uri}/groups?user=${args.userId}`;
            if(usergroups !== ''){
                uri += `&usergroup=${usergroups}`;
            }
            uri += '&page=0&per_page=100';
            
            // get deck collections that the user is either admin or a creator of a user group that is associated to this collection
            rp({
                method: 'GET', 
                uri: uri,
                json: true 
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));
        } else if (resource === 'deckgroups.forDeck'){

            let uri = `${Microservices.deck.uri}/deck/${args.sid}/groups?user=${args.userId}`;
            if(usergroups !== ''){
                uri += `&usergroup=${usergroups}`;
            }

            rp({
                method: 'GET', 
                uri: uri,
                json: true 
            }).then( (deckGroups) => callback(null, deckGroups))
            .catch( (err) => callback(err));
        }
        
    }, 

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        let payload = {
            title: args.title, 
            description: args.description,
            decks: []
        };

        // add userGroup if given 
        if(args.userGroup !== ''){
            payload.userGroup = args.userGroup;
        }

        rp({
            method: 'POST',
            uri: `${Microservices.deck.uri}/groups`,
            json: true,
            headers: {'----jwt----': args.jwt},
            body: payload
        }).then((deckGroup) => callback(null, deckGroup))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;

        let usergroups = params.usergroups.map( (usergroup) => {
            return usergroup._id;
        }).join('&usergroup=');

        // update deck assignments to deck groups
        if(resource === 'deckgroups.decks'){

            let uri = `${Microservices.deck.uri}/deck/${args.deckId}/groups?user=${params.userId}`;

            if(usergroups !== ''){
                uri += `&usergroup=${usergroups}`;
            }
            
            // get deck groups assigned to current deck
            rp({
                method: 'GET', 
                uri: uri, 
                json: true
            }).then( (existingDeckGroups) => {
                let existingDeckGroupIds = existingDeckGroups.map( (e) => { return e._id; });
                let addOps = [];
                let removeOps = existingDeckGroupIds.map( (e) => { return {groupId: e, updateOp: {op: 'remove', deckId: args.deckId}}; } );

                // check if deck group ids given are already related to this deck
                args.collections.forEach( (deckGroupId) => {
                    if(existingDeckGroupIds.includes(deckGroupId)){
                        // deck is already related to this deck group
                        removeOps = removeOps.filter( (e) => { return e.groupId !== deckGroupId; });
                    } else {
                        addOps.push({groupId: deckGroupId, updateOp: {op: 'add', deckId: args.deckId}});
                    }
                });
            
                // add/remove deck id to/from the following deck groups
                async.eachSeries(addOps.concat(removeOps), (item, done) => {
                    rp({
                        method: 'PATCH', 
                        uri: `${Microservices.deck.uri}/group/${item.groupId}/decks`,
                        json: true,
                        headers: {'----jwt----': args.jwt},
                        body: [
                            item.updateOp
                        ]
                    }).then( () => done())
                    .catch(done);
                }, (err) => {
                    if(err){
                        callback(err);
                    } else {
                        callback(null, {});
                    }
                });
            }).catch( (err) => {
                callback(err);
            });
        }
    }
};
