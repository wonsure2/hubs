import React from "react";
import PropTypes from "prop-types";
import { ButtonGridPopover } from "../popover/ButtonGridPopover";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as ShareIcon } from "../icons/Share.svg";
import { defineMessage, useIntl } from "react-intl";
import shareImageIcon from "../../assets/images/yuanjing/button_icons/tool/init/Avatar@2x.png";

const sharePopoverTitle = defineMessage({
  id: "share-popover.title",
  defaultMessage: "Share"
});

export function SharePopoverButton({ items }) {
  const intl = useIntl();
  const title = intl.formatMessage(sharePopoverTitle);

  const filteredItems = items.filter(item => !!item);

  // The button is removed if you can't share anything.
  if (filteredItems.length === 0) {
    return null;
  }

  const activeItem = filteredItems.find(item => item.active);

  // If there's one item to share (your smartphone camera), or an item is active (recording), then only show that button.
  if (filteredItems.length === 1 || activeItem) {
    const item = filteredItems[0];
    const Icon = item.icon;
    return (
      <ToolbarButton
        imageIcon={shareImageIcon}
        icon={<Icon />}
        onClick={() => {
          if (item.onSelect) {
            item.onSelect(item);
          }
        }}
        label={title}
        // preset="accent4"
        statusColor={activeItem && "recording"}
      />
    );
  }

  return (
    <Popover
      title={title}
      content={props => <ButtonGridPopover items={filteredItems} {...props} />}
      placement="top"
      offsetDistance={28}
      disableFullscreen
    >
      {({ togglePopover, popoverVisible, triggerRef }) => (
        <ToolbarButton
          imageIcon={shareImageIcon}
          ref={triggerRef}
          icon={<ShareIcon />}
          selected={popoverVisible}
          onClick={togglePopover}
          label={title}
          // preset="accent4"
        />
      )}
    </Popover>
  );
}

SharePopoverButton.propTypes = {
  items: PropTypes.array.isRequired
};
