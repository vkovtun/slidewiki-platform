import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function codeClick(context, payload, done) {
    context.dispatch('CODE_CLICK', {});
}
