import React from 'react';

// note look into https://formik.org/docs/overview

export default class LinkAccount extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          nickname: '',
          key: '',
          secret: '',
          passphrase: '',
          useSandbox: "true"
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
  
    handleSubmit(event) {
    //   alert('A account with nickname was submitted: ' + this.state.nickname);

      fetch('http://localhost:8180/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify(this.state)
      }).then(function(response) {
        console.log(response)
        return response.json();
      });

      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Nickname:
            <input name="nickname" type="text" value={this.state.nickname} onChange={this.handleChange} />
          </label>
          <label>
            Key:
            <input name="key" type="text" value={this.state.key} onChange={this.handleChange} />
          </label>
          <label>
            Secret:
            <input name="secret" type="text" value={this.state.secret} onChange={this.handleChange} />
          </label>
          <label>
            Passphrase:
            <input name="passphrase" type="text" value={this.state.passphrase} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Link" />
        </form>
      );
    }
  }