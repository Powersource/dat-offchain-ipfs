const fs = require('fs')
const IPFS = require('ipfs')
const Dat = require('dat')

exports.host = dir => new Promise((res, rej) => {

  const ipfs = new IPFS()

  ipfs.on('ready', async () => {

    Dat('./.host-storage/', async (err, dat) => {
      if (err) rej(err)

      function update () {
        return new Promise(async (res, rej) => {
          const dirInfo = await ipfs.addFromFs(dir, { recursive: true, hidden: true })

          const dirHash = dirInfo[dirInfo.length - 1].hash

          fs.writeFile('./.host-storage/ipfs-hash.txt', dirHash, err => {
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

exports.seed = (dir, link) => new Promise((res, rej) => {

  const ipfs = new IPFS()

  ipfs.on('ready', async () => {

    Dat('./.seed-storage/', { key: link }, async (err, dat) => {
      if (err) rej(err)

      dat.joinNetwork()

      const stats = dat.trackStats()

      stats.on('update', () => {
        const newStats = stats.get()
        console.log('stats', newStats)
      })

      res()
    })
  })

  ipfs.on('error', err => {
    throw err
  })
})