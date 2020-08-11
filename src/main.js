import React from 'react'
import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

export const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        color: "rgba(204, 16, 52, 0.4)",
        multiplier: 900,
    },
    recovered: {
        hex: "#73cf11",
        color: "rgba(115, 207, 17, 0.4)",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        color: "rgba(251, 68, 67, 0.4)",
        multiplier: 2000,
    },
};


export const sortData = (data) => {
    const sortedData = [...data]

    sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
    return sortedData;
}

export const showDataOnMap = (data, type = 'cases') => (
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[type].hex}
            fillColor={casesTypeColors[type].hex}
            radius={
                Math.sqrt(country[type]) * casesTypeColors[type].multiplier
            }
        >
            <Popup>
                <div className='popup_country'>
                    <div className='popup_text'>{country.country}</div>
                    <img className='popup_country_flag' src={country.countryInfo.flag}></img>
                </div>
                <div className='popup_text'><strong>Total Cases:</strong> {numeral(country.cases).format("0,0")}</div>
                <div className='popup_text'><strong>Active Cases:</strong> {numeral(country.active).format("0,0")}</div>
                <div className='popup_text'><strong>Recovered:</strong> {numeral(country.recovered).format("0,0")}</div>
                <div className='popup_text'><strong>Deaths:</strong> {numeral(country.deaths).format("0,0")}</div>
            </Popup>

        </Circle>
    ))
);
