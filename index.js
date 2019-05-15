const fs = require('fs')
const IPFSFactory = require('ipfsd-ctl')
const Dat = require('dat')
const pull = require('pull-stream')
const pullWriteFile = require('pull-write-file')

exports.host = dir => new Promise((res, rej) => {

  const f = IPFSFactory.create({ type: 'js' })

  f.spawn((err, ipfsd) => {
    if (err) return rej(err)

    const ipfs = ipfsd.api

    Dat('./.host-storage/', async (err, dat) => {
      if (err) return rej(err)

      function update () {
        return new Promise(async (res, rej) => {
          const dirInfo = await ipfs.addFromFs(dir, { recursive: true, hidden: true })

          const dirHash = dirInfo[dirInfo.length - 1].hash

          fs.writeFile('./.host-storage/ipfs-hash.txt', dirHash, err => {
            if (err) return rej(err)

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
        //console.log('stats', newStats)
        // The # of blocks will only be 1, so we only need to check that we've
        // downloaded that one
        if (newStats.version > lastVersion && newStats.downloaded === 1) {
          console.log('dl')

          setTimeout(()=>{
          fs.readFile('./.seed-storage/ipfs-hash.txt', 'utf8', (err, hash) => {
            if (err) {
              console.error("Can't find the file", err)
              return
            }

            ipfsToDisk(ipfs, hash, dir)
            lastVersion = newStats.version
          })
          }, 500)
        }
      })

      res()
    })
  })
})

function ipfsToDisk (ipfs, hash, topDir) {
  const dirs = []
  const files = []
  pull(
    ipfs.getPullStream(hash),
    pull.drain(obj => {
      if ('content' in obj) {
        files.push(obj)
      } else {
        dirs.push(obj)
      }
    }, () => {
      let madeDirs = 0
      dirs.forEach(dirObj => {
        const dirPath = dirObj.path.indexOf('/') === -1 ?
          '/' :
          dirObj.path.substring(dirObj.path.indexOf('/'))
        fs.mkdir(topDir + dirPath, { recursive: true }, err => {
          if (err) throw err

          madeDirs++
          if (madeDirs === dirs.length) {
            files.forEach(fileObj => {
              const filePath = fileObj.path.substring(fileObj.path.indexOf('/'))
              pull(
                fileObj.content,
                pullWriteFile(topDir + filePath, err => {
                  if (err) throw err
                  console.log('wrote', filePath)
                })
              )
            })
          }
        })
      })
    })
  )
}