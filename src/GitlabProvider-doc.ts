/* Copyright © 2021 Seneca Project Contributors, MIT License. */


const docs = {

  get_info: {
    desc: 'Get information about the provider.',
  },

  load_project: {
    desc: 'Load the Gitlab project data into an entity, through a project id informed as a parameter.',
  },

  save_project: {
    desc: 'Update Gitlab project data from an entity, through a project id, informed as a parameter.',
  },

}

export default docs

if ('undefined' !== typeof (module)) {
  module.exports = docs
}
