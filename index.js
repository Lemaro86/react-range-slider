import React, {Component} from 'react'

import s from './styles.module.scss'
import cx from 'classnames'

class Slider extends Component {
    static defaultProps = {
        min: 0,
        max: 100,
        value: 0,
        labels: {},
        handleLabel: '',
        values: false
    };

    state = {}

/**
* может быть вам понадобится эта функция для того чтобы найти среднее и наиболее близкое значение к вашему 
*/
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

    getPosition = e => {
        const node = this.container
        const direction = node.getBoundingClientRect().left
        return !e.touches ? e.clientX - direction : e.touches[0].clientX - direction
    }

    handleStart = e => {
        const {onChangeStart} = this.props
        document.addEventListener('mousemove', this.handleDrag)
        document.addEventListener('mouseup', this.handleEnd)

        onChangeStart && onChangeStart(e)
    }

    handleDrag = e => {
        e.stopPropagation()
        const {onChange} = this.props
        if (!onChange) return

        onChange && onChange(this.getPosition(e), e)
    }

    handleEnd = e => {
        const {onChangeComplete} = this.props
        document.removeEventListener('mousemove', this.handleDrag)
        document.removeEventListener('mouseup', this.handleEnd)

        onChangeComplete && onChangeComplete(e)
    }

    renderLabels = (labels) => (
        <div ref={this.setLabelsRef} className={s.labels}>
            {labels}
        </div>
    )

    getLabels = (value, values, list, leftPos) => {
        if(!values.length > 0) return []

        return values.map((key, i) => (
            <div
                key={key}
                className={cx({
                    [s.labelItem]: true,
                    [s.active]: value > list[i],
                    [s.selected]: leftPos === list[i]
                })}
                data-value={key}
                style={{'left': `${list[i]}px`}}>
                {key}
            </div>
        ))
    }

    setContainerRef = (node) => this.container = node
    setRunnerRef = (node) => this.runner = node
    setLabelsRef = (node) => this.labels = node

    render() {
        const {className, values, value, leftPos, pointsArr} = this.props
        const container = cx({
            [s[className]]: true,
            [s.range]: true
        })

        const labelItems = this.getLabels(value, values, pointsArr, leftPos)
        const handleStyle =  {'left': `${leftPos === 0 ? -5 : leftPos}px`}
        const fillStyle =  {'width': `${leftPos + 7}px`}

        return (
            <div className={container}
                 ref={this.setContainerRef}
                 onMouseDown={this.handleDrag}
                 onMouseUp={this.handleEnd}
                 onTouchStart={this.handleStart}
                 onTouchEnd={this.handleEnd}>
                <div className={s.track}> </div>
                <div className={s.fill} style={fillStyle}> </div>
                <div
                    className={s.runner}
                    ref={this.setRunnerRef}
                    onMouseDown={this.handleStart}
                    onTouchMove={this.handleDrag}
                    onTouchEnd={this.handleEnd}
                    onKeyDown={this.handleKeyDown}
                    style={handleStyle}>
                </div>

                {labelItems && this.renderLabels(labelItems)}

            </div>
        )
    }
}

export default Slider
