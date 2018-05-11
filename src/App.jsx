import React from 'react';
import cheerio from 'cheerio';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sites: [] };
  }

  componentDidMount() {
    fetch('http://localhost:5000/sites.json')
      .then(res => res.json())
      .then(sites => {
        // TODO: temp, ignore this static serve
        const s = sites.filter(si => si.host.port !== 3000)
          .map(si => {
            const $ = cheerio.load(si.html);
            const title = $('title').text() || 'Unknown';
            return { ...si, title, url: `http://localhost:${si.host.port}` };
          });

        this.setState({ sites: s });
      });
  }

  render() {

    const thumbnailWidth = 200;
    const thumbnailHeight = 150;
    const scale = 0.25;

    return (
      <div style={{
        width: '100vw',
        height: '100vh'
      }}>
      {this.state.sites.map(site => (
        <div key={site.host.pid}>
          <h2>{site.title}</h2>
          <a
            href={site.url}
            style={{
              display: 'block',
            width: thumbnailWidth,
            height: thumbnailHeight,
            border: 'solid 1px gray',

            cursor: 'pointer',
          }}
        >
          <div style={{
            overflow: 'hidden',
            width: thumbnailWidth,
            height: thumbnailHeight,
            pointerEvents: 'none'
          }}>
            <iframe
              src={site.url}
              title={site.title}
              style={{
                width: (thumbnailWidth / scale), height: (thumbnailHeight / scale), border: 0,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            ></iframe>
          </div>
        </a>
        </div>
      ))}
    </div>);
  }
}
