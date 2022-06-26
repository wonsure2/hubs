import React from "react";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import PropTypes from "prop-types";
import { SignInButton } from "./SignInButton";

export function CreateRoomButton(props) {
  const breakpoint = useCssBreakpoints();

  return (
    <Button
      // thick={breakpoint === "sm" || breakpoint === "md"}
      // xl={breakpoint !== "sm" && breakpoint !== "md"}
      lg
      style={props.style ?? null}
      preset="landing"
      onClick={e => {
        e.preventDefault();
        createAndRedirectToNewHub(null, null, false);
      }}
    >
      <FormattedMessage id="create-room-button" defaultMessage="Create Room" />
    </Button>
  );
}

CreateRoomButton.propTypes = {
  style: PropTypes.object
};
