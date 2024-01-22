import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

const Barchart = () => {
  const ref = useRef()

  useEffect(() => {
    const margin = { top: 70, right: 30, bottom: 40, left: 80 }
    const width = 1000 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    // Set up the x and y scales

    const x = d3.scaleTime().range([0, width])

    const y = d3.scaleLinear().range([height, 0])

    // Create the SVG element and append it to the chart container

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create a fake data

    d3.csv('/data.csv').then((data) => {
      const parseDate = d3.timeParse('%Y-%m-%d')
      data.forEach((d) => {
        d.date = parseDate(d.date)
        d.population = +d.population
      })

      data.sort((a, b) => a.date - b.date)

      // Define the x and y domains

      x.domain(d3.extent(data, (d) => d.date))
      y.domain([85000, d3.max(data, (d) => d.population)])

      // Add the x-axis

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .style('font-size', '14px')
        .call(
          d3
            .axisBottom(x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat('%b')) // Use %b to display abbreviated month
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('.tick line')
        .style('stroke-opacity', 0)
      svg.selectAll('.tick text').attr('fill', '#777')

      // Add the y-axis

      svg
        .append('g')
        .style('font-size', '14px')
        .call(
          d3
            .axisLeft(y)
            .ticks((d3.max(data, (d) => d.population) - 85000) / 5000)
            .tickFormat((d) => `${d / 1000}k`)
            .tickSize(0)
            .tickPadding(10)
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('.tick text')
        .style('fill', '#777')
        .style('visibility', (d, i) => (i === 0 ? 'hidden' : 'visible'))

      // Add vertical gridlines

      svg
        .selectAll('xGrid')
        .data(x.ticks())
        .join('line')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#ccc')
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,2')

      // Add horizontal gridlines

      svg
        .selectAll('yGrid')
        .data(
          y.ticks((d3.max(data, (d) => d.population) - 85000) / 5000).slice(1)
        )
        .join('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', '#ccc')
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,2')

      // add title for chart

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .text('Data Visualization with D3.js')
        .style('fill', 'white')

      // add y-axis label

      svg
        .append('text')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('dy', '-1em')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Customers')
        .style('fill', 'white')

      // add x-axis label

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + 30)
        .attr('dy', '0.5em')
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Months')
        .style('fill', 'white')

      // add source label

      svg
        .append('text')
        .attr('x', width / 100)
        .attr('y', height + 50)
        .attr('dy', '-1.5em')
        .style('font-size', '9px')
        .text('Source: https://mysampledata.com/')
        .style('fill', 'gray')

      // create tooltip

      const tooltip = d3.select('body').append('div').attr('class', 'tooltip')

      // add circle element

      const circle = svg
        .append('circle')
        .attr('r', 0)
        .attr('fill', 'steelblue')
        .style('stroke', 'white')
        .attr('opacity', 0.7)
        .style('pointer-events', 'none')
      // create a listening rectangle

      const listeningRect = svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)

      // create the mouse move function

      listeningRect.on('mousemove', function (event) {
        const [xCoord] = d3.pointer(event, this)
        const bisectDate = d3.bisector((d) => d.date).left
        const x0 = x.invert(xCoord)
        const i = bisectDate(data, x0, 1)
        const d0 = data[i - 1]
        const d1 = data[i]
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0
        const xPos = x(d.date)
        const yPos = y(d.population)

        // Update the circle position

        circle.attr('cx', xPos).attr('cy', yPos)

        // Add transition for the circle radius

        circle.transition().duration(50).attr('r', 5)

        // add in  our tooltip

        tooltip
          .style('display', 'block')
          .style('left', `${xPos + 100}px`)
          .style('top', `${yPos + 50}px`)
          .html(
            `<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Population:</strong> ${
              d.population !== undefined
                ? (d.population / 1000).toFixed(0) + 'k'
                : 'N/A'
            }`
          )
      })
      // listening rectangle mouse leave function

      listeningRect.on('mouseleave', function () {
        circle.transition().duration(50).attr('r', 0)

        tooltip.style('display', 'none')
      })

      // Create the line generator

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.population))

      // Add the line path to the SVG element

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('d', line)
    })
  }, [])

  return (
    <div className='p-4 flex flex-col gap-4 justify-center items-center w-full'>
      <svg width={1000} height={500} id='barchart' ref={ref} />
      <button className='p-3 mt-10 bg-purple-950 rounded-full flex justify-center items-center'
        onClick={() => window.open('/charts', '_self')}
      >
        Click to view more sample charts using D3.js
      </button>
    </div>
  )
}

export default Barchart
