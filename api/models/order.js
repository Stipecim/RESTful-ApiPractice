

function createObject(_id, productID, quantity) {
    return {
        _id: _id, 
        productID: productID, 
        quantity: quantity || 1 
    };
}

module.exports = createObject;