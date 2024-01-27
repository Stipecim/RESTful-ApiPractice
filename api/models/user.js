

function createObject(_id, email, password) {
    return {
        _id: _id, 
        email: email, 
        password: password 
    };
}

module.exports = createObject;