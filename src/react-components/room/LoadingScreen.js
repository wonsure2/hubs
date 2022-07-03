import React from "react";
import PropTypes from "prop-types";
import { LoadingScreenLayout } from "../layout/LoadingScreenLayout";
import { Spinner } from "../misc/Spinner";
import { useRandomMessageTransition } from "./useRandomMessageTransition";
export function LoadingScreen({ message, infoMessages }) {
  const infoMessage = useRandomMessageTransition(infoMessages);
  return (
    <LoadingScreenLayout
      center={
        <>
          <Spinner />
          <p style={{ color: "#f9f9f9" }}>{message}</p>
        </>
      }
      bottom={
        <>
          <h3 style={{ color: "#f9f9f9" }}>{infoMessage.heading}</h3>
          <p style={{ color: "#f9f9f9" }}>{infoMessage.message}</p>
        </>
      }
    />
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.node,
  infoMessages: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired
    })
  )
};

LoadingScreen.defaultProps = {
  infoMessages: []
};
