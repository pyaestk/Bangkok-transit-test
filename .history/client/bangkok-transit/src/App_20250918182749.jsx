import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./App.css";

const lineColors = {
  green: "#2ecc71",
  red: "#e74c3c",
  blue: "#3498db",
};

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
      <h2 style={{ fontFamily: "sans-serif", textAlign: "center" }}>
        Metro Map Example
      </h2>

      <div className="map-container">
        <TransformWrapper>
          <TransformComponent>
            <svg className="map-svg">
              {/* Draw connections as railway tracks */}
              {data.connections.map((c, i) => {
                const from = data.stations.find((s) => s.id === c.from);
                const to = data.stations.find((s) => s.id === c.to);

                const isHighlighted =
                  path.includes(c.from) && path.includes(c.to);

                return (
                  <g key={i}>
                    {/* Outline (track border) */}
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="white"
                      strokeWidth={isHighlighted ? "12" : "10"}
                      strokeLinecap="round"
                    />
                    {/* Colored track */}
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={
                        isHighlighted ? "red" : lineColors[c.line] || c.line
                      }
                      strokeWidth={isHighlighted ? "8" : "6"}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* Draw stations */}
              {data.stations.map((s) => {
                const isSelected = selected.includes(s.id);

                return (
                  <g
                    key={s.id}
                    onClick={() => {
                      if (selected.length < 2) {
                        setSelected([...selected, s.id]);
                      } else {
                        setSelected([s.id]);
                        setPath([]);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Station node */}
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r="10"
                      fill={isSelected ? "yellow" : "white"}
                      stroke={lineColors[s.line]}
                      strokeWidth="4"
                    />

                    {/* Station label */}
                    <text
                      x={s.x + 15}
                      y={s.y - 10}
                      fontSize="13"
                      fontFamily="Arial, sans-serif"
                      fill="black"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Info Panel */}
      {/* <div className="info-panel">
        {selected.length === 1 && <p>Start: {selected[0]}</p>}
        {selected.length === 2 && <p>Route: {path.join(" → ")}</p>}
      </div> */}

      <div className="info-panel">
        {selected.length === 1 && (
          <p>
            Start:{" "}
            {data.stations.find((s) => s.id === selected[0])?.name || selected[0]}
          </p>
        )}

        {selected.length === 2 && (
          <p>
            Route:{" "}
            {path
              .map((id) => data.stations.find((s) => s.id === id)?.name || id)
              .join(" → ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
