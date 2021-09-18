import React from 'react';
import wretch from "wretch"

import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'

import Layout from '../../Layout';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

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
        
        this.pages = [
          { name: 'Account', href: 'http://localhost:3001', current: false },
          { name: 'Link Trading Account', href: 'http://localhost:3001', current: true },
        ]
  
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
        this.setState({
          successMessage: json.message,
          errorMessage: ''
        })
      })
      .catch(error => {
        if ('json' in error) {
          this.setState({
            successMessage: '',
            errorMessage: error.json.message
          });
        } else {
          this.setState({
            successMessage: '',
            errorMessage: 'Oops something went wrong! We\'ll fix it soon.'
          })
        }

      })
      event.preventDefault();
    }
  
    render() {
      const { successMessage, errorMessage } = this.state
      return (
        <Layout currentPage='Account'>
          <div className="space-y-6">
            <Breadcrumbs pages={this.pages}/>
            {successMessage &&  <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                  {/* @todo add next step here */}
                  {/* <div className="mt-2 text-sm text-green-700">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.</p>
                  </div> */}
                  {/* <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        type="button"
                        className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                      >
                        Create investment Plan
                      </button>
                      <button
                        type="button"
                        className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            }
            {errorMessage && <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                  {/* <div className="mt-2 text-sm text-red-700"> */}
                    {/* <ul className="list-disc pl-5 space-y-1">
                      <li>Your password must be at least 8 characters</li>
                      <li>Your password must include at least one pro wrestling finishing move</li>
                    </ul> */}
                  {/* </div> */}
                </div>
              </div>
            </div>}
            <form className="space-y-8 divide-y divide-gray-200" onSubmit={this.handleSubmit.bind(this)}>
              <div className="space-y-8 divide-y divide-gray-200">
                <div className="">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Link your trading account</h3>
                    <p className="mt-1 text-sm text-gray-500">Enter your Coinbase credentials here.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                    <div className="sm:col-span-4">
                      <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                        Nickname
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          readOnly={successMessage ? true : false}
                          type="text"
                          name="nickname"
                          id="nickname"
                          value={this.state.nickname} onChange={this.handleChange} 
                          className={`${successMessage ? "text-gray-300 " : null}focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md`}
                          placeholder="Friendly nickname to call this account"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                        Coinbase Pro API Key
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          readOnly={successMessage ? true : false}
                          name="key"
                          type="text"
                          id="key"
                          value={this.state.key} onChange={this.handleChange} 
                          className={`${successMessage ? "text-gray-300 " : null}focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md`}
                          placeholder="Alphanumeric key generated on Coinbase Pro's platform"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="secret" className="block text-sm font-medium text-gray-700">
                        Coinbase Pro API Secret
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          readOnly={successMessage ? true : false}
                          name="secret"
                          type="password"
                          id="secret"
                          value={this.state.secret} onChange={this.handleChange} 
                          className={`${successMessage ? "text-gray-300 " : null}focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md`}
                          placeholder="Alphanumeric secret generated on Coinbase Pro's platform"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700">
                        Coinbase Pro API Passphrase
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          readOnly={successMessage ? true : false}
                          name="passphrase"
                          type="password"
                          id="passphrase"
                          value={this.state.passphrase} onChange={this.handleChange} 
                          className={`${successMessage ? "text-gray-300 " : null}focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md`} 
                          placeholder="Alphanumeric passphrase generated on Coinbase Pro's platform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    disabled={successMessage ? true : false}
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
            <div>
            </div>
          </div>
        </Layout>
      );
    }
  }