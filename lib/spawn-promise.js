var spawn = require('child_process').spawn;
var _ = require('lodash');

/**
 * Spawn a command and wrap it in a Promise. Extends the env
 * of and prints stdout and stderr to the parent process.
 *
 * @param command String The command to execute
 * @param args Array A list containing the arguments
 * @param env Object Environment variables to apply
 * 
 * @return {Promise}
 */
module.exports = function(command, args, env) {
  return new Promise(function(resolve, reject) {
    var data = '';

    var childProcess = spawn(command, args, {
      cwd: process.env.PWD,
      env: _.extend(process.env, env || {}, { PATH: process.env.PATH + ':/usr/local/bin' })
    });

    childProcess.stdout.on('data', function (_data) {
      data += _data;
    });

    childProcess.stderr.on('data', function (data) {
      process.stderr.write(data);
    });

    childProcess.on('close', function (code) {
      resolve(data);
    });
  });
}