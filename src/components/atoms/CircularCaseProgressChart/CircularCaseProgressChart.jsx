import React from 'react'
import PropTypes from 'prop-types'
import classes from './CircularCaseProgressChart.module.css'

export default function CircularCaseProgressChart({ 
  data = [
    { label: 'In progress', value: 2, color: '#8E5AFD' },
    { label: 'Completed', value: 1, color: '#33C8C2' },
    { label: 'Not Started', value: 0.5, color: '#B7EAE8' }
  ],
  centerText = '0-2',
  size = 200,
  strokeWidth = 40
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulativeOffset = 0
  const segments = []

  for (const item of data) {
    const percentage = item.value / total
    const segmentLength = percentage * circumference
    const dashArray = `${segmentLength} ${circumference}`
    const dashOffset = circumference - cumulativeOffset

    // Calculate position for value text (center of segment arc)
    const segmentAngle = (item.value / total) * 360
    const startAngle = (cumulativeOffset / circumference) * 360 - 90
    const midAngle = startAngle + segmentAngle / 2
    const midAngleRad = (midAngle * Math.PI) / 180
    const textRadius = radius // Center of the stroke width
    const textX = center + textRadius * Math.cos(midAngleRad)
    const textY = center + textRadius * Math.sin(midAngleRad)

    segments.push({
      dashArray,
      dashOffset,
      color: item.color,
      value: item.value,
      label: item.label,
      textX,
      textY
    })

    cumulativeOffset += segmentLength
  }

  return (
    <div className={classes.container}>
      <div className={classes.chartWrapper}>
        <svg width={size} height={size} className={classes.chart}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#D9D9D9"
            strokeWidth={strokeWidth}
            className={classes.backgroundCircle}
          />
          
          {/* Segments */}
          {segments.map((segment) => (
            <g key={segment.label}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
                className={classes.segment}
                transform={`rotate(-90 ${center} ${center})`}
              />
              {/* Value text on segment */}
              <text
                x={segment.textX}
                y={segment.textY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={classes.segmentValue}
              >
                {segment.value}
              </text>
            </g>
          ))}
          
          {/* Center text */}
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className={classes.centerText}
          >
            {centerText}
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className={classes.legend}>
        {data.map((item) => (
          <div key={item.label} className={classes.legendItem}>
            <div 
              className={classes.legendDot}
              style={{ backgroundColor: item.color }}
            />
            <span className={classes.legendText}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

CircularCaseProgressChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  centerText: PropTypes.string,
  size: PropTypes.number,
  strokeWidth: PropTypes.number
}
