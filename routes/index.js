const express = require('express');
const router = express.Router();

const r = require('../bin/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/image/:id', function(req, res) {
	
	// r.table('results').filter({ crossRef: req.params.id }).pluck('imageBlob').then((resultsArray) => {
	// 	let results = resultsArray[0];
	// 	const img = new Buffer(results.imageBlob.split(',')[1], 'base64');
	// 	res.writeHead(200, {
	// 		'Content-Type': 'image/png',
	// 		'Content-Length': img.length
	// 	});
	// 	return res.end(img);
	// }).catch(() => {
	// 	return res.json({
	// 		success: false
	// 	})
	// })
	//
	return res.json({ error: true, message: "disabled" })
})

router.get('/task/:id', async function(req, res) {
	
	const taskId = await r.table('tasks').get(req.params.id).without('pageSource', 'imageBlob').then((results) => {
		return results
	})
	
	const parentTasks = await r.table('tasks').filter({ parentJob: req.params.id}).without('pageSource', 'imageBlob').then((results) => {
		return results
	})
	
	return res.json({
		success: true,
		task: taskId,
		parentTasks: parentTasks
	})
	
})

router.get('/list', function(req, res) {
	
	r.table('tasks').filter(r.row.hasFields('parentJob').not()).without('pageSource', 'imageBlob').then((results) => {
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
