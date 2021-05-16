
const myPromise = new Promise((resolve, reject) => {
    console.log('In Promise')
    setTimeout(() => {
      resolve('newnew');
    }, 100);
  });

const data = {message: "initial"}
module.exports = async () => {
   
    let message = await myPromise;
    console.log(message)
    data.message = message;
    
    return data;
}