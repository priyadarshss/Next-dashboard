import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const BarChart = () => {
  const ref = useRef(null)

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 100, left: 100 }
    const width = 860 - margin.left - margin.right
    const height = 600 - margin.top - margin.bottom

    const svg = d3
      .select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    d3.csv('/country_data.csv').then((data) => {
      data.forEach((d) => {
        d.total = +d.total
      })

      data.sort((a, b) => a.total - b.total)

      const x = d3
        .scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, (d) => d.total)])

      const y = d3
        .scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d.country))
        .padding(0.1)

      const xAxis = d3
      .axisBottom(x)
      .tickSize(0)
      .tickPadding(10)

      const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10)

      svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => y(d.country))
        .attr('height', y.bandwidth())
        .attr('x', 0)
        .attr('width', (d) => x(d.total))
        .style('fill', 'teal')

      svg
        .append('g')
        .attr('class', 'x axis')
        .style('font-size', '10px')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .call((g) => g.select('.domain').remove())

      svg
        .append('g')
        .attr('class', 'y axis')
        .style('font-size', '10px')
        .call(yAxis)
        .selectAll('path')
        .style('stroke-width', '2px')

      svg.selectAll('.y.axis .tick text').text((d) => d.toUpperCase())

      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom / 2)
        .attr('text-anchor', 'middle')
        .text('Customers')
        .style('font-size', '14px')
        .style('fill', 'white')

      svg
        .selectAll('line.vertical-grid')
        .data(x.ticks(10))
        .enter()
        .append('line')
        .attr('class', 'vertical-grid')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#ccc')
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3,3')

      svg
        .selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d) => x(d.total) + 20)
        .attr('y', (d) => y(d.country) + y.bandwidth() / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .text((d) => d.total)
        .style('fill', 'gray')
        .style('font-size', '10px')

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .text('Data Visualization with D3.js')
        .style('fill', 'white')
    })
  }, [])

  return <svg width='860' height='600' ref={ref} />
}

export default BarChart
