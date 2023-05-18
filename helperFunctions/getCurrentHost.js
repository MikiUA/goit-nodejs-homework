function getCurrentHost(){
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    let netAddress=null;
    for (const name of Object.keys(nets)) {for (const net of nets[name]) {
        //for localhost testing only
        if (net.address.includes('192')) netAddress=net.address;
    }}
    return `http://${netAddress}:${process.env.PORT|| 3000}`
}

module.exports = {getCurrentHost}