const express = require('express');
const router = express.Router();

const r = require('../bin/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/image/:id', function(req, res) {
	
	
	
	r.table('results').getAll(req.params.id, { index: 'crossRef' }).limit(1).pluck('imageBlob').then((results) => {
		
		var img = Buffer.from(results[0].imageBlob.substring(21), 'base64');
		
		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});
		res.end(img);
	}).catch((e) => {
		console.log(e);
		return res.json({
			success: false
		})
	})

	// return res.json({ error: true, message: "disabled" })
})

router.get('/task/:id', async function(req, res) {
	
	let page = 0;
	
	if(req.query.page !== null) page = parseInt(req.query.page)
	
	console.log(page);
	
	const taskId = await r.table('tasks').get(req.params.id).without('pageSource', 'imageBlob').then((results) => {
		return results
	})
	
	// Slice amounts
	let slice1 = 0;
	let slice2 = 20;
	
	if(page > 0) {
		slice1 = 20 * page;
		slice2 = 20 * page + 20;
	}
	
	const parentTasks = await r.table('tasks').filter({ parentJob: req.params.id}).slice(slice1, slice2).without('pageSource', 'imageBlob').then((results) => {
		return results
	})
	
	return res.json({
		success: true,
		task: taskId,
		parentTasks: parentTasks
	})
	
})

router.get('/list', function(req, res) {
	
	r.table('tasks').filter(r.row.hasFields('parentJob').not()).limit(20).without('pageSource', 'imageBlob').then((results) => {
		return res.json({
			success: true,
			tasks: results
		})
	})
	
})

router.post('/new', function(req, res) {
	
	// Let's check for some basic validation
	if(!req.body) return ValidationFail(res, "No Body Found")
	if(!req.body.url) return ValidationFail(res, "No URL Found")
	if(!req.body.searchDepth) return ValidationFail(res, "No searchDepth Found")
	
	// Insert it into the DB, stolen my own code :)
	r.table('tasks').insert({
		URL: req.body.url,
		searchDepth: req.body.searchDepth,
		status: "PENDING"
	}).then(() => {
		return res.json({
			success: true,
			message: "Task has been queued"
		})
	})
	
	
});

function ValidationFail(res, message) {
	return res.status(301).json({
		error: true,
		message: message
	})
}

module.exports = router;
