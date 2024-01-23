import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const AreaChart = () => {
  const ref = useRef(null)
  const slider = useRef(null)

  useEffect(() => {
    const margin = { top: 20, right: 100, bottom: 100, left: 20 }
    const width = 860 - margin.left - margin.right
    const height = 600 - margin.top - margin.bottom

    const x = d3.scaleTime().range([0, width])
    const y = d3.scaleLinear().range([height, 0])

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'teal')
      .attr('stop-opacity', 1)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'teal')
      .attr('stop-opacity', 0)

    d3.csv('/TSLA.csv').then((data) => {
      const parseDate = d3.timeParse('%Y-%m-%d')
      data.forEach((d) => {
        d.Date = parseDate(d.Date)
        d.Close = +d.Close
      })

      x.domain(d3.extent(data, (d) => d.Date))
      y.domain([0, d3.max(data, (d) => d.Close)])

      svg
        .append('g')
        .attr('class', 'x axis')
        .style('font-size', '14px')
        .call(
          d3
            .axisBottom(x)
            .tickValues(x.ticks(d3.timeYear.every(1)))
            .tickFormat(d3.timeFormat('%Y'))
            .tickPadding(10)
        )
        .attr('transform', `translate(0,${height})`)
        .selectAll('.tick text')
        .style('fill', '#777')

      svg
        .append('g')
        .attr('class', 'y axis')
        .call(
          d3
            .axisRight(y)
            .tickFormat((d) => {
              if (isNaN(d)) return ''
              return `$${d.toFixed(2)}`
            })
            .tickPadding(10)
        )
        .attr('transform', `translate(${width}, 0)`)
        .selectAll('.tick text')
        .style('fill', '#777')
        .style('font-size', '14px')

      const line = d3
        .line()
        .x((d) => x(d.Date))
        .y((d) => y(d.Close))

      const area = d3
        .area()
        .x((d) => x(d.Date))
        .y0(height)
        .y1((d) => y(d.Close))

      svg
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', 'teal')
        .style('stroke-width', 1)

      svg
        .append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area)
        .style('fill', 'url(#gradient)')
        .style('opacity', 0.5)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'block')
        .style('position', 'absolute')
        .style('background', 'gray')
        .style('padding', '2px')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('font-size', '14px')
        .style('color', 'black')

      const tooltipRawDate = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'block')
        .style('position', 'absolute')
        .style('background', 'gray')
        .style('padding', '2px')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('font-size', '14px')
        .style('color', 'black')

      const circle = svg
        .append('circle')
        .attr('r', 0)
        .style('fill', 'red')
        .style('stroke', 'white')
        .style('opacity', 0.7)
        .style('pointer-events', 'none')

      const tooltipLineX = svg
        .append('line')
        .attr('class', 'tooltip-line')
        .attr('id', 'tooltip-line-x')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2, 2')

      const tooltipLineY = svg
        .append('line')
        .attr('class', 'tooltip-line')
        .attr('id', 'tooltip-line-y')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2, 2')

      const listeningRect = svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('opacity', 0)

      listeningRect.on('mousemove', function (event) {
        const [xCoord] = d3.pointer(event, this)
        const bisectDate = d3.bisector((d) => d.Date).left
        const x0 = x.invert(xCoord)
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0
        const xPos = x(d.Date)
        const yPos = y(d.Close)

        circle.attr('cx', xPos).attr('cy', yPos)
        circle.transition().duration(50).attr('r', 5)

        tooltipLineX
          .style('display', 'block')
          .attr('x1', xPos)
          .attr('x2', xPos)
          .attr('y1', 0)
          .attr('y2', height)

        tooltipLineY
          .style('display', 'block')
          .attr('y1', yPos)
          .attr('y2', yPos)
          .attr('x1', 0)
          .attr('x2', width)

        tooltip
          .style('display', 'block')
          .style('left', `${width + 410}px`)
          .style('top', `${yPos + 85}px`)
          .html(`$${d.Close !== undefined ? d.Close.toFixed(2) : 'N/A'}`)

        tooltipRawDate
          .style('display', 'block')
          .style('left', `${xPos + 360}px`)
          .style('top', `${height + 110}px`)
          .html(
            `${
              d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : 'N/A'
            }`
          )
      })

      listeningRect.on('mouseleave', function () {
        circle.transition().duration(50).attr('r', 0)
        tooltip.style('display', 'none')
        tooltipRawDate.style('display', 'none')
        tooltipLineX.attr('x1', 0).attr('x2', 0)
        tooltipLineY.attr('y1', 0).attr('y2', 0)
        tooltipLineX.style('display', 'none')
        tooltipLineY.style('display', 'none')
      })

      svg
        .append('text')
        .attr('class', 'source')
        .attr('x', width - width / 10)
        .attr('y', height + margin.bottom / 2)
        .text('Source: Yahoo Finance')
        .style('font-size', '12px')
        .style('fill', 'gray')

      svg
        .append('text')
        .attr('class', 'chart-title')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('font-family', 'sans-serif')
        .style('fill', 'white')
        .text('Tesla, Inc. (TSLA)')
    })
  }, [])

  return (
    <>
      <svg width='860' height='600' ref={ref} />
      <div ref={slider} />
    </>
  )
}

export default AreaChart
