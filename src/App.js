import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent, Typography} from '@material-ui/core';  
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import { sortData } from './main'
import LineGraph from './LineGraph';
import numeral from 'numeral'
import "leaflet/dist/leaflet.css"
import { casesTypeColors } from './main'

function App() {
	const [countries, setCountries] = useState([])
	const [country, setCountry] = useState("worldwide")
	const [info, setInfo] = useState({})
	const [tableData, setTableData] = useState([])
	const [mapCenter, setMapCenter] = useState({lat: 21, lng: 105.8})
	const [mapZoom, setMapZoom] = useState(3)
	// const [dataUrl, setDataUrl] = useState("https://disease.sh/v3/covid-19/historical/VNM?lastdays=120")
	const [dataUrl, setDataUrl] = useState("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
	const [mapCountries, setMapCountries] = useState([])
	const [caseType, setCaseType] = useState('cases')
	const [worldWideCases, setWorldWideCases] = useState(0)

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
			.then((response) => response.json())
			.then((data) => {
				const countries = data.map((country) => (
					{
						name: country.country,
						code: country.countryInfo.iso3,
						flag: country.countryInfo.flag
					}
				))
				setMapCountries(data)
				setCountries(countries)
				setTableData(sortData(data))
			})

			await fetch('https://disease.sh/v3/covid-19/all')
			.then(response => response.json())
			.then(data => {
				setInfo(data)
				setWorldWideCases(data['cases'])
			})
		}
		getCountriesData()
	}, [])

	const countryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode)

		const url = countryCode === 'worldwide' 
					? "https://disease.sh/v3/covid-19/all" 
					: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		
		await fetch(url)
		.then(response => response.json())
		.then(data => {
			setInfo(data)
			if(countryCode !== 'worldwide'){
				setMapCenter([
					data.countryInfo.lat,
					data.countryInfo.long
				])
				setMapZoom(4)
			}
		})
	}

	return (
		<div className="app">
			<div className='app_left'>
				<div className='app_header'>
					<div className='app_title'><h1>Covid 19 Tracker</h1></div>
					<FormControl className='app_dropdown'>
						<Select
							variant='outlined'
							value={country}
							onChange={countryChange}
							className='country_option'
						>
							<MenuItem value='worldwide'>World Wide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.code}>{country.name}<img className='country_flag' src={country.flag}></img>
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div> {/* app header */}

				<div className='statistics'>
					<InfoBox
						caseColor={casesTypeColors['cases'].hex}
						isRed={caseType === 'cases'}
						isGreen={false}
						onClick={(e) => setCaseType('cases')}
						title='Coronavirus Cases'
						increment={numeral(info.todayCases).format("0,0")}
						total={numeral(info.cases).format("0a")}
					></InfoBox>
					<InfoBox
						caseColor={casesTypeColors['recovered'].hex}
						isRed={false}
						isGreen={caseType === 'recovered'}
						onClick={(e) => setCaseType('recovered')}
						title='Recovered'
						increment={numeral(info.todayRecovered).format("0,0")}
						total={numeral(info.recovered).format("0a")}
					></InfoBox>
					<InfoBox
						caseColor={casesTypeColors['deaths'].hex}
						isRed={caseType === 'deaths'}
						isGreen={false}		
						onClick={(e) => setCaseType('deaths')}
						title='Deaths'
						increment={numeral(info.todayDeaths).format("0,0")}
						total={numeral(info.deaths).format("0a")}
					></InfoBox>
				</div>

				<Map
					countries={mapCountries}
					type={caseType}
					center={mapCenter}
					zoom={mapZoom}
				></Map>
			</div>{/* app left */}
			<Card className='app_right'>
				<CardContent>
					<h3 style={{fontSize: '24px'}}>Live Cases by Countries</h3>
					<Table countries={tableData} worldTotal={worldWideCases}></Table>

					<h3 className='graph_title'>{country === 'worldwide' ? 'Worldwide' : info.country} <span style={{color: casesTypeColors[caseType].hex}}>{caseType}</span> in last 60 days</h3>
					<LineGraph
						type={caseType}
						countryCode={country}
					></LineGraph>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
