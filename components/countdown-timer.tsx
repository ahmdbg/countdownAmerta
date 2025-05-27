"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"

interface TimeUnit {
  value: number
  label: string
  max: number
}

interface CountdownTimerProps {
  targetDate?: Date
}

// You can change this default target date/time here by editing the string below
const defaultTargetDate = new Date("2025-05-31T20:00:00")

const FlipNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true)

      // Smooth transition with staggered timing
      const timer1 = setTimeout(() => {
        setDisplayValue(value)
      }, 200)

      const timer2 = setTimeout(() => {
        setIsAnimating(false)
      }, 400)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [value, displayValue])

  return (
    <div className="relative overflow-hidden h-16 w-20 flex items-center justify-center">
      {/* Current number */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
          isAnimating
            ? "transform -translate-y-8 scale-95 opacity-0 blur-sm"
            : "transform translate-y-0 scale-100 opacity-100 blur-0"
        }`}
      >
        <span className="text-4xl md:text-5xl font-light text-white transition-all duration-300">
          {isAnimating ? displayValue : value}
        </span>
      </div>

      {/* New number sliding in */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
          isAnimating
            ? "transform translate-y-0 scale-100 opacity-100 blur-0"
            : "transform translate-y-8 scale-95 opacity-0 blur-sm"
        }`}
      >
        <span className="text-4xl md:text-5xl font-light text-white transition-all duration-300">{value}</span>
      </div>

      {/* Glow effect during transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-lg transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  // Memoize the target date to prevent creating new objects on every render
  const target = useMemo(() => {
    if (targetDate) return targetDate
    return defaultTargetDate
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: "DAYS", max: 365 },
    { value: 0, label: "HOURS", max: 24 },
    { value: 0, label: "MINUTES", max: 60 },
    { value: 0, label: "SECONDS", max: 60 },
  ])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const targetTime = target.getTime()
      const difference = targetTime - now

      let days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0

      if (difference > 0) {
        days = Math.floor(difference / (1000 * 60 * 60 * 24))
        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        seconds = Math.floor((difference % (1000 * 60)) / 1000)
      }

      // Only update state if values have changed
      setTimeLeft((prevTime) => {
        const newTime = [
          { value: days, label: "DAYS", max: 365 },
          { value: hours, label: "HOURS", max: 24 },
          { value: minutes, label: "MINUTES", max: 60 },
          { value: seconds, label: "SECONDS", max: 60 },
        ]

        // Check if any values have changed
        const hasChanged = prevTime.some((prev, index) => prev.value !== newTime[index].value)
        return hasChanged ? newTime : prevTime
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [target])

  const CircularProgress = ({ value, max, children }: { value: number; max: number; children: React.ReactNode }) => {
    const [animatedValue, setAnimatedValue] = useState(value)

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedValue(value)
      }, 100)
      return () => clearTimeout(timer)
    }, [value])

    const percentage = (animatedValue / max) * 100
    const strokeDasharray = 2 * Math.PI * 45 // radius = 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="2" fill="none" />
          {/* Progress circle with smooth transition */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-in-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
              transitionProperty: "stroke-dashoffset, filter",
            }}
          />
          {/* Enhanced gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6">
                <animate
                  attributeName="stop-color"
                  values="#3b82f6;#1d4ed8;#3b82f6"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#06b6d4">
                <animate
                  attributeName="stop-color"
                  values="#06b6d4;#0891b2;#06b6d4"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#22c55e">
                <animate
                  attributeName="stop-color"
                  values="#22c55e;#16a34a;#22c55e"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-8000"></div>
        </div>

        {/* Additional aurora layers */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-3000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-2xl font-light text-gray-300 mb-12 tracking-wider drop-shadow-lg">COUNTDOWN AMERTA NS 2025</h1>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {timeLeft.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <CircularProgress value={unit.value} max={unit.max}>
                <FlipNumber value={unit.value} />
              </CircularProgress>
              <p className="text-gray-300 text-sm font-light tracking-wider mt-4 drop-shadow-md">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
