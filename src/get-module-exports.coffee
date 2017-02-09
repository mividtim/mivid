reduce = require "lodash.reduce"

module.exports = (modules, exportName) ->
  modules.reduce(
    ((moduleExports, file) -> moduleExports[file.name.split('/')[0]] = file.module[exportName]; moduleExports)
    {})
