const offchain = require('..')

offchain.seed('./clone-content/', process.argv[2]).then(() => {
  console.log('seeding')
}).catch(err => {
  console.error(err)
})