import React, { useState, useEffect } from 'react';
import CardItem from './components/CardItem';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { FormControl, Select, MenuItem, Card, CardContent , Button, Avatar} from '@material-ui/core';
import { buildChartData } from './util';
import axios from 'axios';
import './App.css';

function App() {
  const [countires, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [graphtype, setGraphtype] = useState("bar");

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

  const changeGraphType = (event) => {
    const graphType = (graphtype=="bar" ? "line" : "bar")
    setGraphtype(graphType)
  }
  return (
    <div className="app">
      <div className='app_left'>
        <div className='app_header'>
          <div className='avatar_heading'>
            <Avatar alt="Remy Sharp" src="https://cdn-icons-png.flaticon.com/512/1097/1097326.png" />
            <h1>Covid-19 Tracker</h1>
          </div>
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
        <h1>World-Wide Graphical Representation</h1>
        <div className='chart-radio'>
          { (graphtype === "bar") ? <Button variant="contained" onClick={changeGraphType}>Show Line Graph</Button> : <Button variant="contained" onClick={changeGraphType}>Show Bar Graph</Button>}
        </div>
        <LineGraph graphType={graphtype} />
      </div>
      <Card className='app_right'>
        <CardContent>
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
        <div className='guidelines'>
          <h4>How to Protect Yourself & Others</h4>
          <ul>
            <li>Get Vaccinated and stay up to date on your COVID-19 vaccines</li>
            <li>Wear a mask</li>
            <li>Stay 6 feet away from others</li>
            <li>Avoid poorly ventilated spaces and crowds</li>
            <li>Test to prevent spread to others</li>
            <li>Wash your hands often</li>
            <li>Cover coughs and sneezes</li>
            <li>Clean and disinfect</li>
            <li>Monitor your health daily</li>
            <li>Take precautions when you travel</li>
          </ul>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
