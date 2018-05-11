const childProcess = require('child_process');
const pify = require('pify');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const exec = pify(childProcess.exec);

module.exports = async (ignore) => {
  // Get running processes
  const processes = (await exec('ps | grep node'))
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

  // Find listening processes
  const listening = (await exec('lsof -nP -i4TCP | grep node | grep LISTEN'))
    .split('\n')
    .slice(0, -1)
    .map(l => l.trim())
    .map(l => l.split(' ').filter(part => !!part))
    .map(l => {
      const [ process, pid, , , , , , , addr ] = l;
      const port = Number.parseInt(addr.substr(addr.indexOf(':') + 1), 10);

      return {
        process, pid, addr, port
      }
    })
    .filter(l => l.port !== ignore);

  const getProcessFor = (pid) =>
    processes.find(p => p.pid === pid);

  // Combine the two and intersect
  const hosts = listening
    .map(listen => ({ listen, process: getProcessFor(listen.pid) }))
    .filter(host => !!host.process)
    .map(host => ({ ...host.listen, ...host.process }));

  // Now get the web info
  const fetchSites = hosts.map(host => {
    const { port } = host;
    const url = `http://localhost:${port}`;

    console.log('Found web server on', url);

    return fetch(url)
      .then(res => res.text())
      .then(html => ({ host, html, url }));
  });

  return await Promise.all(fetchSites);
};
