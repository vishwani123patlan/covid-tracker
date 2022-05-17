import React, { useState, useEffect } from 'react';
import CardItem from './components/CardItem';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';

import axios from 'axios';
import './App.css';

function App() {
  const [countires, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all").then((response) => {
      setCountryData(response.data)
    });
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await axios.get("https://disease.sh/v3/covid-19/countries").then((response) => {
      const countires = (response.data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2
      })));
      const tableData = (response.data.map((country) => ({
        country: country.country,
        cases: country.cases
      })));
      setTableData(tableData)
      setCountries(countires)
    });
    }
    getCountriesData();
    
  }, []);

  const onCountryChange = (event) => {
    const countryName = event.target.value;
    setCountry(countryName);
    if(countryName === "worldwide"){
      axios.get("https://disease.sh/v3/covid-19/all").then((response) => {
        setCountryData(response.data)
      });
    }
    else{
      // "https://disease.sh/v3/covid-19/countries/IN"
      axios.get(`https://disease.sh/v3/covid-19/countries/${countryName}`).then((response) => {
        setCountryData(response.data)
      });
    }
  }
  return (
    <div className="app">
      <div className='app_left'>
        <div className='app_header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app_dropdown'>
            <Select onChange={onCountryChange} value={country}>
            <MenuItem value='worldwide'>WorldWide</MenuItem>
              { countires.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app_cards'>
            <CardItem title="Coronavirus Cases" caseClass={"corona_active"} cases={countryData.todayCases} total_cases={countryData.cases} />  
            <CardItem title="Recovered Cases" caseClass={"corona_recovered"} cases={countryData.todayRecovered} total_cases={countryData.recovered}/>  
            <CardItem title="Death Cases" caseClass={"corona_deaths"} cases={countryData.todayDeaths} total_cases={countryData.deaths}/>  
        </div>
      </div>
      <Card className='app_right'>
        <CardContent>
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
        <h3>WorldWide Cases</h3>
        <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
