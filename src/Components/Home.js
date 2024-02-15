import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import "./Home.css";
import ScenarioSimulation from "./ScenarioSimulation";

function Home() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [isVehicleTableUpdated, setIsVehicleTableUpdated] = useState(false);
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const isValidVehicle = (vehicle) => {
    return (
      vehicle.vehicleName.trim() !== "" &&
      vehicle.speed >= 0 &&
      vehicle.positionX >= 0 &&
      vehicle.positionX <= 800 &&
      vehicle.positionY >= 0 &&
      vehicle.positionY <= 800 &&
      vehicle.direction !== ""
    );
  };

  const handleSaveClick = async (index) => {
    try {
      const updatedVehicle = selectedItemData.vehicles[index];

      if (!isValidVehicle(updatedVehicle)) {
        const clonedVehicles = [...selectedItemData.vehicles];
        clonedVehicles[index].validationError = true;
        setSelectedItemData({
          ...selectedItemData,
          vehicles: clonedVehicles,
        });
        alert("Invalid Details");
        return;
      }

      const response = await fetch(
        `/api/items/${selectedItemData._id}/vehicles/${updatedVehicle._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVehicle),
        }
      );

      if (response.ok) {
        const updatedVehicleData = await response.json();
        const clonedVehicles = [...selectedItemData.vehicles];
        clonedVehicles[index] = updatedVehicleData;
        clonedVehicles[index].editing = false;
        clonedVehicles[index].validationError = false;

        setSelectedItemData({
          ...selectedItemData,
          vehicles: clonedVehicles,
        });
      } else {
        console.error("Failed to update vehicle data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (index) => {
    const clonedVehicles = [...selectedItemData.vehicles];
    clonedVehicles[index].editing = true;
    setSelectedItemData({
      ...selectedItemData,
      vehicles: clonedVehicles,
    });
  };

  const handleDeleteClick = async (index) => {
    try {
      const vehicleToDelete = selectedItemData.vehicles[index];
      const response = await fetch(
        `/api/items/${selectedItemData._id}/vehicles/${vehicleToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const clonedVehicles = [...selectedItemData.vehicles];
        clonedVehicles.splice(index, 1);

        setSelectedItemData({
          ...selectedItemData,
          vehicles: clonedVehicles,
        });
      } else {
        console.error("Failed to delete vehicle data");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleVehicleDataUpdate = (updatedVehicles) => {
    // Update the vehicle data in the selectedItemData state
    console.log(updatedVehicles);
    setSelectedItemData((prevData) => ({
      ...prevData,
      vehicles: updatedVehicles,
    }));
    setIsVehicleTableUpdated(true); // Set the state to trigger vehicle table update
  };
  useEffect(() => {
    if (isVehicleTableUpdated) {
      setIsVehicleTableUpdated(false); // Reset the state after triggering the update
    }
  }, [isVehicleTableUpdated]);

  return (
    <div className="App">
      <div className="home">
      <h1>Scenario</h1>
      <select
        value={selectedItem}
        onChange={(event) => {
          setSelectedItem(event.target.value);
          const selectedItemData = items.find(
            (item) => item._id === event.target.value
          );
          setSelectedItemData(selectedItemData);
        }}
      >
        <option value="">Select an item</option>
        {items.map((item) => (
          <option key={item._id} value={item._id}>
            {item.scenarioName}
          </option>
        ))}
      </select>
      {selectedItemData ? (
        <div>
          {selectedItemData.vehicles.length > 0 ? (
            <div className="table_container">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle Id</th>
                    <th>Vehicle Name</th>
                    <th>Speed</th>
                    <th>Position X</th>
                    <th>Position Y</th>
                    <th>Direction</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItemData.vehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          className={`input-container ${
                            vehicle.validationError ? "error" : ""
                          }`}
                        >
                          {vehicle.editing ? (
                            <input
                              type="text"
                              value={vehicle.vehicleName}
                              onChange={(e) => {
                                const clonedVehicles = [
                                  ...selectedItemData.vehicles,
                                ];
                                clonedVehicles[index].vehicleName =
                                  e.target.value;
                                clonedVehicles[index].validationError = false;
                                setSelectedItemData({
                                  ...selectedItemData,
                                  vehicles: clonedVehicles,
                                });
                              }}
                            />
                          ) : (
                            vehicle.vehicleName
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`input-container ${
                            vehicle.validationError ? "error" : ""
                          }`}
                        >
                          {vehicle.editing ? (
                            <input
                              type="number"
                              value={vehicle.speed}
                              onChange={(e) => {
                                const clonedVehicles = [
                                  ...selectedItemData.vehicles,
                                ];
                                clonedVehicles[index].speed = e.target.value;
                                clonedVehicles[index].validationError = false;
                                setSelectedItemData({
                                  ...selectedItemData,
                                  vehicles: clonedVehicles,
                                });
                              }}
                            />
                          ) : (
                            vehicle.speed
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`input-container ${
                            vehicle.validationError ? "error" : ""
                          }`}
                        >
                          {vehicle.editing ? (
                            <input
                              type="number"
                              value={vehicle.positionX}
                              onChange={(e) => {
                                const clonedVehicles = [
                                  ...selectedItemData.vehicles,
                                ];
                                clonedVehicles[index].positionX =
                                  e.target.value;
                                clonedVehicles[index].validationError = false;
                                setSelectedItemData({
                                  ...selectedItemData,
                                  vehicles: clonedVehicles,
                                });
                              }}
                            />
                          ) : (
                            vehicle.positionX
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`input-container ${
                            vehicle.validationError ? "error" : ""
                          }`}
                        >
                          {vehicle.editing ? (
                            <input
                              type="number"
                              value={vehicle.positionY}
                              onChange={(e) => {
                                const clonedVehicles = [
                                  ...selectedItemData.vehicles,
                                ];
                                clonedVehicles[index].positionY =
                                  e.target.value;
                                clonedVehicles[index].validationError = false;
                                setSelectedItemData({
                                  ...selectedItemData,
                                  vehicles: clonedVehicles,
                                });
                              }}
                            />
                          ) : (
                            vehicle.positionY
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`input-container ${
                            vehicle.validationError ? "error" : ""
                          }`}
                        >
                          {vehicle.editing ? (
                            <select className="dropdown"
                              value={vehicle.direction}
                              onChange={(e) => {
                                const clonedVehicles = [
                                  ...selectedItemData.vehicles,
                                ];
                                clonedVehicles[index].direction =
                                  e.target.value;
                                clonedVehicles[index].validationError = false;
                                setSelectedItemData({
                                  ...selectedItemData,
                                  vehicles: clonedVehicles,
                                });
                              }}
                              style={{width:'150px',marginTop:'0',background:'white',color:'black',border:'1px solid #212529',padding: '11px',
                              borderRadius: '5px',
                              outline: 'none',
                              fontSize: '14px'}}
                            >
                              <option value="">Select direction</option>
                              <option value="Towards">Towards</option>
                              <option value="Backwards">Backwards</option>
                              <option value="Upwards">Upwards</option>
                              <option value="Downwards">Downwards</option>
                            </select>
                          ) : (
                            vehicle.direction
                          )}
                        </div>
                      </td>
                      <td>
                        {vehicle.editing ? (
                          
                                                <button onClick={() => handleSaveClick(index)}  style={{ background: "#212529", color: "white", padding:'5px' }}>Save</button>

                        ) : (
                          <AiOutlineEdit className="sign"
                            onClick={() => handleEditClick(index)}
                          />
                        )}
                      </td>
                      <td>
                        <AiOutlineDelete className="sign"
                          onClick={() => handleDeleteClick(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{color:'white'}}>No vehicle data available for this scenario.</p>
          )}
        </div>
      ) : (
        <p style={{ color: "white" }}>Select a scenario to view data.</p>
      )}</div>
      <div className="scenariosimulation">
      <ScenarioSimulation
        selectedScenarioData={selectedItemData}
        onVehicleDataUpdate={handleVehicleDataUpdate}
      /></div>
    </div>
  );
}

export default Home;
