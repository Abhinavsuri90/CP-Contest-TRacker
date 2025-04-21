import { useState, useEffect } from 'react'
import { formatDistanceToNow, format, isAfter, isBefore, parseISO } from 'date-fns'
import '../styles/ContestCard.css'

function ContestCard({ contest }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [status, setStatus] = useState('')
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const startTime = parseISO(contest.startTime)
      const endTime = parseISO(contest.endTime)
      
      if (isBefore(now, startTime)) {
        setStatus('upcoming')
        setTimeLeft(formatDistanceToNow(startTime, { addSuffix: true }))
      } else if (isAfter(now, endTime)) {
        setStatus('ended')
        setTimeLeft(`Ended ${formatDistanceToNow(endTime, { addSuffix: true })}`)
      } else {
        setStatus('ongoing')
        setTimeLeft(`Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`)
      }
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [contest.startTime, contest.endTime])
  
  const formatDuration = (durationInMinutes) => {
    const hours = Math.floor(durationInMinutes / 60)
    const minutes = durationInMinutes % 60
    
    if (hours === 0) {
      return `${minutes} min`
    } else if (minutes === 0) {
      return `${hours} hr`
    } else {
      return `${hours} hr ${minutes} min`
    }
  }
  
  return (
    <div className={`contest-card ${status}`}>
      <div className="contest-platform" data-platform={contest.platform.toLowerCase()}>
        {contest.platform}
      </div>
      
      <h3 className="contest-name">{contest.name}</h3>
      
      <div className="contest-details">
        <div className="contest-timing">
          <div className="contest-date">
            {format(parseISO(contest.startTime), 'EEE, MMM d, yyyy')}
          </div>
          <div className="contest-time">
            {format(parseISO(contest.startTime), 'h:mm a')} - {format(parseISO(contest.endTime), 'h:mm a')}
          </div>
        </div>
        
        <div className="contest-duration">
          Duration: {formatDuration(contest.durationMinutes)}
        </div>
      </div>
      
      <div className="contest-status-bar">
        <span className={`status-badge ${status}`}>
          {status === 'upcoming' ? 'Upcoming' : status === 'ongoing' ? 'Live' : 'Ended'}
        </span>
        <span className="time-left">{timeLeft}</span>
      </div>
      
      <a 
        href={contest.url} 
        className="contest-link" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        View Contest
      </a>
    </div>
  )
}

export default ContestCard