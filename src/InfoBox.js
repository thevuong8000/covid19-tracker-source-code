import React from 'react'
import { Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css'

function InfoBox(props) {
    return (
        <Card 
            className={`card_info ${props.isRed && 'box-red'} ${props.isGreen && 'box-green'}`} 
            onClick={props.onClick}>
            <CardContent>
                {/* Title */}
                <Typography color='primary'>{props.title}</Typography>

                {/* increment */}
                <h2 className='box_increment' style={{color: props.caseColor}}>+{props.increment}</h2>

                {/* total */}
                <Typography className='box_total'><span className='upper'>{props.total}</span> Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
