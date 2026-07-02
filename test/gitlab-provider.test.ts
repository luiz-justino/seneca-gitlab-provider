/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as Fs from 'fs'

import GitlabProvider from '../src/gitlab-provider'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const GitlabProviderMessages = require('./gitlab-provider.messages').default

const CONFIG: any = {}

if (Fs.existsSync(__dirname + '/local-config.js')) {
  Object.assign(CONFIG, require(__dirname + '/local-config.js'))
}

describe('gitlab-provider', () => {

  test('happy', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('provider', {
        provider: {
          gitlab: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      })
      .use(GitlabProvider)
    await seneca.ready()
  })


  test('messages', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('provider', {
        provider: {
          gitlab: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      })
      .use(GitlabProvider)
    await (SenecaMsgTest(seneca, GitlabProviderMessages)())
  })


  test('native', async () => {
    if(CONFIG.key) {
      const seneca = Seneca({legacy: false})
          .test()
          .use('promisify')
          .use('provider', {
            provider: {
              gitlab: {
                keys: {
                  api: {
                    value: CONFIG.key
                  }
                }
              }
            }
          })
          .use(GitlabProvider)
      await seneca.ready()

      let native = seneca.export('GitlabProvider/native')
      expect(native().gitlab).toBeDefined()
    }
  })


  test('entity-load', async () => {
    if(CONFIG.key) {
      const seneca = Seneca({ legacy: false })
          .test()
          .use('promisify')
          .use('entity')
          .use('provider', {
            provider: {
              gitlab: {
                keys: {
                  api: {
                    value: CONFIG.key
                  }
                }
              }
            }
          })
          .use(GitlabProvider)

      let project = await seneca.entity('provider/gitlab/project')
          .load$({id: 35234606})
      expect(project).toBeDefined()
      expect(project.id).toEqual(35234606)
      expect(project.name).toEqual('GitlabTest')
      expect(project.default_branch).toEqual('main')
    }
  })


  test('entity-save', async () => {
    if(CONFIG.key) {
      const provider_options = {
        provider: {
          gitlab: {
            keys: {
              api: {
                value: CONFIG.key
              }
            }
          }
        }
      }

      const seneca = Seneca({ legacy: false })
        .test()
        .use('promisify')
        .use('entity')
        .use('provider', provider_options)
        .use(GitlabProvider)

      let project = await seneca.entity('provider/gitlab/project')
        .load$({id: 35234606})
      expect(project).toBeDefined()

      project.description = project.description + 'M'

      project = await project.save$()
      expect(project.description.endsWith('M')).toBeTruthy()
    }
  })

})

