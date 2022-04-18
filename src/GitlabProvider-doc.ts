/* Copyright © 2021 Seneca Project Contributors, MIT License. */


const docs = {

  get_info: {
    desc: 'Get information about the provider.',
  },

  load_repo: {
    desc: 'Load Gitlab project data into an entity.',
  },

  save_repo: {
    desc: 'Update Gitlab project data from an entity.',
  },

}

export default docs

if ('undefined' !== typeof (module)) {
  module.exports = docs
}