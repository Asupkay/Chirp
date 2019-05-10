import React from 'react';

function CompanyInfo({
  website,
  description,
  CEO,
  sector,
  industry
}){

  return(
    <div>
    <center>
    <table width="265">
    <tr>
        <td><b>Website</b></td>
        <td>{ website }</td>
    </tr>
    <tr>
        <td><b>Description</b></td>
        <td>{ description }</td>
    </tr>
    <tr>
        <td><b>CEO</b></td>
        <td>{ CEO }</td>
    </tr>
    <tr>
        <td><b>Sector</b></td>
        <td>{ sector }</td>
    </tr>
    <tr>
        <td><b>Industry</b></td>
        <td>{ industry }</td>
    </tr>

    </table>
</center>

    </div>
  )
}

export default CompanyInfo;
