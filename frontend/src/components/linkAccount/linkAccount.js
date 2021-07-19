import React from 'react';
import wretch from "wretch"

import './linkAccount.css';

// note look into https://formik.org/docs/overview

export default class LinkAccount extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          nickname: '',
          key: '',
          secret: '',
          passphrase: '',
          useSandbox: "true",
          successMessage: "",
          errorMessage: "",
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
  
    handleSubmit = async (event) => {
    wretch().errorType("json")
   
    wretch('http://localhost:8180/link-account')
      .post({
        nickname: this.state.nickname,
        key: this.state.key,
        secret: this.state.secret,
        passphrase: this.state.passphrase,
        useSandbox: "true",
      })
      .json(json => {
        console.log(json)
        this.setState({
          successMessage: json.message,
          errorMessage: ''
        })
      })
      .catch(error => {
        console.log(error.json)
        this.setState({
          successMessage: '',
          errorMessage: error.json.message
        });
      })
      event.preventDefault();
    }
  
    render() {
      const { successMessage, errorMessage } = this.state
      return (
        <div>
          {successMessage && <div className="successMessage"> {successMessage} </div>}
          <form className="linkAccountForm" onSubmit={this.handleSubmit.bind(this)}>
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
          <div>
              {errorMessage && <div className="errorMessage"> {errorMessage} </div>}
          </div>
        </div>
      );
    }
  }