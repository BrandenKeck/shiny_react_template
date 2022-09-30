// Example Libraries
import React, { useState, useEffect } from 'react'; // Necessities
import { Alert, Button, UncontrolledTooltip } from 'reactstrap'; // Nice for UI building
import { Routes, Route, Link } from 'react-router-dom'; // Nice for URL routing
import { motion } from 'framer-motion'; // Nice for animation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Nice for icons
import { faTowerCell, faRoute, faStar, faHome } from '@fortawesome/free-solid-svg-icons'; // Nice for icons


// Dynamic Shiny import in case we decide to run frontend-only for testing
// This is not necessary, but combined with the "npm run frontend" script
// adds significant frontend development power (no need to recompile)
let Shiny;
try {
  Shiny = require('shiny');
} catch (e) {
  Shiny = null;
}

/*
DELETE FROM HERE UNTIL App() TO CLEAR TEMPLATE
*/

// Example component for a routed page
const RouteExample = () => {
  return(
    <div className="container text-center mt-4">
      <div className="row">
        <p className="fs-1 fw-bold">Successfully Routed!</p>
        <Link to="/">
          <Button className="me-2" color="primary" outline>
            <FontAwesomeIcon icon={faHome} />
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Example component for animations
const AnimationExample = ({rotate}) => {
  return(
    <motion.div
    animate={{ rotate: rotate ? 360 : 0}}
    >
      <img width="120px" height="120px"
        src="https://cdn.sanity.io/images/0vv8moc6/contagion/b440925da74a3f1eee32054687bdb61c125df761-400x400.jpg/WGSngGpP.jpg?fit=crop&auto=format" />
    </motion.div>
  )
}

// Example "Home" component - contains main content
const Home = () => {

  // Hooks / Functions for Alert Message
  const [visible, setVisible] = useState(false);
  const dismissAlert = () => setVisible(false);

  // Hooks / Functions for Animation Example
  const [rotate, setRotate] = useState(false);

  // Communication with the server
  // Catch frontend-only mode with conditional on the Shiny library
  const checkComms = () => {
    Shiny && Shiny.setInputValue("checkComms", {data: "Comms check."});
  }
  useEffect(() => {
    Shiny && Shiny.addCustomMessageHandler('returnComms', (data) => {
      console.log(data.data);
      setVisible(true);
    });
  }, []);

  // Return the main app page
  return(
    <>

    {/* Example of reactstrap integration */}
    <Alert color="success" isOpen={visible} toggle={dismissAlert}>
      Communication Successful.
    </Alert>

    <div className="container text-center mt-4">
        <div className="row d-flex justify-content-center">
          <p className="fs-1 fw-bold">Shiny/React Template Application</p>
          <p className="text-muted font-monospace">
            Use the following buttons to check out some functionality.
            (Comms don't work in frontend mode)
          </p>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col">
            <div className="me-4">
              <Button id="commBtn" className="ms-2" color="primary" outline onClick={checkComms}>
                <FontAwesomeIcon icon={faTowerCell} />
              </Button>
              <Link to="/urlroute">
                <Button id="routeBtn" className="ms-2" color="primary" outline>
                  <FontAwesomeIcon icon={faRoute} />
                </Button>
              </Link>
              <Button id="aniBtn" className="ms-2" color="primary" outline onClick={() => {setRotate(!rotate)}}>
                <FontAwesomeIcon icon={faStar} />
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row d-flex justify-content-center mt-4">
          <div className="col">
            <AnimationExample rotate={rotate} />
          </div>
        </div>
    </div>

    <UncontrolledTooltip placement="top" target="commBtn">Test RShiny Comms</UncontrolledTooltip>
    <UncontrolledTooltip placement="top" target="routeBtn">Test React Router</UncontrolledTooltip>
    <UncontrolledTooltip placement="top" target="aniBtn">Test Animation</UncontrolledTooltip>

    </>
  )
}

// Example nested application (Home and RouteExample)
const App = () => {

  // Return App Component
  return (
    <>

      {/* Example of react-router-dom integration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urlroute" element={<RouteExample />} />
      </Routes>

    </>
  );
}
export default App;
