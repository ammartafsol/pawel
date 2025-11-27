import React from 'react';
import classes from "./AuditTrackingTemplate.module.css"
import { Col, Row } from 'react-bootstrap';
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import CircularCaseProgressChart from '@/components/atoms/CircularCaseProgressChart/CircularCaseProgressChart';
import { circularCaseProgressChartData } from '@/developementContent/Data/dummtData/dummyData';

const AuditTrackingTemplate = () => {
  return (
    <div className='p24'>
      <Row>
        <Col md={4}>
        <Wrapper contentClassName={classes?.contentClassName} title='Audit Tracking'>
        <div className={classes.circularCaseProgressChart}>
        <CircularCaseProgressChart data={circularCaseProgressChartData}/>
        </div>
        </Wrapper>
        </Col>
        <Col md={8}>
        <Wrapper contentClassName={classes?.contentClassName} title='Overdue Case Progresses'>2</Wrapper>
        </Col>
      </Row>
    </div>
  )
}

export default AuditTrackingTemplate