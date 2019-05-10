const fs = require('fs')
const IPFSFactory = require('ipfsd-ctl')
//const IPFS = require('ipfs')
const Dat = require('dat')

exports.host = dir => new Promise((res, rej) => {

  const f = IPFSFactory.create({ type: 'js' })

  f.spawn((err, ipfsd) => {
    if (err) return rej(err)

    const ipfs = ipfsd.api

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

  let lastVersion = -1

  const f = IPFSFactory.create({ type: 'js' })

  f.spawn((err, ipfsd) => {
    if (err) return rej(err)

    const ipfs = ipfsd.api

    Dat('./.seed-storage/', { key: link }, async (err, dat) => {
      if (err) return rej(err)

      dat.joinNetwork()

      const stats = dat.trackStats()

      stats.on('update', () => {
        const newStats = stats.get()
        console.log('stats', newStats)
        // The # of blocks will only be 1, so we only need to check that we've
        // downloaded that one
        if (newStats.version > lastVersion && newStats.downloaded === 1) {
          //TODO: dl files using ipfs
          console.log('dl')
          lastVersion = newStats.version
        }
      })

      res()
    })
  })
})