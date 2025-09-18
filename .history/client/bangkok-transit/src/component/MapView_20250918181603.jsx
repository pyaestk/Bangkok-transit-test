import React, { useEffect, useState } from "react";

export default function MapView() {
  const [stations, setStations] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/map")
      .then((res) => res.json())
      .then((data) => {
        setStations(data.stations);
        setConnections(data.connections);
      });
  }, []);

  return (
    <div className="flex justify-center items-center p-8">
      <svg width="600" height="300">
        {/* Draw connections as thick metro lines */}
        {connections.map((c, i) => {
          const from = stations.find((s) => s.id === c.from);
          const to = stations.find((s) => s.id === c.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={c.line === "green" ? "#007f3e" : "#000"}
              strokeWidth="14"
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw stations */}
        {stations.map((s) => (
          <g key={s.id} transform={`translate(${s.x},${s.y})`}>
            <rect
              x={-30}
              y={-20}
              rx="10"
              ry="10"
              width="60"
              height="40"
              fill="white"
              stroke={s.line === "green" ? "#007f3e" : "#000"}
              strokeWidth="6"
            />
            <text
              textAnchor="middle"
              alignmentBaseline="middle"
              fontWeight="bold"
              fontSize="12"
            >
              {s.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
