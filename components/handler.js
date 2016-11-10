var request     = require('request'),
    logger      = require('./logger').getSingleton(),
    socketio    = require('socket.io'),
    _           = require('underscore'),
    githubhook  = require('githubhook'),
    github      = githubhook({
        'host': 'localhost',
        'port': '4567',
        'path': '/payload',
        'secret': 'myissues'
    });

var repoOwner   = 'alacroux',
    repoName    = 'MyIssues',
    issuesUrl   = 'https://api.github.com/repos/'+repoOwner+'/'+repoName+'/issues',
    singleton,
    io;

var Handler = function (http) {
    // Init of the socket
    io = socketio(http);
    // On connection of a new socket, we send the current issues list
    io.on('connection', listIssues);
}

var listIssues = function () {
    var optionsRequest = {
        url: issuesUrl,
        headers: { 'User-Agent': repoOwner } // Mandatory by GitHub API
    }
    
    return request(optionsRequest, function (error, response, body) {
        var res;
        if (!error && response.statusCode === 200) {
            var issues = JSON.parse(body);
            logger.log(issues.length + ' issues retrieved');
            res = issues;
        }
        else {
            logger.error("Error while calling GitHub API", error);
            res = null;
        }
        // Send the result on the socket
        io.emit('init', res);
    });
}

// Listen to 'issues' events
github.on('issues', function (repo, ref, data) {
    // On 'isssues' event, we send the updated issue on the socket
    io.emit('update', data.issue);
});

github.listen();

exports.getSingleton = function (http) {
    if (!singleton) {
        singleton = new Handler(http);
    }
    return singleton;
};
