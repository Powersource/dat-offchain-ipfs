const ipfsConstructor = require('ipfs')

const ipfs = new ipfsConstructor()

ipfs.on('ready', async () => {
    console.log('ipfs is ready:', ipfs)
    const readme = await ipfs.cat('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme')

    console.log("readme:", readme.toString())
})