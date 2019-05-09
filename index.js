const ipfsConstructor = require('ipfs')

const ipfs = new ipfsConstructor()

ipfs.on('ready', async () => {
    console.log('ipfs is ready:', ipfs)
    const dir = await ipfs.addFromFs('./test-content/', { recursive: true, hidden: true })

    console.log(dir)
})