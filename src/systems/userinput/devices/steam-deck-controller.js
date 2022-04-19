import { paths } from "../paths";

export class SteamDeckControllerDevice {
  constructor(gamepad) {
    this.gamepad = gamepad;
    this.gamepadIndex = gamepad.index;
    this.buttonMap = [
      { name: "a", buttonId: 0 },
      { name: "b", buttonId: 1 },
      { name: "x", buttonId: 2 },
      { name: "y", buttonId: 3 },
      { name: "leftBumper", buttonId: 4 },
      { name: "rightBumper", buttonId: 5 },
      { name: "view", buttonId: 6 },
      { name: "options", buttonId: 7 },
      // buttonId 8 is unused
      { name: "leftJoystick", buttonId: 9 },
      { name: "rightJoystick", buttonId: 10 }
    ];
    this.axisMap = [
      { name: "leftJoystickHorizontal", axisId: 0 },
      { name: "leftJoystickVertical", axisId: 1 },
      { name: "leftTrigger", axisId: 2 },
      { name: "rightJoystickHorizontal", axisId: 3 },
      { name: "rightJoystickVertical", axisId: 4 },
      { name: "rightTrigger", axisId: 5 },
      { name: "dpadHorizontal", axisId: 6 },
      { name: "dpadVertical", axisId: 7 }
    ];
  }

  write(frame) {
    this.gamepad = navigator.getGamepads()[this.gamepadIndex];

    if (this.gamepad && this.gamepad.connected) {
      const devicePaths = paths.device.deck;
      this.buttonMap.forEach(b => {
        const path = devicePaths.button(b.name);
        const button = this.gamepad.buttons[b.buttonId];
        frame.setValueType(path.pressed, !!button.pressed);
        frame.setValueType(path.touched, !!button.touched);
        frame.setValueType(path.value, button.value);
      });
      frame.setValueType(devicePaths.axesSum, 0);
      this.axisMap.forEach(axis => {
        frame.setValueType(devicePaths.axis(axis.name), this.gamepad.axes[axis.axisId]);
        frame.setValueType(
          devicePaths.axesSum,
          frame.get(devicePaths.axesSum) + Math.abs(this.gamepad.axes[axis.axisId])
        );
      });

      if (this.gamepad.hapticActuators && this.gamepad.hapticActuators[0]) {
        frame.setValueType(paths.haptics.actuators[this.gamepad.hand], this.gamepad.hapticActuators[0]);
      }
    }
  }
}
