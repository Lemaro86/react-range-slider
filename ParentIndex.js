import React, {Component} from 'react'
import Slider from './index'
import * as R from 'ramda'

class ParentIndex extends Component {

    state = {
        value: 50
    }

    handler = (value) => {
        this.setState({
            period: value
        })
    }
    
    getMiddleNear = (value, arr) => {
        if (!arr || !value || R.isEmpty(arr) || value <= 0) return 0
        if (value >= R.last(arr)) return R.last(arr)

        let oneOfArr = '';
        let more = 0
        const less = [];

        arr.map((i) => {
            if(i === value){
                oneOfArr = i
            } else if(value > i ){
                more = i
            } else if(value < i ){
                less.push(i)
            }
        })

        if(oneOfArr !== '') return oneOfArr

        return value - more > less[0] - value ? less[0] : more
    }

    createPointsArr = values => {
        const part = 648 / ( values.length - 1 )

        return values.map((item, i) => {
            return i === 0 ? 0 : parseInt(i * part) - 7
        })
    }
    
    render() {
        const {value} = this.state
        const days = [1, 2, 99, 100]
        const pointsArr = this.createPointsArr(days)
        const selectedDays = this.getMiddleNear(value, pointsArr)
        
        return (
            <Slider
                className='slider-period'
                min={days[0]}
                max={R.last(days)}
                value={value}
                values={days}
                leftPos={selectedDays}
                pointsArr={pointsArr}
                onChange={this.handler}
            />
        )
    }
}

export default ParentIndex
