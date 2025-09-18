import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [path, setPath] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/map")
      .then((res) => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (selected.length === 2) {
      fetch(
        `http://localhost:8000/route?start=${selected[0]}&end=${selected[1]}`
      )
        .then((res) => res.json())
        .then((res) => setPath(res.path));
    }
  }, [selected]);

  if (!data) return <p>Loading map...</p>;

  return (
    <div className="App">
      <h2 className="text-xl font-bold mb-4">Interactive Train Map</h2>
      <svg width="600" height="400" style={{ border: "1px solid #ccc" }}>
        {/* Draw connections */}
        {data.connections.map((c, i) => {
          const from = data.stations.find((s) => s.id === c.from);
          const to = data.stations.find((s) => s.id === c.to);

          const isHighlighted =
            path.includes(c.from) && path.includes(c.to);

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "red" : c.line}
              strokeWidth={isHighlighted ? "8" : "6"}
              strokeLinecap="round"
            />
          );
        })}

        {/* Draw stations */}
        {data.stations.map((s) => (
          <g key={s.id} onClick={() => {
            if (selected.length < 2) {
              setSelected([...selected, s.id]);
            } else {
              setSelected([s.id]);
              setPath([]);
            }
          }}>
            <circle
              cx={s.x}
              cy={s.y}
              r="10"
              fill={selected.includes(s.id) ? "yellow" : "white"}
              stroke={s.line}
              strokeWidth="4"
              style={{ cursor: "pointer" }}
            />
            <text x={s.x + 12} y={s.y + 5} fontSize="14" fill="black">
              {s.name}
            </text>
          </g>
        ))}
      </svg>

      {selected.length === 1 && <p>Start: {selected[0]}</p>}
      {selected.length === 2 && <p>Route: {path.join(" → ")}</p>}
    </div>
  );
}

export default App;
