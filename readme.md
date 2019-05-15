# dat-offchain-ipfs

(working title)

For when neither dat nor ipfs really suits your needs.

Situations where this module can be useful:
* You want to use dat but don't want/need the inherent revision history of it.
* You want to use ipfs but need dynamic content and don't want to wait for ipns/iprs to be bug-free/implemented.

## Concept

What the module does it that when you call `host`/`update`, it adds your dir to ipfs, and then publishes the hash of that dir to dat. Other people can then download that dir by getting the ipfs hash from the dat archive. Only publishing small hashes to dat keeps the archive size very small, even after many edits to the dir contents.

## Trying it out

In one terminal/on one computer, create a dir `test-content/` with some files in it. Run `node examples/host.js`

Take the dat link that host.js prints to another terminal/computer and run `node examples/seed.js <the dat link>`

## Examples

The api is still a work in progress, but you can look in the `examples/` dir, that code should mostly work.