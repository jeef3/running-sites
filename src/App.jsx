import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sites: [] };
  }

  componentDidMount() {
    fetch('http://localhost:5000/sites.json')
      .then(res => res.json())
      .then(sites => {
        const s = sites.filter(si => si.host.port !== 3000);
        console.log(s);
        this.setState({ sites: s });
      });
  }

  render() {

    return (
    <div>
      Sites

      {this.state.sites.map(site => (
        <div key={site.host.pid}>
          <iframe src={`http://localhost:${site.host.port}`}></iframe>
        </div>
      ))}
    </div>);
  }
}
