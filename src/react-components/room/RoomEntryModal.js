import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as EnterIcon } from "../icons/Enter.svg";
import { ReactComponent as VRIcon } from "../icons/VR.svg";
import { ReactComponent as ShowIcon } from "../icons/Show.svg";
import { ReactComponent as SettingsIcon } from "../icons/Settings.svg";
import styles from "./RoomEntryModal.scss";
import styleUtils from "../styles/style-utils.scss";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { Column } from "../layout/Column";
import { AppLogo } from "../misc/AppLogo";
import { FormattedMessage } from "react-intl";
// import modalBgUrl from "../../assets/images/yuanjing/enter/modal-bg@2x.png";

export function RoomEntryModal({
  className,
  roomName,
  showJoinRoom,
  onJoinRoom,
  showEnterOnDevice,
  onEnterOnDevice,
  showSpectate,
  onSpectate,
  showOptions,
  onOptions,
  ...rest
}) {
  const breakpoint = useCssBreakpoints();
  return (
    <Modal
      className={classNames(styles.roomEntryModal, className)}
      disableFullscreen
      {...rest}
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        backgroundSize: "cover",
        borderWidth: 0
      }}
    >
      <Column center className={styles.content}>
        {breakpoint !== "sm" &&
          breakpoint !== "md" && (
            <div className={styles.logoContainer}>
              <AppLogo style={{ width: 200 }} />
            </div>
          )}
        <div className={styles.roomName}>
          <h5 style={{ color: "#f9f9f9", fontSize: 16 }}>
            <FormattedMessage id="room-entry-modal.room-name-label" defaultMessage="Room Name" />
          </h5>
          <p style={{ color: "#f9f9f9", fontSize: 20, marginTop: 6 }}>{roomName}</p>
        </div>
        <Column center className={styles.buttons}>
          {showJoinRoom && (
            // preset="accent4"
            <Button onClick={onJoinRoom}>
              {/*<EnterIcon />*/}
              <span>
                <FormattedMessage id="room-entry-modal.join-room-button" defaultMessage="Join Room" />
              </span>
            </Button>
          )}
          {showEnterOnDevice && (
            // preset="accent5"
            <Button onClick={onEnterOnDevice}>
              {/*<VRIcon />*/}
              <span>
                <FormattedMessage id="room-entry-modal.enter-on-device-button" defaultMessage="Enter On Device" />
              </span>
            </Button>
          )}
          {/*{showSpectate && (*/}
          {/*  <Button preset="accent2" onClick={onSpectate}>*/}
          {/*    <ShowIcon />*/}
          {/*    <span>*/}
          {/*      <FormattedMessage id="room-entry-modal.spectate-button" defaultMessage="Spectate" />*/}
          {/*    </span>*/}
          {/*  </Button>*/}
          {/*)}*/}
          {/*{showOptions &&*/}
          {/*  breakpoint !== "sm" && (*/}
          {/*    <>*/}
          {/*      <hr className={styleUtils.showLg} />*/}
          {/*      <Button preset="transparent" className={styleUtils.showLg} onClick={onOptions}>*/}
          {/*        <SettingsIcon />*/}
          {/*        <span>*/}
          {/*          <FormattedMessage id="room-entry-modal.options-button" defaultMessage="Options" />*/}
          {/*        </span>*/}
          {/*      </Button>*/}
          {/*    </>*/}
          {/*  )}*/}
          <div style={{ height: 12 }} />
        </Column>
      </Column>
    </Modal>
  );
}

RoomEntryModal.propTypes = {
  className: PropTypes.string,
  roomName: PropTypes.string.isRequired,
  showJoinRoom: PropTypes.bool,
  onJoinRoom: PropTypes.func,
  showEnterOnDevice: PropTypes.bool,
  onEnterOnDevice: PropTypes.func,
  showSpectate: PropTypes.bool,
  onSpectate: PropTypes.func,
  showOptions: PropTypes.bool,
  onOptions: PropTypes.func
};

RoomEntryModal.defaultProps = {
  showJoinRoom: true,
  showEnterOnDevice: true,
  showSpectate: true,
  showOptions: true
};
