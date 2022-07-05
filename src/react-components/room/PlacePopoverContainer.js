import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as PenIcon } from "../icons/Pen.svg";
import { ReactComponent as CameraIcon } from "../icons/Camera.svg";
// import { ReactComponent as TextIcon } from "../icons/Text.svg";
// import { ReactComponent as LinkIcon } from "../icons/Link.svg";
import { ReactComponent as GIFIcon } from "../icons/GIF.svg";
import { ReactComponent as ObjectIcon } from "../icons/Object.svg";
import { ReactComponent as AvatarIcon } from "../icons/Avatar.svg";
import { ReactComponent as SceneIcon } from "../icons/Scene.svg";
import { ReactComponent as UploadIcon } from "../icons/Upload.svg";
import { PlacePopoverButton } from "./PlacePopover";
import { ObjectUrlModalContainer } from "./ObjectUrlModalContainer";
import configs from "../../utils/configs";
import { FormattedMessage } from "react-intl";
import penImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/画笔@2x.png";
import cameraImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/自拍像@2x.png";
import avatarImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/Avatar@2x.png";
import sceneImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/场景@2x.png";
import uploadImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/上传@2x.png";
import {ReactComponent as VideoIcon} from "../icons/Video.svg";
import videoImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/自拍像@2x.png";
import {MediaDevices} from "../../utils/media-devices-utils";
import {ReactComponent as DesktopIcon} from "../icons/Desktop.svg";
import desktopImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/自拍像@2x.png";
import { useShare } from "./SharePopoverContainer";

export function PlacePopoverContainer({ scene, mediaSearchStore, showNonHistoriedDialog, hubChannel }) {
  const [items, setItems] = useState([]);

  const {
    sharingSource,
    canShareCamera,
    toggleShareCamera,
    canShareScreen,
    toggleShareScreen,
    canShareCameraToAvatar,
    toggleShareCameraToAvatar
  } = useShare(scene, hubChannel);

  useEffect(
    () => {
      function updateItems() {
        const hasActiveCamera = !!scene.systems["camera-tools"].getMyCamera();
        const hasActivePen = !!scene.systems["pen-tools"].getMyPen();

        let nextItems = [
          hubChannel.can("spawn_drawing") && {
            id: "pen",
            icon: PenIcon,
            imageIcon: penImageIcon,
            // color: "accent5",
            label: <FormattedMessage id="place-popover.item-type.pen" defaultMessage="Pen" />,
            onSelect: () => scene.emit("penButtonPressed"),
            selected: hasActivePen
          },
          hubChannel.can("spawn_camera") && {
            id: "camera",
            icon: CameraIcon,
            imageIcon: cameraImageIcon,
            // color: "accent5",
            label: <FormattedMessage id="place-popover.item-type.camera" defaultMessage="Camera" />,
            onSelect: () => scene.emit("action_toggle_camera"),
            selected: hasActiveCamera
          }
        ];

        if (hubChannel.can("spawn_and_move_media")) {
          nextItems = [
            ...nextItems,
            // TODO: Create text/link dialog
            // { id: "text", icon: TextIcon, color: "blue", label: "Text" },
            // { id: "link", icon: LinkIcon, color: "blue", label: "Link" },
            // configs.integration("tenor") && {
            //   id: "gif",
            //   icon: GIFIcon,
            //   color: "accent2",
            //   label: <FormattedMessage id="place-popover.item-type.gif" defaultMessage="GIF" />,
            //   onSelect: () => mediaSearchStore.sourceNavigate("gifs")
            // },
            // configs.integration("sketchfab") && {
            //   id: "model",
            //   icon: ObjectIcon,
            //   color: "accent2",
            //   label: <FormattedMessage id="place-popover.item-type.model" defaultMessage="3D Model" />,
            //   onSelect: () => mediaSearchStore.sourceNavigate("sketchfab")
            // },
            {
              id: "avatar",
              icon: AvatarIcon,
              imageIcon: avatarImageIcon,
              // color: "accent1",
              label: <FormattedMessage id="place-popover.item-type.avatar" defaultMessage="Avatar" />,
              onSelect: () => mediaSearchStore.sourceNavigate("avatars")
            },
            {
              id: "scene",
              icon: SceneIcon,
              imageIcon: sceneImageIcon,
              // color: "accent1",
              label: <FormattedMessage id="place-popover.item-type.scene" defaultMessage="Scene" />,
              onSelect: () => mediaSearchStore.sourceNavigate("scenes")
            },
            // TODO: Launch system file prompt directly
            {
              id: "upload",
              icon: UploadIcon,
              imageIcon: uploadImageIcon,
              // color: "accent3",
              label: <FormattedMessage id="place-popover.item-type.upload" defaultMessage="Upload" />,
              onSelect: () => showNonHistoriedDialog(ObjectUrlModalContainer, { scene })
            }
          ];
        }

        // new 移过来的
        nextItems = [
          ...nextItems,
          {
            id: "camera",
            icon: VideoIcon,
            imageIcon: videoImageIcon,
            // color: "accent5",
            label: <FormattedMessage id="share-popover.source.camera" defaultMessage="Camera" />,
            onSelect: toggleShareCamera,
            active: sharingSource === MediaDevices.CAMERA
          }
        ];
        nextItems = [
          ...nextItems,
          {
            id: "screen",
            icon: DesktopIcon,
            imageIcon: desktopImageIcon,
            // color: "accent5",
            label: <FormattedMessage id="share-popover.source.screen" defaultMessage="Screen" />,
            onSelect: toggleShareScreen,
            active: sharingSource === MediaDevices.SCREEN
          }
        ];

        setItems(nextItems);
      }

      hubChannel.addEventListener("permissions_updated", updateItems);

      updateItems();

      function onSceneStateChange(event) {
        if (event.detail === "camera" || event.detail === "pen") {
          updateItems();
        }
      }

      scene.addEventListener("stateadded", onSceneStateChange);
      scene.addEventListener("stateremoved", onSceneStateChange);

      return () => {
        hubChannel.removeEventListener("permissions_updated", updateItems);
        scene.removeEventListener("stateadded", onSceneStateChange);
        scene.removeEventListener("stateremoved", onSceneStateChange);
      };
    },
    [hubChannel, mediaSearchStore, showNonHistoriedDialog, scene]
  );

  return <PlacePopoverButton items={items} />;
}

PlacePopoverContainer.propTypes = {
  hubChannel: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
