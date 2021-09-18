import React from 'react';
import wretch from "wretch"

import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import Layout from '../../Layout';

// note look into https://formik.org/docs/overview

export default class Invest extends React.Component {
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
  
    //   this.handleChange = this.handleChange.bind(this);
    //   this.handleSubmit = this.handleSubmit.bind(this);
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
        <Layout currentPage='Invest'>
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Investment Plans</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage your pre-scheduled investments.</p>
                </div>

                  


            <div className="pt-6 sm:pt-5">
              <div role="group" aria-labelledby="label-notifications">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      Push Notifications
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push_everything"
                            name="push_notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label htmlFor="push_everything" className="ml-3 block text-sm font-medium text-gray-700">
                            Everything
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push_email"
                            name="push_notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label htmlFor="push_email" className="ml-3 block text-sm font-medium text-gray-700">
                            Same as email
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push_nothing"
                            name="push_notifications"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label htmlFor="push_nothing" className="ml-3 block text-sm font-medium text-gray-700">
                            No push notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
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