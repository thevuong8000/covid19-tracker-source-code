import React from 'react'
import './Table.css'
import numeral from "numeral"

function Table(props) {
    return (
        <div className='table'>
            <tr>
                <td>Worldwide</td>
                <td>{numeral(props.worldTotal).format("0,0")}</td>
            </tr>
            {props.countries.map((country) => (
                <tr>
                    <td>{country.country}</td>
                    <td>{numeral(country.cases).format("0,0")}</td>
                </tr>
            ))}
        </div>
    )
}

export default Table
