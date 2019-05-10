import React, { Component } from 'react';
import './G_Stock.css';
import StockInfo from './component/components/StockInfo';
import CompanyInfo from './component/components/CompanyInfo';
import LastMonthInfo from './component/components/LastMonthInfo';
import { loadQuoteForStock,loadQuoteCompanyDetails,loadCompanylastMonthRate} from './component/api/iex';

class G_Stock extends Component {
  state = {
    symbol: 'GOOG',
    quote: null
  }

  componentDidMount(){
    this.loadQuote()
  }

  loadQuote() {
    loadQuoteForStock(this.state.symbol)
    .then((quote)=> {
      console.log(quote)
      this.setState({quote: quote})
    })
    .catch((err)=> {console.log(err)})
    loadQuoteCompanyDetails(this.state.symbol)
    .then((company)=> {
      console.log(company)
      this.setState({company: company})
    })
    .catch((err)=> {console.log(err)})
    loadCompanylastMonthRate(this.state.symbol)
    .then((monthdata)=> {
      console.log(monthdata)
      this.setState({monthdata: monthdata})
    })
    .catch((err)=> {console.log(err)})
  }



  handleSymbolChange =(event)=>{
    const target = event.target;
    const symbol = target.value;
    this.setState({symbol: symbol });
    console.log(event);
  }

  handleButtonClick = (event) => {
    console.log(event.target);
    this.loadQuote();
  }

  render() {
    return (
      <div className="App">

      <StockInfo {...this.state.quote}/>
      <CompanyInfo {...this.state.company}/>
      <LastMonthInfo {...this.state.monthdata}/>
      </div>
    )
  }
}

export default G_Stock;
