import React from 'react';
import './CardItem.css'
import { Card, CardContent, Typography } from '@material-ui/core'
function CardItem({caseClass, title, cases, total_cases}) {
  return (
    <div className='app_card'>
        <Card className={"card-item-"+caseClass+" card-item"}>
            <CardContent className="box">
              <Typography color='textSecondary'>{ title }</Typography>
              <h4 className={caseClass}>{ cases }</h4>
              <Typography color='textSecondary'>{ total_cases } total</Typography>
            </CardContent >  
        </Card>
    </div>
  )
}

export default CardItem