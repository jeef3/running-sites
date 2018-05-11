#!/usr/bin/env node

const childProcess = require('child_process');
const pify = require('pify');

const exec = pify(childProcess.exec);

const run = async () => {
  const processesResult = await exec('ps | grep node');
  const listeningResult = await exec('lsof -nP -i4TCP | grep node | grep LISTEN');

  const processes = processesResult
    .split('\n')
    .slice(0, -1)
    .map(p => p.trim())
    .map(p => p.split(' ').filter(part => !!part))
    .map(p => {
      const [pid, tty, , process, app, ...params] = p;
      return {
        pid, tty, process, app, params
      };
    });

  const listening = listeningResult
    .split('\n')
    .slice(0, -1)
    .map(l => l.trim())
    .map(l => l.split(' ').filter(part => !!part))
    .map(l => {
      const [ process, pid, , , , , , , addr ] = l;
      return {
        process, pid, addr
      }
    })

  const getProcessFor = (pid) =>
    processes.find(p => p.pid === pid);

  const hosts = listening
    .map(listen => ({ listen, process: getProcessFor(listen.pid) }))
    .filter(host => !!host.process)
    .map(host => ({ ...host.listen, ...host.process }));

  console.log(hosts);
};

run();
