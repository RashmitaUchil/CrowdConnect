import axios from "axios";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const GlobalContext = createContext();

function GlobalStateRepository({ children }) {
  const [user, setUser] = useState(null);
  const [renderGSR, setRenderGSR] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to fetch user profile...");
      const response = await axios.get("/user/profile");
      console.log("Response received:", response);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [renderGSR]);

  if (isLoading) {
    return null;
  }

  return (
    <GlobalContext.Provider value={{ user, setRenderGSR, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
}

GlobalStateRepository.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalStateRepository;
