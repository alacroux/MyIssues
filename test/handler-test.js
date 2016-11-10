var chai        = require('chai');
var expect      = chai.expect;
var handler     = require('../components/handler').getSingleton();

describe('Handler', function() {
    
    it('listIssues() should retrieve all issues of the repo', function() {
        var listIssues;
        expect(listIssues).not.to.be.null;
    });

});


