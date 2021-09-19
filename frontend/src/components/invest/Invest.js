import React from 'react';
import wretch from "wretch"

import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import Layout from '../../Layout';

// note look into https://formik.org/docs/overview

export default class Invest extends React.Component {
    constructor(props) {
      super(props);

      this.currencies = [
        {
          'name': 'US Dollars',
          'symbol': 'USD',
          'precision': 2,
          'sign': '\u0024',
        },
        {
          'name': 'Bitcoin',
          'symbol': 'BTC',
          'precision': 8,
          'sign': '\u20BF',
        },
        {
          'name': 'Ethereum',
          'symbol': 'ETH',
          'precision': 16,
          'sign': '\u039E',
        }
      ]

      this.state = {
          selectedCurrency: this.currencies[0], // USD
          selectedFrequency: null,
          purchaseAmount: '',
        };
        
        this.pages = [
          { name: 'Invest', href: '/invest', current: true },
        ]

      // @todo get coinbase price api for pair https://api.coinbase.com/v2/prices/BTC_USD/buy
      // then use the price api to convert the purchase amount
  
      this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
      this.onChangeFrequency = this.onChangeFrequency.bind(this);
      this.handleAmountChange = this.handleAmountChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleCurrencyChange(event) {
      console.log('i <3 vera')
      this.setState({
        selectedCurrency: this.currencies[event.target.options.selectedIndex],
        purchaseAmount: '' // @todo this is bad ux, please change ASAP (see above @todo)
      })
    }

    onChangeFrequency(e) {
      this.setState({
        selectedFrequency: e.target.value
      })
    }

    handleAmountChange(e) {
      const amount = e.target.value;
      const validAmount = new RegExp(
        `^[+-]?([0-9]+\.?[0-9]{0,${this.state.selectedCurrency.precision}}|\.[0-9]{0,${this.state.selectedCurrency.precision}})$`
      );
      if (validAmount.test(amount)){
        this.setState({
          purchaseAmount: e.target.value
        })
      }
    }
  
    handleSubmit = async (event) => {
      // console.log(this.state.selectedCurrency);
      // console.log(this.state.purchaseAmount);
      // console.log(this.state.selectedFrequency);
      wretch().errorType("json")
   
      wretch('http://localhost:8180/create-plan')
        .post({
          "currency": this.state.selectedCurrency.symbol,
          "amount": this.state.purchaseAmount,
          "frequency": this.state.selectedFrequency,
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create an Investment Plan</h3>
                  <p className="mt-1 text-sm text-gray-500">Investment plans allow you to invest in cryptocurrenies over time using dollar-cost-averaging, known as DCA.</p>
                </div>
                <fieldset className="mt-6">
                  <div>
                    <legend className="text-base font-medium text-gray-900">Purchase Frequency</legend>
                    <p className="text-sm text-gray-500">How often should the plan trigger purchase orders?</p>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="frequency_daily"
                        name="purchase_frequency"
                        value="day"
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        onChange={this.onChangeFrequency} 
                      />
                      <label htmlFor="frequency_daily" className="ml-3 block text-sm font-medium text-gray-700">
                        Daily
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="frequency_weekly"
                        name="purchase_frequency"
                        value="week"
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        onChange={this.onChangeFrequency} 
                      />
                      <label htmlFor="frequency_weekly" className="ml-3 block text-sm font-medium text-gray-700">
                        Weekly
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="frequency_monthly"
                        name="purchase_frequency"
                        value="month"
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        onChange={this.onChangeFrequency} 
                      />
                      <label htmlFor="frequency_monthly" className="ml-3 block text-sm font-medium text-gray-700">
                        Monthly
                      </label>
                    </div>
                  </div>

                  <div>
                    <legend className="mt-6 text-base font-medium text-gray-900">Purchase Size and Currency</legend>
                    <p className="text-sm text-gray-500">How much should be purchased at a time? Select a currency to invest.</p>
                </div>  
      <div className="mt-3 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">	{this.state.selectedCurrency.sign}</span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          value={this.state.purchaseAmount}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0.00"
          aria-describedby="price-currency"
          onChange={this.handleAmountChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={this.state.selectedCurrency.symbol}
            onChange={this.handleCurrencyChange}
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          >
            {this.currencies.map((x) =>   
              <option key={x.symbol}>{x.symbol}</option>
            )}
          </select>
        </div>
        {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
        </div> */}
      </div>

                  
                </fieldset>

                <div>
      
                
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