import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'questions',
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};

        if(resource === 'questions.list') {
            rp.get({
                // uri: 'https://questionservice.experimental.slidewiki.org/questions',
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid.split('-')[0] + '/' + 'questions?include_subdecks_and_slides=true'
            }).then((res) => {

                let questions = JSON.parse(res).map((item, index) => {
                    return {
                        id: item.id, title: item.question, difficulty: item.difficulty, relatedObject: item.related_object, relatedObjectId: item.related_object_id, relatedObjectName: item.related_object_name,
                        answers: item.choices
                            .map((ans, ansIndex) => {
                                return {answer: ans.choice, correct: ans.is_correct};
                            }),
                        explanation: item.explanation,
                        userId: item.user_id,
                    };
                });
                callback(null, {questions: questions, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        } else if(resource === 'questions.count') {
            rp.get({
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid.split('-')[0] + '/' + 'questions?metaonly=true&include_subdecks_and_slides=true',
            }).then((res) => {
                callback(null, {count: JSON.parse(res).count});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }

        /* Hard coded sample work follows */
        /*
            let questions = [
                {id: 12, title: 'Super exciting question', username: 'Ilya B.', userID: 66, difficulty: 2, Date: 'yesterday',
                    answers: [{answer: 'Yes', correct: true, explanation: 'Obvious'},
                            {answer: 'No', correct: false, explanation: ''},
                            {answer: 'May be', correct: true, explanation: 'May the power comes with you!'},
                            {answer: 'I do not know', correct: false, explanation: ''}]},
                {id: 23, title: 'Title for question 2', username: 'Vuk M.', userID: 7, difficulty: 1, Date: '2 hours agp',
                    answers: [{answer: 'Answer 1', correct: false, explanation: 'Some explanation'},
                            {answer: 'Answer 2', correct: false, explanation: ''},
                            {answer: 'Correct answer', correct: true, explanation: ''}]},
                {id: 40, title: 'Very difficult question', username: 'Ali K', userID: 23, difficulty: 3, Date: '23 minutes ago',
                    answers: [{answer: 'Meh...', correct: false, explanation: ''},
                            {answer: 'Make a smart look during the answering...', correct: true, explanation: 'Be simple'}]},
                {id: 22, title: 'Extriemly hard to answer', username: 'Ali K', userID: 23, difficulty: 3, Date: 'yesterday',
                    answers: [{answer: 'Have no idea', correct: false, explanation: ''},
                            {answer: 'The correct one', correct: true, explanation: ''},
                            {answer: 'Also correct', correct: true, explanation: ''}]},
                {id: 16, title: 'The easiest one for everyone!', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                            {answer: 'False', correct: false, explanation: ''}]},
                {id: 1, title: 'Second Super exciting question', username: 'Ilya B.', userID: 66, difficulty: 2, Date: 'yesterday',
                    answers: [{answer: 'Yes', correct: true, explanation: 'Obvious'},
                                        {answer: 'No', correct: false, explanation: ''},
                                        {answer: 'May be', correct: true, explanation: 'May the power comes with you!'},
                                        {answer: 'I do not know', correct: false, explanation: ''}]},
                {id: 2, title: 'Title for question 2. Some more stuff', username: 'Vuk M.', userID: 7, difficulty: 1, Date: '2 hours agp',
                    answers: [{answer: 'Answer 1', correct: false, explanation: 'Some explanation'},
                                        {answer: 'Answer 2', correct: false, explanation: ''},
                                        {answer: 'Correct answer', correct: true, explanation: ''}]},
                {id: 3, title: 'Very difficult question 2', username: 'Ali K', userID: 23, difficulty: 3, Date: '23 minutes ago',
                    answers: [{answer: 'Meh...', correct: false, explanation: ''},
                                        {answer: 'Make a smart look during the answering...', correct: true, explanation: 'Be simple'}]},
                {id: 4, title: 'Extriemly hard to answer 2', username: 'Ali K', userID: 23, difficulty: 3, Date: 'yesterday',
                    answers: [{answer: 'Have no idea', correct: false, explanation: ''},
                                        {answer: 'The correct one', correct: true, explanation: ''},
                                        {answer: 'Also correct', correct: true, explanation: ''}]},
                {id: 5, title: 'The easiest one for everyone! 2', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                                        {answer: 'False', correct: false, explanation: ''}]},
                {id: 6, title: 'The easiest one for everyone! 3', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                                        {answer: 'False', correct: false, explanation: ''}]}
            ];

            let length = questions.length;
            let lowerBound = (args.pageNum - 1) * args.maxQ;
            let upperBound = lowerBound + args.maxQ;
            if (upperBound > length){
                upperBound = length;
            }

            questions = questions.slice(lowerBound, upperBound);
            callback(null, {questions: questions, totalLength: length, selector: selector});
        }
    },
    */
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        let choices = [];
        if (args.question.answer1 !== '') {
            choices.push({'choice': args.question.answer1, 'is_correct': args.question.correct1});
        }
        if (args.question.answer2 !== '') {
            choices.push({'choice': args.question.answer2, 'is_correct': args.question.correct2});
        }
        if (args.question.answer3 !== '') {
            choices.push({'choice': args.question.answer3, 'is_correct': args.question.correct3});
        }
        if (args.question.answer4 !== '') {
            choices.push({'choice': args.question.answer4, 'is_correct': args.question.correct4});
        }

        if (resource === 'questions.add') {
            rp.post({
                uri: Microservices.questions.uri + '/' + args.question.relatedObject + '/question',
                body:JSON.stringify({
                    user_id: args.question.userId.toString(),
                    related_object_id: args.question.relatedObjectId.split('-')[0],
                    //related_object: args.question.relatedObject,
                    difficulty: parseInt(args.question.difficulty),
                    choices: choices,
                    question: args.question.title,
                    explanation: args.question.explanation})
            }).then((res) => {
                let question = JSON.parse(res);
                const answers = question.choices
                    .map((ans, ansIndex) => {
                        return {answer: ans.choice, correct: ans.is_correct};
                    });
                callback(null, {question: {
                    id: question.id, title: question.question, difficulty: question.difficulty, relatedObject: question.related_object, relatedObjectId: question.related_object_id,
                    answers: answers,
                    explanation: question.explanation,
                    userId: question.user_id
                }});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }

    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;

        let choices = [];
        let answers = [];//There is a problem with different names used on the platform and service
        if (args.question.answer1 !== '') {
            choices.push({'choice': args.question.answer1, 'is_correct': args.question.correct1});
            answers.push({'answer': args.question.answer1, 'correct': args.question.correct1});
        }
        if (args.question.answer2 !== '') {
            choices.push({'choice': args.question.answer2, 'is_correct': args.question.correct2});
            answers.push({'answer': args.question.answer2, 'correct': args.question.correct2});
        }
        if (args.question.answer3 !== '') {
            choices.push({'choice': args.question.answer3, 'is_correct': args.question.correct3});
            answers.push({'answer': args.question.answer3, 'correct': args.question.correct3});
        }
        if (args.question.answer4 !== '') {
            choices.push({'choice': args.question.answer4, 'is_correct': args.question.correct4});
            answers.push({'answer': args.question.answer4, 'correct': args.question.correct4});
        }

        if (resource === 'questions.update') {
            rp.put({
                uri: Microservices.questions.uri + '/question/' + args.question.qid,
                body:JSON.stringify({
                    user_id: args.question.userId.toString(),
                    related_object_id: args.question.relatedObjectId.split('-')[0],
                    related_object: args.question.relatedObject,
                    difficulty: parseInt(args.question.difficulty),
                    choices: choices,
                    question: args.question.title,
                    explanation: args.question.explanation
                })
            }).then((res) => {
                const question = {
                    id: args.question.qid, title: args.question.title, difficulty: parseInt(args.question.difficulty), relatedObject: args.question.relatedObject, relatedObjectId: args.question.relatedObjectId.split('-')[0],
                    answers: answers,
                    explanation: args.question.explanation,
                    userId: args.question.userId.toString()
                };
                callback(null, {question: question});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },

    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'questions.delete') {
            rp.delete({
                uri: Microservices.questions.uri + '/question/' + args.questionId
            }).then((res) => {
                console.log('Question delete should be successful. Check via swagger for questionId:', args.questionId);
                callback(null, {questionId: args.questionId});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },
};
