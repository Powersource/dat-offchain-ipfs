const fs = require('fs')
const IPFS = require('ipfs')
const Dat = require('dat')

exports.host = dir => new Promise((res, rej) => {

  const ipfs = new IPFS()

  ipfs.on('ready', async () => {

    Dat('./.hash-storage/', async (err, dat) => {
      if (err) rej(err)

      function update () {
        return new Promise(async (res, rej) => {
          const dirInfo = await ipfs.addFromFs(dir, { recursive: true, hidden: true })

          const dirHash = dirInfo[dirInfo.length - 1].hash

          fs.writeFile('./.hash-storage/ipfs-hash.txt', dirHash, err => {
            if (err) rej(err)

            dat.importFiles({ watch: true })
            dat.joinNetwork()

            res()
          })
        })
      }

      await update()

      res({ link: 'dat://' + dat.key.toString('hex'), update: update })
    })
  })
})
