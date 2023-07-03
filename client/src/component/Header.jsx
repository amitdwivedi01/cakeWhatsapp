import React, { useState } from "react";
import axios from "axios";
import logo from "../assests/logo2.png";

const Header = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setWhatsappNumber("");
    setIsExistingMember(false);
    setIsSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/saveWhatsappNumber", {
        whatsappNumber,
      });

      if (response.data.isExistingMember) {
        setIsExistingMember(true);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="header">
        <img src={logo} alt="logo" width={240} />
        <button onClick={handleButtonClick} className="main-button">
          Get Discount
        </button>
      </div>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Enter your WhatsApp number</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="WhatsApp number"
              />
              <button className="popup-submit" type="submit">Submit</button>
            </form>

            {isExistingMember && (
              <div className="popup-card">
                <p>You already hold our membership.</p>
              </div>
            )}

            {isSuccess && (
              <div className="popup-card">
                <p>Congratulations! You saved 10%.</p>
              </div>
            )}

            <button className="pop-up-close" onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
