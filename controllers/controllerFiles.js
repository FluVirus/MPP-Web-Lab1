const fs = require("fs-extra");
const dao = require("../model/db/dbdao.js");
const multer = require("multer");
const crypto = require('crypto');

module.exports.deleteFiles = function(request, response) {
	const fileIDs = request.body.selectedFiles;
	if (fileIDs) {
		dao.instance.deleteFiles(fileIDs, function(err, result, fields) {
			if (err) {
				response.render("error.ejs", {
					error: err
				});
			}
			response.redirect('back');
		});
	} else {
		response.redirect('back');
	}
}

module.exports.downloadFile = function(request, response) {
	const fileDB = dao.instance.downloadFile((Number)(request.query.id), function(err, result, fields) {
		if (err) {
			return response.render("error.ejs", {
				error: err
			});
		}
		const serverFileName = 'userfiles/' + result[0].name_local_fs;
		if (fs.existsSync(serverFileName)) {
			response.download(serverFileName, result[0].name_user);
		} else {
			response.render("error.ejs", {
				error: err
			});
		}
	});
}

const storageConfig = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "userfiles");
    },
    filename: (request, file, callback) =>{
        const newFileName = crypto.createHash("sha256").update(file.originalname).update(Date.now().toLocaleString())
        .update(crypto.randomInt(0, 21474976710655).toString()).digest("hex");
        id = (Number)(request.query.id);		
		dao.instance.registerFile(id, file.originalname, newFileName, callback);
    }
});
const upload = multer({storage:storageConfig}).single('formFile');

module.exports.uploadFile = function(request, response, next) {
	upload(request, response, function(err) {
		if (err)
		response.render("error.ejs", {
			error: err
		});
		response.redirect('back');
	});
}
