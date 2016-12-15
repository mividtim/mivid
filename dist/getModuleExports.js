var reduce;

reduce = require("lodash.reduce");

module.exports = function(modules, exportName) {
  return modules.reduce((function(moduleExports, file) {
    moduleExports[file.name.split('/')[0]] = file.module[exportName];
    return moduleExports;
  }), {});
};
