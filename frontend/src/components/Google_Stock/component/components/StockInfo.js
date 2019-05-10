import React from 'react';

function StockInfo({
  symbol,
  companyName,
  primaryExchange,
  latestPrice,
  latestSource,
  week52High,
  week52Low
}){

  return(
    <div>
    <h2>{ symbol }: { companyName }</h2>
    <h3>{ latestPrice } ({ latestSource} )</h3>
    <center>
    <table>
    <tr>
        <td><b>Week 52 High</b></td>
        <td>{ week52High }</td>
    </tr>
    <tr>
        <td><b>Week 52 Low</b></td>
        <td>{ week52Low }</td>
    </tr>
    <tr>
        <td><b>Exchange</b></td>
        <td>{ primaryExchange }</td>
    </tr>
    </table>
  </center>
</div>
  )
}

export default StockInfo;
