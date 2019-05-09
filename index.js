const fs = require('fs')
const IPFS = require('ipfs')
const Dat = require('dat')

// exports.init = functi
const ipfs = new IPFS()

ipfs.on('ready', async () => {
  const dir = await ipfs.addFromFs('./test-content/', { recursive: true, hidden: true })

  console.log(dir)

  const dirHash = dir[dir.length - 1].hash

  fs.writeFile('./.hash-storage/ipfs-hash.txt', dirHash, err => {
    if (err) throw err

    Dat('./.hash-storage/', (err, dat) => {
      if (err) throw err

      dat.importFiles({ watch: true })
      dat.joinNetwork()

      console.log('My Dat link is: dat://' + dat.key.toString('hex'))
    })
  })
})
