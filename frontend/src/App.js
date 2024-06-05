import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SweetAlertModal from "./components/SweetAlertModal";
function App() {
  const [gdp, setGdp] = useState(0);
  const [province, setProvince] = useState("");
  const [gdpList, setGdpList] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [popupContent, setPopupContent] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (status, title, message, icon) => {
    setPopupContent({ status, title, message, icon });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const getGdps = async () => {
    try {
      const response = await Axios.get("http://localhost:8080/api/gdp");
      setGdpList(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getGdps();
  }, [setGdpList]);

  const addGdp = async () => {
    if (!province || gdp === 0) {
      openModal(
        "error",
        "Error!",
        "Please enter both province and a valid GDP value.",
        "error"
      );
      return;
    }

    try {
      const response = await Axios.post("http://localhost:8080/api/gdp", {
        Province_ENG: province,
        GDP2020: gdp,
      });
      setGdpList([...gdpList, response.data]);
      setProvince("");
      setGdp(0);
      openModal("success", "Success!", "GDP added successfully.", "success");
    } catch (error) {
      console.error(error);
      openModal(
        "error",
        "Error!",
        "Failed to add GDP or Province already exists.",
        "error"
      );
    }
  };

  const deleteGDP = async (province) => {
    try {
      const response = await Axios.delete(
        `http://localhost:8080/api/gdp/${province}`
      );
      if (response.status === 200) {
        getGdps();
        openModal(
          "success",
          "Success!",
          "GDP deleted successfully.",
          "success"
        );
      } else {
        openModal("error", "Error!", "Failed to delete GDP.", "error");
      }
    } catch (error) {
      openModal("error", "Error!", "Failed to delete GDP.", "error");
    }
  };

  return (
    <div className="App container">
      <h1 style={{ textAlign: "center" }}>Thailand GDP Information</h1>
      <div className="information">
        <form action="">
          <div className="mb-3">
            <label className="form-label" htmlFor="province">
              Province:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="gdp">
              GDP:
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter GDP"
              value={gdp}
              onChange={(e) => setGdp(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-success" onClick={addGdp}>
            Add New GDP
          </button>
        </form>
      </div>
      <hr />
      <div className="GDP">
        <div className="gdp-container">
          {gdpList.map((val, index) => (
            <div className="card" key={index}>
              <div className="card-body">
                <div className="card-info">
                  <h6 className="card-title">
                    <strong>Province:</strong> {val.Province_ENG}
                  </h6>
                  <p className="card-text">
                    {" "}
                    <strong>GDP: </strong> {val.GDP2020}
                  </p>
                </div>
                <div className="card-bottom">
                  <button
                    className="icon-container"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => deleteGDP(val.Province_ENG)}
                  >
                    {hoveredItem === index ? (
                      <DeleteForeverOutlinedIcon />
                    ) : (
                      <DeleteOutlinedIcon />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SweetAlertModal
        isOpen={isOpen}
        onClose={closeModal}
        title={popupContent.title}
        message={popupContent.message}
        icon={popupContent.icon}
      />
    </div>
  );
}

export default App;
