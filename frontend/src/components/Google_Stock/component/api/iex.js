import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.iextrading.com/1.0'
});

export function loadQuoteForStock(symbol){
  return api.get(`/stock/${symbol}/quote`)
  .then((res)=>{
    return  res.data
  });
}

export function loadQuoteCompanyDetails(symbol){
  return api.get(`/stock/${symbol}/company`)
  .then((res1)=>{
    return  res1.data
  });
}

export function loadCompanylastMonthRate(symbol){

  return api.get(`/stock/${symbol}/chart/1m`)
  .then(response =>
      response.data.map(daydata => ({
        date: `${daydata.date}`,
        open: `${daydata.open}`,
      }))
    )
  .then((response )=>{
    console.log(this.daydata);
    return  this.daydata;
  });
}
