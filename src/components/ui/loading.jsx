
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function CarLoading({ text = "Loading" }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] w-full">
      <div className="relative w-full max-w-md h-48">
        {/* Road */}
        <div className="absolute bottom-0 w-full h-12">
          {/* Road surface */}
          <motion.div
            className="absolute bottom-0 w-full h-3 bg-gray-800 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Road markings */}
          <div className="absolute bottom-1 w-full h-1 overflow-hidden">
            <motion.div
              className="absolute w-full h-full flex"
              animate={{ x: [0, -200] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-12 h-1 mx-8 bg-yellow-400" />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Car SVG */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <motion.svg
            width="182"
            height="92"
            viewBox="0 0 365 185"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top */}
            <motion.rect
              x="70"
              y="10"
              width="220"
              height="130"
              fill="transparent"
              rx="150"
              stroke="crimson"
              strokeWidth="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Body */}
            <motion.rect
              x="10"
              y="70"
              width="340"
              height="80"
              fill="crimson"
              rx="30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
              {/* Left line */}
              <line x1="145" y1="10" x2="145" y2="80" stroke="crimson" strokeWidth="10" />
              {/* Right line */}
              <line x1="215" y1="10" x2="215" y2="80" stroke="crimson" strokeWidth="10" />
            </motion.g>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
              {/* Left bumper */}
              <rect x="0" y="110" width="40" height="20" fill="#999" rx="10" />
              {/* Right bumper */}
              <rect x="325" y="110" width="40" height="20" fill="#999" rx="10" />
            </motion.g>

            {/* Left wheel with spinning animation */}
            <g>
              <motion.circle
                r="40"
                fill="#222"
                stroke="white"
                strokeWidth="7"
                cx="90"
                cy="140"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.circle
                r="15"
                fill="#555"
                cx="90"
                cy="140"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.5 },
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              />
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.5 },
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              >
                <line x1="90" y1="125" x2="90" y2="155" stroke="#333" strokeWidth="3" />
                <line x1="75" y1="140" x2="105" y2="140" stroke="#333" strokeWidth="3" />
              </motion.g>
            </g>

            {/* Right wheel with spinning animation */}
            <g>
              <motion.circle
                r="40"
                fill="#222"
                stroke="white"
                strokeWidth="7"
                cx="270"
                cy="140"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.circle
                r="15"
                fill="#555"
                cx="270"
                cy="140"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.5 },
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              />
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.5 },
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              >
                <line x1="270" y1="125" x2="270" y2="155" stroke="#333" strokeWidth="3" />
                <line x1="255" y1="140" x2="285" y2="140" stroke="#333" strokeWidth="3" />
              </motion.g>
            </g>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
              {/* Gold light with glowing effect */}
              <motion.circle
                r="15"
                fill="gold"
                cx="340"
                cy="90"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  r: [15, 16, 15],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Orange light */}
              <circle r="10" fill="orange" cx="15" cy="90" />
            </motion.g>

            {/* Light beam effect */}
            <motion.path
              d="M340,90 L380,70 L380,110 Z"
              fill="gold"
              opacity={0.2}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                x: [0, 5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </motion.div>

        {/* Exhaust smoke */}
        <div className="absolute bottom-16 left-[25%]">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gray-400/60"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [-5 - i * 3, -15 - i * 5],
                y: [0, -3 - i],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                delay: i * 0.3,
                repeatDelay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Road reflection */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-1 bg-crimson/10 blur-sm"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            width: [170, 190, 170],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
          style={{ backgroundColor: "rgba(220, 20, 60, 0.1)" }}
        />
      </div>

      <div className="mt-8 text-center">
        <motion.p
          className="text-lg font-medium text-crimson"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ color: "crimson" }}
        >
          {text}
          {dots}
        </motion.p>
      </div>
    </div>
  )
}

