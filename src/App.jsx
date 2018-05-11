import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sites: [] };
  }

  componentDidMount() {
    fetch('http://localhost:5000/sites.json').
      then(sites => this.setState({ sites }));
  }

  render() {

    return (
    <div>
      Sites

      {this.state.sites.map(site => (
        <div>{site.url}</div>
      ))}
    </div>);
  }
}
