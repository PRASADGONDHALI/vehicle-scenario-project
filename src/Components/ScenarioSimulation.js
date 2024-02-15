import React, { useState, useEffect, useRef } from "react";
import { buttonStyles, btn1, btnhover1 } from "./ButtonStyles";
import './ScenarioSimulation.css'
function ScenarioSimulation({ selectedScenarioData, onVehicleDataUpdate  }) {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const vehiclesRef = useRef([]);
  const [hoveredButton, setHoveredButton] = useState(null); 
  useEffect(() => {
    if (!canvasRef.current) {
      return; 
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    drawVehicles(context); // Initial draw when the component mounts
  }, []);

  useEffect(() => {
    if (selectedScenarioData && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear the old vehicles
      vehiclesRef.current = [];

      // Update with new vehicle data
      vehiclesRef.current = selectedScenarioData.vehicles.map((vehicle) => ({
        ...vehicle,
        x: vehicle.positionX,
        y: vehicle.positionY,
        speed: vehicle.speed ,
        direction: vehicle.direction,
        width: 50,
        height: 50,
      }));

      // Draw the new vehicles
      drawVehicles(context);
    }
  }, [selectedScenarioData]);

  const wrapAround = (value, max) => {
    // Wrap value around to the opposite side within the range [0, max)
    return (value + max) % max;
  };

  const drawVehicles = (ctx) => {
    const canvas = canvasRef.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    ctx.fillStyle = "blue";
    vehiclesRef.current.forEach((vehicle,index) => {
      // Update vehicle positions based on direction and speed
      if (vehicle.direction === "Towards") {
        vehicle.x = wrapAround(
          vehicle.x + (vehicle.speed / 10) * selectedScenarioData.scenarioTime,
          canvas.width
        );
      } else if (vehicle.direction === "Backwards") {
        vehicle.x = wrapAround(
          vehicle.x - (vehicle.speed / 10) * selectedScenarioData.scenarioTime,
          canvas.width
        );
      } else if (vehicle.direction === "Upwards") {
        vehicle.y = wrapAround(
          vehicle.y - (vehicle.speed / 10) * selectedScenarioData.scenarioTime,
          canvas.height
        );
      } else if (vehicle.direction === "Downwards") {
        vehicle.y = wrapAround(
          vehicle.y + (vehicle.speed / 10) * selectedScenarioData.scenarioTime,
          canvas.height
        );
      }
      const colors = ["red", "green", "blue", "orange", "purple"];
      const vehicleColor = colors[index % colors.length];
      ctx.fillStyle = vehicleColor;
    ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText((index + 1).toString(), vehicle.x+15 , vehicle.y+30 );
      // Draw the vehicle
      // ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
    });

    if (isAnimating) {
      requestAnimationFrame(animate);
    }
  };

  const startAnimation = () => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);
    const scenarioTime = 2000;

    animate(scenarioTime);
  };
  const updateVehiclePositionsInDatabase = async (updatedVehicles) => {
    const vehiclesToUpdate = updatedVehicles.map((vehicle) => {
      const { width, height, ...updatedVehicle } = vehicle;
      return updatedVehicle;
    });
    console.log(vehiclesToUpdate);
      try {
      const response = await fetch("/api/updating", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicles),
      });
  
      if (response.ok) {
        console.log("Vehicle positions updated in the database.");
      } else {
        console.error("Failed to update vehicle positions in the database.");
      }
    } catch (error) {
      console.error("Error updating vehicle positions:", error);
    }
  };
  
  const animate = (scenarioTime) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const startTime = performance.now();

    const animationFrame = () => {
      const currentTime = performance.now() - startTime;
      const completion = Math.min(currentTime / scenarioTime, 1);

      context.clearRect(0, 0, canvas.width, canvas.height);
      drawVehicles(context); // Draw vehicles with updated positions

      if (completion < 1) {
        requestAnimationFrame(animationFrame);
      } else {
        setIsAnimating(false);
        drawVehicles(context); // Draw vehicles with final positions
        const updatedVehicles = vehiclesRef.current.map((vehicle) => ({
          ...vehicle,
          speed:vehicle.speed,
          positionX: Math.floor(vehicle.x),
          positionY:  Math.floor(vehicle.y),
        }));
        if (onVehicleDataUpdate) {
          onVehicleDataUpdate(updatedVehicles);

          updateVehiclePositionsInDatabase(updatedVehicles); 
          
        }
      }
    };

    requestAnimationFrame(animationFrame);
  };
  if (!selectedScenarioData) {
    return null; // Don't render anything if selectedScenarioData is not available
  }

  return (
    <div className="scenario_div">
      <div className="btn_container" >
        <button onClick={startAnimation} disabled={isAnimating} style={{
                ...buttonStyles,
                ...btn1,
                ...(hoveredButton === 'btn1' ? btnhover1 : {}),
              }}
              onMouseEnter={() => setHoveredButton('btn1')}
              onMouseLeave={() => setHoveredButton(null)} 
              >
          Start Simulation
        </button>
      </div>
      <div className="canvas">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          style={{ border: "1px solid black" }}
        />
      </div>
    </div>
  );
}

export default ScenarioSimulation;
