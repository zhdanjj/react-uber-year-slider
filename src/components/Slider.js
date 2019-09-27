import React from 'react'
import range from 'lodash/range'

const SCALES = [1, .668998984, .4888403205746039, .3602607087370237, .23162447888007007]
const OPACITIES = [1, .5, .4, .3, .2, .1]
const MARGIN = 40

class Slider extends React.Component {
  constructor() {
    super()
    this.state = {
      years: range(1999, 2019),
      centeredIndex: 0,
      sliderWidth: 0,
      itemWidth: 0,
    }
    this.sliderRef = React.createRef()
  }

  get trackOffset() {
    const sliderWidth = this.state.sliderWidth
    const itemWidth = this.state.itemWidth
    const centered = this.state.centeredIndex
    const transforms = this.sampleValues(
      centered,
      this.state.years.length,
      SCALES
    )
    return (sliderWidth / 2 - itemWidth / 2 - MARGIN / 2) - transforms.slice(0, centered).reduce((summ, current) => {
      return summ + current * itemWidth + MARGIN
    }, 0)
  }

  componentDidMount() {
    const nth = this.state.centeredIndex + 1
    const sliderEl = this.sliderRef.current
    this.setState({
      ...this.state,
      sliderWidth: sliderEl.offsetWidth,
      itemWidth: sliderEl.querySelector(`.item:nth-child(${nth})`).offsetWidth,
    })
  }

  setCenteredIndex(index) {
    this.setState({
      centeredIndex: index
    })
  }

  sampleValues(index, length, sample) {
    return new Array(length)
      .fill(0)
      .map((_, i) => {
        const offset = Math.abs(index - i)
        return offset < sample.length ?
          sample[offset] 
          : sample[sample.length - 1]
      })
  }

  render() {
    const years = this.state.years
    const centered = this.state.centeredIndex
    const nextIndex = Math.min(centered + 1, years.length - 1)
    const prevIndex = Math.max(centered - 1, 0)
    const itemWidth = this.state.itemWidth

    return (
      <div className="slider" ref={this.sliderRef}>
        <div className="track" style={{transform: `translateX(${this.trackOffset}px)`}}>
          {
            years.map((year, i) => {
              const centered = this.state.centeredIndex
              const opacities = this.sampleValues(centered, years.length, OPACITIES)
              const opacity = opacities[i]
              const transforms = this.sampleValues(centered, years.length, SCALES)
              const transform = transforms[i]
              const styles = {
                opacity,
                transform: `scale(${transform})`,
                margin: `0 ${MARGIN / 2 + (itemWidth * transform - itemWidth) / 2}px`,
              }

              return (
                <div
                  className="item"
                  key={i}
                  style={styles}
                  onClick={this.setCenteredIndex.bind(this, i)}
                >
                  {year}
                </div>
              )
            })
          }
        </div>
        <div className="controls">
          <div className="btn left" onClick={this.setCenteredIndex.bind(this, prevIndex)}>&lt;</div>
          <div className="btn right" onClick={this.setCenteredIndex.bind(this, nextIndex)}>&gt;</div>
        </div>
      </div>
    )
  }
}

export default Slider;
