import React, { useEffect, useState } from "react";
import "./Addvehicle.css";

const AddVehicle = () => {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [speed, setSpeed] = useState("");
  const [positionX, setPositionX] = useState("");
  const [positionY, setPositionY] = useState("");
  const [direction, setDirection] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Fetch all scenarios from the backend API
    fetch("/api/scenarios")
      .then((response) => response.json())
      .then((data) => setScenarios(data))
      .catch((error) => console.error("Error fetching scenarios:", error));
  }, []);

  const handleScenarioChange = (event) => {
    setSelectedScenario(event.target.value);
    // Handle the scenario selection here and perform any desired action
    console.log("Selected scenario:", event.target.value);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!selectedScenario) {
      isValid = false;
      errors.scenario = "Please select a scenario.";
    }

    if (!vehicleName) {
      isValid = false;
      errors.vehicleName = "Vehicle Name is required.";
    }

    if (isNaN(Number(speed)) || Number(speed) <= 0) {
      isValid = false;
      errors.speed = "Speed must be a number greater than 0";
    } else {
      delete errors.speed; // Remove the error if the input is valid
    }

    if (
      isNaN(Number(positionX)) ||
      Number(positionX) < 0 ||
      Number(positionX) > 800
    ) {
      isValid = false;
      errors.positionX = "Position X must be a number between 0 and 800.";
    } else {
      delete errors.positionX; // Remove the error if the input is valid
    }

    if (
      isNaN(Number(positionY)) ||
      Number(positionY) < 0 ||
      Number(positionY) > 800
    ) {
      isValid = false;
      errors.positionY = "Position Y must be a number between 0 and 800.";
    } else {
      delete errors.positionY; // Remove the error if the input is valid
    }

    if (!direction) {
      isValid = false;
      errors.direction = "Please select a direction.";
    } else {
      delete errors.direction; // Remove the error if the input is valid
    }

    setValidationErrors(errors); // Update the state with the validation errors
    return isValid;
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    // Perform form validation
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Prepare the data to be sent to the backend
    const data = {
      scenarioName: selectedScenario,
      vehicles: [
        {
          vehicleName,
          speed,
          positionX,
          positionY,
          direction,
        },
      ],
    };

    try {
      // Make an API call to add the vehicle data to the backend
      const response = await fetch("/api/addVehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle the response from the backend if needed
      if (response.ok) {
        alert("Vehicle data added to the database.");
        // Clear input fields after adding the vehicle details
        setVehicleName("");
        setSpeed("");
        setPositionX("");
        setPositionY("");
        setDirection("");
        setSelectedScenario("");
        setValidationErrors({});
      } else {
        console.error("Failed to add vehicle data to the database.");
      }
    } catch (error) {
      console.error("Error while making the API call:", error);
    }
  };

  const handleReset = () => {
    // Clear all input fields and selected scenario
    setVehicleName("");
    setSpeed("");
    setPositionX("");
    setPositionY("");
    setDirection("");
    setSelectedScenario("");
    setValidationErrors({});
  };

  const handleGoBack = () => {
    console.log("Go back button clicked.");
  };

  return (
    <div className="container">
      <div className="heading">
        <h1>Vehicle/ add</h1>
      </div>
      <div className="card">
        <h1>Add Vehicle</h1>
        <form>
          <div className="form">
            <label>
              Select Scenario:
              <select
                value={selectedScenario}
                onChange={handleScenarioChange}
                style={{
                  color: "#999999",
                }}
              >
                <option value="">Select a Scenario</option>
                {scenarios.map((scenario) => (
                  <option key={scenario._id} value={scenario.scenarioName}>
                    {scenario.scenarioName}
                  </option>
                ))}
              </select>
              {validationErrors.scenario && (
                <span style={{ color: "red" }}>
                  {validationErrors.scenario}
                </span>
              )}
            </label>
            <br />
            {/* Vehicle Name */}
            <label>
              Vehicle Name:
              <input
                type="text"
                value={vehicleName}
                placeholder="Vehicle Name"
                onChange={(e) => setVehicleName(e.target.value)}
              />
              {validationErrors.vehicleName && (
                <span style={{ color: "red" }}>
                  {validationErrors.vehicleName}
                </span>
              )}
            </label>
            <br />
            {/* Speed */}
            <label>
              Speed:
              <input
                type="text"
                value={speed}
                placeholder="Speed"
                onChange={(e) => setSpeed(e.target.value)}
              />
              {validationErrors.speed && (
                <span style={{ color: "red" }}>{validationErrors.speed}</span>
              )}
            </label>
            <br />
            {/* Position X */}
            <label>
              Position X:
              <input
                type="text"
                value={positionX}
                placeholder="Position X"
                onChange={(e) => setPositionX(e.target.value)}
              />
              {validationErrors.positionX && (
                <span style={{ color: "red" }}>
                  {validationErrors.positionX}
                </span>
              )}
            </label>
            <br />
            {/* Position Y */}
            <label>
              Position Y:
              <input
                type="text"
                value={positionY}
                placeholder="Position Y"
                onChange={(e) => setPositionY(e.target.value)}
              />
              {validationErrors.positionY && (
                <span style={{ color: "red" }}>
                  {validationErrors.positionY}
                </span>
              )}
            </label>
            <br />
            {/* Direction */}
            <label>
              Direction:
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                style={{
                  color: "#999999",
                }}
              >
                <option value="">Select a Direction</option>
                <option value="Towards">Towards</option>
                <option value="Backwards">Backwards</option>
                <option value="Upwards">Upwards</option>
                <option value="Downwards">Downwards</option>
              </select>
              {validationErrors.direction && (
                <span style={{ color: "red" }}>
                  {validationErrors.direction}
                </span>
              )}
            </label>
            <br />
          </div>
        </form>
      </div>
      <div className="button_group">
        {/* Add button */}
        <button type="submit" onClick={handleAdd}>
          Add
        </button>
        {/* Reset button */}
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        {/* Go Back button */}
        <button type="button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AddVehicle;
