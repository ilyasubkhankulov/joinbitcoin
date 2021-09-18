import React from 'react';
// import wretch from "wretch"

// import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'

// import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import Layout from '../../Layout';

// note look into https://formik.org/docs/overview

export default class Dashboard extends React.Component {
    constructor(props) {
      super(props);
    //   this.state = {
    //       nickname: '',
    //       key: '',
    //       secret: '',
    //       passphrase: '',
    //       useSandbox: "true",
    //       successMessage: "",
    //       errorMessage: "",
    //     };
        
    //     this.pages = [
    //       { name: 'Account', href: 'http://localhost:3001', current: false },
    //       { name: 'Link Trading Account', href: 'http://localhost:3001', current: true },
    //     ]
  
    //   this.handleChange = this.handleChange.bind(this);
    //   this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        // const target = event.target;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // const name = target.name;
    
        // this.setState({
        //   [name]: value
        // });
    }
  
    // handleSubmit = async (event) => {
    // wretch().errorType("json")
   
    // wretch('http://localhost:8180/link-account')
    //   .post({
    //     nickname: this.state.nickname,
    //     key: this.state.key,
    //     secret: this.state.secret,
    //     passphrase: this.state.passphrase,
    //     useSandbox: "true",
    //   })
    //   .json(json => {
    //     this.setState({
    //       successMessage: json.message,
    //       errorMessage: ''
    //     })
    //   })
    //   .catch(error => {
    //     if ('json' in error) {
    //       this.setState({
    //         successMessage: '',
    //         errorMessage: error.json.message
    //       });
    //     } else {
    //       this.setState({
    //         successMessage: '',
    //         errorMessage: 'Oops something went wrong! We\'ll fix it soon.'
    //       })
    //     }

    //   })
    //   event.preventDefault();
    // }
  
    render() {
    //   const { successMessage, errorMessage } = this.state
      return (
        <Layout currentPage='Dashboard'></Layout>
      );
    }
}