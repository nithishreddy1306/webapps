const fs = require('fs');
const path = require('path');

module.exports = (app) => {

    app.get('/api/getFiles', (req, res) => {
        fs.readdir(path.join(__dirname, '/uploadedFiles'), (err, files) => {
            if (err) console.log(err);
            if (!err) {
                res.json(files);
            } else {
                res.json([]);
            }
        })
    })

    app.delete('/api/files', (req, res) => {
        let filePath = path.join(__dirname, '/uploadedFiles/', req.query.name);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
            if (!err) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        })
    })

    app.get('/api/file/download', (req, res) => {
        let filePath = path.join(__dirname, '/uploadedFiles/', req.query.name);
        let file = fs.createReadStream(filePath);
        res.writeHead(200, { 'Content-disposition': 'attachment; filename='+req.query.name }); //here you can add more headers
        file.pipe(res);
    })
}