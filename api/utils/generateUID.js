const generateUniqueID = require('generate-unique-id');
const productIDs = require('../routes/productIDs.json');

const generate = () => {
    
    while(true) {
        let isSame = false;
        const ID = generateUniqueID({
            useLetters: true,
            useNumbers: true
        });

        
        productIDs.forEach((element, index) => {
            if(ID === element) isSame = true;
        })

        if(!isSame) {
            return ID;
        }
    }
}

module.exports = generate;