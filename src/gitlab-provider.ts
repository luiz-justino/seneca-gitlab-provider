/* Copyright © 2021 Seneca Project Contributors, MIT License. */


// TODO: namespace provider zone; needs seneca-entity feature

import {Gitlab} from '@gitbeaker/node';

type GitlabProviderOptions = {}

function GitlabProvider(this: any, _options: any) {
  const seneca: any = this

  const ZONE_BASE = 'provider/gitlab/'

  let gitlab: any


  // NOTE: sys- zone prefix is reserved.

  seneca
    .message('sys:provider,provider:gitlab,get:info', get_info)
    .message('role:entity,cmd:load,zone:provider,base:gitlab,name:project',
      load_project)

    .message('role:entity,cmd:save,zone:provider,base:gitlab,name:project',
      save_project)



  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'gitlab',
      details: {
        sdk: '@gitbeaker/node'
      }
    }
  }

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



  seneca.prepare(async function(this: any) {
    let out = await this.post('sys:provider,get:key,provider:gitlab,key:api')
    if (!out.ok) {
      this.fail('api-key-missing')
    }

    gitlab = new Gitlab({token: out.value})
  })


  return {
    exports: {
      native: () => ({
        gitlab
      })
    }
  }
}


// Default options.
const defaults: GitlabProviderOptions = {

  // TODO: Enable debug logging
  debug: false
}


Object.assign(GitlabProvider, { defaults })

export default GitlabProvider

if ('undefined' !== typeof (module)) {
  module.exports = GitlabProvider
}
