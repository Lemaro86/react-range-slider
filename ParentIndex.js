import React, {Component, Fragment} from 'react'
import Slider from './index' 

class ParentIndex extends Component {

state = {}

render(){
return(
<Slider
                                className='slider-period'
                                min={days[0]}
                                max={R.last(days)}
                                value={period}
                                values={days}
                                leftPos={selectedDays}
                                pointsArr={pointsArr}
                                onChange={this.handleChangePeriod}
                            />
)
}

export default ParentIndex
