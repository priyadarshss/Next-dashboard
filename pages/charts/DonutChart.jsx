import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const DonutChart = () => {
  const ref = useRef(null)

  useEffect(() => {
    const width = 800
    const height = 550
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const data = {
      'Renewable Energy': 25,
      'Energy Efficiency': 20,
      'Carbon Offset': 15,
      'Waste Reduction': 10,
      'Sustainable Transport': 5,
    }

    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(data))
      .range(d3.schemeCategory10)

    const pie = d3.pie().value((d) => d.value)

    const data_ready = pie(
      Object.entries(data).map(([key, value]) => ({ key, value }))
    )

    const arc = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8)

    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.key))
      .attr('stroke', 'skyblue')
      .style('stroke-width', '1px')
      .style('opacity', 0.7)

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .style('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('points', (d) => {
        const posA = arc.centroid(d)
        const posB = outerArc.centroid(d)
        const posC = outerArc.centroid(d)
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1)
        return [posA, posB, posC]
      })

    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d) => d.data.key)
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d)
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
        return `translate(${pos})`
      })
      .style('text-anchor', (d) =>
        d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI
          ? 'start'
          : 'end'
      )
      .attr('fill', 'white')
      .style('font-size', '16px')

    svg
      .append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + margin / 2)
      .attr('text-anchor', 'middle')
      .text('Sustainable Practices Distribution')
      .style('font-size', '28px')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('text-decoration', 'underline')
  }, [])

  return <svg width={800} height={550} ref={ref} />
}

export default DonutChart
