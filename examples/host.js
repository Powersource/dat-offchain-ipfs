const offchain = require('..')

offchain.host('./test-content/').then(({ link, update }) => {
    console.log('link:', link)

    setInterval(async () => {
        console.log('updating')
        await update()
    }, 10000)
})
