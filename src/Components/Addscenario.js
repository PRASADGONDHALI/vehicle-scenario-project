import React, { useState } from "react";
import "./Addscenario.css";

const Addscenario = () => {
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioTime, setScenarioTime] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "scenarioName") {
      setScenarioName(value);
    } else if (name === "scenarioTime") {
      setScenarioTime(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!scenarioName.trim()) {
      validationErrors.scenarioName = "Scenario Name is required";
    }
    if (!scenarioTime.trim()) {
      validationErrors.scenarioTime = "Scenario Time is required";
    } else if (isNaN(scenarioTime)) {
      validationErrors.scenarioTime = "Scenario Time must be a number";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const data = await fetch("/api/addscenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioName,scenarioTime
        }),
      });
      
      const res = await data.json();
      console.log(res);

      if(res.status === 201){
      alert("Form submitted successfully!");
      setErrors({});
      setScenarioName("");
      setScenarioTime("");
    }
    }
  };

  const handleFormReset = () => {
    setScenarioName("");
    setScenarioTime("");
    setErrors({});
  };

  const handleGoBack = () => {
    // Implement the logic to navigate back to the previous page or route
    console.log("Go back clicked!");
  };

  return (
    <div className="add-scenario-container">
      <div className="header-block">
        <h4>Scenario/add</h4>
      </div>
      <div className="content-block">
        <h1>Add Scenario</h1>
        <div className="form-card">
          <form>
            <div className="form_container">
              <div className="form-group">
                <label htmlFor="scenarioName">Scenario Name:</label>
                <input
                  type="text"
                  id="scenarioName"
                  name="scenarioName"
                  value={scenarioName}
                  onChange={handleInputChange}
                  placeholder="Test Scenario"
                  className={errors.scenarioName ? "input-error" : ""}
                />
                {errors.scenarioName && (
                  <div className="error-text">{errors.scenarioName}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="scenarioTime">Scenario Time (seconds):</label>
                <input
                  type="text"
                  id="scenarioTime"
                  name="scenarioTime"
                  value={scenarioTime}
                  onChange={handleInputChange}
                  placeholder="10"
                  className={errors.scenarioTime ? "input-error" : ""}
                />
                {errors.scenarioTime && (
                  <div className="error-text">{errors.scenarioTime}</div>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="button-group">
          <button type="button" onClick={handleFormSubmit}>
            Add
          </button>
          <button type="button" onClick={handleFormReset}>
            Reset
          </button>
          <button type="button" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addscenario;
