/* Copyright © 2021 Seneca Project Contributors, MIT License. */


// TODO: namespace provider zone; needs seneca-entity feature

const Pkg = require('../package.json')
const { Gitlab } = require('@gitbeaker/node')

type GitlabProviderOptions = {}

function GitlabProvider(this: any, options: GitlabProviderOptions) {
  const seneca: any = this

  const entityBuilder = this.export('provider/entityBuilder')

  // NOTE: sys- zone prefix is reserved.

  seneca
    .message('sys:provider,provider:gitlab,get:info', get_info)

  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'gitlab',
      version: Pkg.version,
      sdk: {
        name: '@gitbeaker/node',
        version: Pkg.dependencies['gitbeaker/node'],
      }
    }
  }

  entityBuilder(this, {
    provider: {
      name: 'gitlab'
    },
    entity: {
      project: {
        cmd: {
          list: {
            action: async function (this: any, entize: any, msg: any) {
              let projectId = msg.q.id || {}
              let res = await this.shared.sdk.Projects.show(projectId);
              let list = res.map((data: any) => entize(data))
              return list
            }
          }
        }
      }
    }
  })

  /* Operations */
  /*
  async function load_project(this: any, msg: any) {
    let ent: any = null
    let projectId = msg.q.id;

    let project = await gitlab.Projects.show(projectId);
    let data: any = project
    data.id = project.id

    ent = this.make$(ZONE_BASE + 'project').data$(data)
    return ent
  }


  async function save_project(this: any, msg: any) {
    let ent: any = msg.ent;

    let data = {
      id: ent.id,
      description: ent.description
    }

    let project = await gitlab.Projects.edit(ent.id, data);

    let dataUpdated: any = project
    dataUpdated.id = project.id
    ent = this.make$(ZONE_BASE + 'project').data$(dataUpdated)
    return ent
  }
  */



  seneca.prepare(async function(this: any) {
    console.log("teste aqui")
    let out = await this.post('sys:provider,get:key,provider:gitlab,key:api')
    if (!out.ok) {
      this.fail('api-key-missing')
    }

    console.log("out", out)

     this.shared.sdk = new Gitlab({ token: out.value })
  })


  return {
    exports: {
      sdk: () =>  this.shared.sdk
    }
  }
}


// Default options.
const defaults: GitlabProviderOptions = {
  debug: false
}


Object.assign(GitlabProvider, { defaults })

export default GitlabProvider

if ('undefined' !== typeof (module)) {
  module.exports = GitlabProvider
}
