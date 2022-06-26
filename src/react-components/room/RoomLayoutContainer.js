import React, { useRef } from "react";
import PropTypes from "prop-types";
import { RoomLayout } from "../layout/RoomLayout";
import { useResizeViewport } from "./useResizeViewport";

export function RoomLayoutContainer({ store, scene, ...rest }) {
  const viewportRef = useRef();

  useResizeViewport(viewportRef, store, scene);

  // 注释上面全部代码，并将 viewportRef 属性传入 null 来提高开发性能。
  return <RoomLayout viewportRef={viewportRef} {...rest} />;
}

RoomLayoutContainer.propTypes = {
  store: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired
};
