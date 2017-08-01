import {Microservices} from '../configs/microservices';
import secrets from '../configs/secrets';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
import SMTPConnection from 'smtp-connection';
const log = require('../configs/log').log;

export default {
    name: 'email',
    // At least one of the CRUD methods is Required
    create: (req, resource, params, body, config, callback) => {
        if (!params.from || !params.to || !params.subject || !params.message)
            callback('Error: Missing parameters', null);

        let connection;
        try {
            connection = new SMTPConnection({
                host: secrets.SMTP.host,
                port: secrets.SMTP.port,
                name: secrets.SMTP.clientName,
                connectionTimeout: 4000,
                opportunisticTLS: true,
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
        catch (e) {
            console.log(e);
            return callback('Wrong SMTP configuration');
        }

        connection.on('error', (err) => {
            console.log('ERROR on SMTP Client:', err);
            if (process.env.NODE_ENV === 'test')
                return callback(null, {email: email, message:  'dummy'});//DEBUG
            return callback(err);
        });

        connection.connect((result) => {
            //Result of connected event
            console.log('Connection established with result', result, 'and connection details (options, secureConnection, alreadySecured, authenticated)', connection.options, connection.secureConnection, connection.alreadySecured, connection.authenticated);

            connection.send({
                from: params.from,
                to: params.to
            },
            'From: <' + params.from + '>\r\n' + 'To: <' + params.to + '>\r\n' + 'Subject: ' + params.subject + '\r\nDate: ' + (new Date()).toGMTString() + '\r\n\r\n' + params.message,
            (err, info) => {
                console.log('tried to send the email:', err, info);

                try {
                    connection.quit();
                }
                catch (e) {
                    console.log('SMTP connection quit failed:', e);
                }

                if (err !== null) {
                    return callback(err);
                }

                //handle info object
                if (info.rejected.length > 0) {
                    return callback('Email was rejected');
                }

                callback(null, {email: email, message: info.response});
            });
        });
    }
};
