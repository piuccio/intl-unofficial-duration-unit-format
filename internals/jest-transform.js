const flowRemoveTypes = require('flow-remove-types');
module.exports = {
  process(src) {
    return flowRemoveTypes(src).toString();
  },
};
