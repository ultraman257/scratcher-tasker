const r = require('rethinkdbdash')({
	host: process.env.rethinkdb ? process.env.rethinkdb : '127.0.0.1',
	db: 'scratcher'
}); // TODO: cloud server?

module.exports = r;
