const siofu = require("socketio-file-upload");

module.exports = (app, io) => {
    app.use(siofu.router);
    io.on('connect', (socket) => {
        console.log("Socket connected : ", socket.id);
    
        var uploader = new siofu();
        uploader.dir = __dirname+'/uploadedFiles';
        uploader.listen(socket);
    
        uploaderListeners(uploader);
    });
    
    const uploaderListeners = (uploader) => {
        uploader.on('start', (e) => {
            console.log("File upload start : ", e.file.name);
        });

        uploader.on('error', (e) => {
            console.log(e)
        })

        uploader.on('saved', (e) => {
            console.log("File saved: ", e.file.name);

        })
    }
}