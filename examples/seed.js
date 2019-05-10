const offchain = require('..')

offchain.seed('./clone-content/').then(() => {
  console.log('seeding')
}).catch(err => {
  console.error(err)
})