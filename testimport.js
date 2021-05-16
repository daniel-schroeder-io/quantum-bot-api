var data = require('./testexport')();


const getVal = async () => {
    console.log(data);
    await data;
    console.log(data);
}

getVal();