/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Pkg = require('../package.json')

module.exports = {
  print: true,
  pattern: 'sys:provider,provider:gitlab',
  allow: { missing: true },

  calls: [
    {
      pattern: 'get:info',
      out: {
        ok: true,
        name: 'gitlab',
        version: Pkg.version,
        sdk: {
          name: 'gitbeaker/node',
          version: Pkg.dependencies['gitbeaker/node']
        }
      },
    }  
  ]
}