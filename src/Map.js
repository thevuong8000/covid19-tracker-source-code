import React from 'react'
import './Map.css';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { showDataOnMap } from './main'


function Map({countries, type, center, zoom }) {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {showDataOnMap(countries, type)}
            </LeafletMap>
        </div>
    )
}

export default Map
