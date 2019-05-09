const IPFS = require('ipfs')
const Dat = require('dat')

//exports.init = functi
const ipfs = new IPFS()

ipfs.on('ready', async () => {
    console.log('ipfs is ready:', ipfs)
    const dir = await ipfs.addFromFs('./test-content/', { recursive: true, hidden: true })

    console.log(dir)
    
    Dat('./.hash-storage/', (err, dat) => {
        if (err) throw err

        console.log('dat is ready:', dat)
    })
})