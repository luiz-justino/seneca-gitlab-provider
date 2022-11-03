/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as Fs from 'fs'

import Seneca from 'seneca'
import SenecaMsgTest from 'seneca-msg-test'

import GitlabProvider from '../src/gitlab-provider'
import GitlabProviderDoc from '../src/GitlabProvider-doc'

const BasicMessages = require('./basic.messages')

const Config: any = {}

if (Fs.existsSync(__dirname + '/local-config-template.js')) {
  Object.assign(Config, require(__dirname + '/local-config-template.js'))
}

describe('gitlab-provider', () => {

  test('happy', async () => {
    expect(GitlabProvider).toBeDefined()
    expect(GitlabProviderDoc).toBeDefined()
    const seneca = await makeSeneca()
    let sdk = seneca.export('GitlabProvider')()
    expect(sdk).toBeDefined()

    expect(await seneca.post('sys:provider, provider: gitlab, get:info'))
      .toMatchObject({
        ok: true,
        name: '@seneca/gitlab-provider',
        version: '0.1.0',
        sdk: {
          name: '@gitbeaker/node',
          version: '^35.6.0',
        }        
      });
  })


  test('messages', async () => {
    const seneca = await makeSeneca()
    await (SenecaMsgTest(seneca, BasicMessages))()
  })


  test('list', async () => {
    if(!Config) return;
    const seneca = await makeSeneca()

    let project = await seneca.entity('provider/gitlab/project')
        .list$({id: 35234606})

    expect(project.length > 0).toBeTruthy()
    expect(project).toBeDefined()
    expect(project.id).toEqual(35234606)
    expect(project.name).toEqual('GitlabTest')
    expect(project.default_branch).toEqual('main')
  })


  // test('project_save', async () => {
  //   if(!Config) return;
  //   const seneca = await makeSeneca()
  //   console.log('project_save', seneca)

  //   let project = await seneca.entity('provider/gitlab/project')
  //     .load$({id: 35234606})
  //   expect(project).toBeDefined()

  //   project.description = project.description + 'M'

  //   project = await project.save$()
  //   expect(project.description.endsWith('M')).toBeTruthy()
  // })

  async function makeSeneca() {
    const seneca = Seneca ({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('provider', {
      provider: {
        gitlab: {
          keys: {
            api: {
              value: Config.key
            }
          }
        }
      }
    })
    .use('GitlabProvider')
    return seneca.ready()
  }

})

