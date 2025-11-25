import React from 'react'
import PropTypes from 'prop-types'
import classes from './CircularCaseProgressChart.module.css'

export default function CircularCaseProgressChart({ 
  data = [],
  centerText = '0-2',
  size = 250,
  strokeWidth = 40
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = (size - strokeWidth) / 2
  const center = size / 2

  let currentAngle = -90 // Start from top
  const segments = []

  // Helper function to create arc path
  const createArcPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    const x1 = center + innerRadius * Math.cos(startAngleRad)
    const y1 = center + innerRadius * Math.sin(startAngleRad)
    const x2 = center + outerRadius * Math.cos(startAngleRad)
    const y2 = center + outerRadius * Math.sin(startAngleRad)
    const x3 = center + outerRadius * Math.cos(endAngleRad)
    const y3 = center + outerRadius * Math.sin(endAngleRad)
    const x4 = center + innerRadius * Math.cos(endAngleRad)
    const y4 = center + innerRadius * Math.sin(endAngleRad)
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
      'Z'
    ].join(' ')
  }

  for (const item of data) {
    const percentage = item.value / total
    const segmentAngle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + segmentAngle

    // Create path for the segment (donut slice)
    const innerRadius = radius - strokeWidth / 2
    const outerRadius = radius + strokeWidth / 2
    const pathData = createArcPath(startAngle, endAngle, innerRadius, outerRadius)

    // Calculate position for value text (center of segment arc)
    const midAngle = startAngle + segmentAngle / 2
    const midAngleRad = (midAngle * Math.PI) / 180
    const textRadius = radius // Center of the stroke width
    const textX = center + textRadius * Math.cos(midAngleRad)
    const textY = center + textRadius * Math.sin(midAngleRad)

    segments.push({
      pathData,
      color: item.color,
      value: item.value,
      label: item.label,
      textX,
      textY
    })

    currentAngle = endAngle
  }

  return (
    <div className={classes.container}>
      <div className={classes.chartWrapper}>
        <svg width={size} height={size} className={classes.chart}>
          {/* Background circle - outer edge */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth / 2}
            fill="none"
            stroke="#D9D9D9"
            strokeWidth="1"
            className={classes.backgroundCircle}
          />
          {/* Background circle - inner edge */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke="#D9D9D9"
            strokeWidth="1"
            className={classes.backgroundCircle}
          />
          
          {/* Segments */}
          {segments.map((segment) => (
            <g key={segment.label}>
              <path
                d={segment.pathData}
                fill={segment.color}
                className={classes.segment}
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
              style={{ borderColor: item.color }}
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
