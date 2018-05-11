#!/usr/bin/env node

const { exec } = require('child_process');

const run = async () => {
  const processes = await new Promise((resolve, reject) => {
    exec('ps | grep node', (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      const ps = stdout
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

      return resolve(ps);
    })
  });

  const listening = await new Promise((resolve, reject) => {
    exec('lsof -nP -i4TCP | grep node | grep LISTEN', (err, stdout) => {
      if (err) {
        reject(err);
        return;
      };

      const list = stdout
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

      return resolve(list);
    })
  });

  const getProcessFor = (pid) =>
    processes.find(p => p.pid === pid);

  const hosts = listening
    .map(listen => ({ listen, process: getProcessFor(listen.pid) }))
    .filter(host => !!host.process)
    .map(host => ({ ...host.listen, ...host.process }));

  
};

run();
