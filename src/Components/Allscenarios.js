import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { buttonStyles, btn1, btn2, btn3, btnhover1, btnhover2, btnhover3 } from "./ButtonStyles";
import "./Allscenarios.css";
const AllScenarios = () => {
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedScenario, setEditedScenario] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isScenarioNameValid, setIsScenarioNameValid] = useState(true);
  const [isScenarioTimeValid, setIsScenarioTimeValid] = useState(true);
  useEffect(() => {
    // Fetch data from the server
    fetch("/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEdit = (itemId) => {
    setEditingItemId(itemId);
    // Find the scenario being edited and store its data in editedScenario state
    const scenarioToEdit = items.find((item) => item._id === itemId);
    setEditedScenario(scenarioToEdit);
  };

  const handleDelete = (itemId) => {
    // Make the API call to delete the scenario with the given ID
    fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((deletedScenario) => {
        // Update the state by removing the deleted scenario from the items list
        const updatedItems = items.filter(
          (item) => item._id !== deletedScenario._id
        );
        setItems(updatedItems);
      })
      .catch((error) => {
        console.error("Error deleting scenario:", error);
        // Handle error if needed
      });
  };
  const handleScenarioNameChange = (e) => {
    const newName = e.target.value;
    // Perform validation
    setIsScenarioNameValid(newName !== "");
    setEditedScenario({
      ...editedScenario,
      scenarioName: newName,
    });
  };

  const handleScenarioTimeChange = (e) => {
    const newTime = e.target.value;
    // Perform validation
    setIsScenarioTimeValid(newTime !== "" && !isNaN(newTime));
    setEditedScenario({
      ...editedScenario,
      scenarioTime: newTime,
    });
  };

  const handleSave = () => {
    // Make the API call to update the scenario with the edited data
    if (!isScenarioNameValid || !isScenarioTimeValid) {
      alert("Please fill in all required fields with valid values.");
      return; // Prevent saving if validation fails
    }
    fetch(`/api/items/${editingItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedScenario),
    })
      .then((response) => response.json())
      .then((updatedScenario) => {
        // Update the state with the updated scenario from the server response
        const updatedItems = items.map((item) =>
          item._id === updatedScenario._id ? updatedScenario : item
        );
        setItems(updatedItems);
        // Reset the editedScenario state
        setEditedScenario({});
        setEditingItemId(null);
      })
      .catch((error) => {
        console.error("Error updating scenario:", error);
        // Handle error if needed
      });
  };
  const handleDeleteAllScenarios = () => {
    // Make the API call to delete all scenarios from the database
    fetch("/api/items", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Clear the items array to reflect the deletion in the UI
        setItems([]);
        alert("All Scenario Successfully  Deleted ");
      })
      .catch((error) => {
        console.error("Error deleting all scenarios:", error);
        // Handle error if needed
      });
  };
 
  return (
    <div className="container_allscenario">
      <div className="heading_bar">
        <p>All Scenarios</p>
        <div className="btn_group">
          <NavLink
            to="/Addscenario"
            className="nav-link"
            activeClassName="active"
          >
            <button className="btn" style={{
                ...buttonStyles,
                ...btn1,
                ...(hoveredButton === 'btn1' ? btnhover1 : {}),
              }}
              onMouseEnter={() => setHoveredButton('btn1')}
              onMouseLeave={() => setHoveredButton(null)} >New Scenario</button>
          </NavLink>
          <NavLink
            to="/Addvehicle"
            className="nav-link"
            activeClassName="active"
          >
            <button className="btn" style={{
                ...buttonStyles,
                ...btn2,
                ...(hoveredButton === 'btn2' ? btnhover2 : {}),
              }}
              onMouseEnter={() => setHoveredButton('btn2')}
              onMouseLeave={() => setHoveredButton(null)} >Add Vehicle</button>
          </NavLink>
          <div style={{ padding: '10px 20px' }}>
          {/* <button className="btn" onClick={handleDeleteAllScenarios} style={buttonStyles} >
            Delete All
          </button> */}
          <button className="btn" style={{
                ...buttonStyles,
                ...btn3,
                ...(hoveredButton === 'btn3' ? btnhover3 : {}),
              }}
              onClick={handleDeleteAllScenarios}
              onMouseEnter={() => setHoveredButton('btn3')}
              onMouseLeave={() => setHoveredButton(null)} >Delete All</button>
          </div >
        </div>
      </div>
      
      {items.length === 0 ? (
        <p style={{color:'white'}}>No data available</p>
      ) : (
        <div className="table_container" >
          <table>
            <thead>
              <tr>
                <th>Scenario Id</th>
                <th>Scenario Name</th>
                <th>Scenario Time</th>
                <th>Number of Vehicles</th>
                <th>Add Vehicle</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {editingItemId === item._id ? (
                       <input
                       type="text"
                       value={editedScenario.scenarioName || ""}
                       onChange={handleScenarioNameChange}
                       className={isScenarioNameValid ? "" : "error"} // Apply error class if validation fails
                     />
                    ) : (
                      item.scenarioName
                    )}
                  </td>
                  <td>
                    {editingItemId === item._id ? (
                      <input
                      type="number"
                      value={editedScenario.scenarioTime || ""}
                      onChange={handleScenarioTimeChange}
                      className={isScenarioTimeValid ? "" : "error"} // Apply error class if validation fails
                    />
                    ) : (
                      item.scenarioTime
                    )}
                  </td>
                  <td>{item.vehicles.length}</td>
                  <td>
                    <NavLink
                      to="/Addvehicle"
                      className="nav-link"
                      activeClassName="active"
                    >
                      <button className="add-vehicle-btn">
                        <AiOutlinePlus style={{ color: "white" }}/>
                      </button>
                    </NavLink>
                  </td>

                  <td>
                    {editingItemId === item._id ? (
                      <button onClick={() => handleSave()}  style={{ background: "#212529", color: "white", padding:'5px' }}>Save</button>
                    ) : (
                      <AiOutlineEdit className="sign" onClick={() => handleEdit(item._id)} />
                    )}
                  </td>
                  <td>
                    <AiOutlineDelete className="sign" onClick={() => handleDelete(item._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      )}
    </div>
  );
};

export default AllScenarios;
