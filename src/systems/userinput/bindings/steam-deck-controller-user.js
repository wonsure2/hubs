import { paths } from "../paths";
import { sets } from "../sets";
import { xforms } from "./xforms";
import { addSetsToBindings } from "./utils";

const button = paths.device.deck.button;
const axis = paths.device.deck.axis;
const scaledRightJoystickVertical = paths.device.deck.v("scaledRightJoystickVertical");
const scaledLeftJoystickCursorDelta = paths.device.deck.v("scaledLeftJoystickCursorDelta");
const scaledRightJoystickHorizontal = paths.device.deck.v("scaledRightJoystickHorizontal");
const deadzonedRightJoystickHorizontal = paths.device.deck.v("deadzonedRightJoystickHorizontal");
const deadzonedRightJoystickVertical = paths.device.deck.v("deadzonedRightJoystickVertical");
const deadzonedLeftJoystickHorizontal = paths.device.deck.v("deadzonedLeftJoystickHorizontal");
const deadzonedLeftJoystickVertical = paths.device.deck.v("deadzonedLeftJoystickVertical");
const rightTriggerPressed = paths.device.deck.v("rightTriggerPressed");
const dpadUpPressed = paths.device.deck.v("dpadUpPressed");
const vec2Zero = paths.device.deck.v("vec2Zero");
const zero = paths.device.deck.v("zero");

function characterAccelerationBindings(disableForwardOnTrigger) {
  const scaledLeftJoystickHorizontal = paths.device.deck.v("scaledLeftJoystickHorizontal");
  const scaledLeftJoystickVertical = paths.device.deck.v("scaledLeftJoystickVertical");
  const scaledLeftJoystickForwardAcceleration = paths.device.deck.v("scaledLeftJoystickForwardAcceleration");
  return [
    {
      src: { value: deadzonedLeftJoystickHorizontal },
      dest: { value: scaledLeftJoystickHorizontal },
      xform: xforms.scale(1) // horizontal move speed modifier
    },
    {
      src: { value: deadzonedLeftJoystickVertical },
      dest: { value: scaledLeftJoystickVertical },
      xform: xforms.scale(-1) // vertical move speed modifier
    },
    {
      src: {
        bool: axis("leftTrigger"),
        value: scaledLeftJoystickVertical
      },
      dest: { value: scaledLeftJoystickForwardAcceleration },
      xform: disableForwardOnTrigger ? xforms.copyIfFalse : xforms.copy
    },
    {
      src: {
        x: scaledLeftJoystickHorizontal,
        y: scaledLeftJoystickForwardAcceleration
      },
      dest: { value: paths.actions.characterAcceleration },
      xform: xforms.compose_vec2
    }
  ];
}

export const steamDeckControllerUserBindings = addSetsToBindings({
  [sets.rightCursorHoldingPen]: [
    {
      src: { value: axis("rightTrigger") },
      dest: { value: rightTriggerPressed },
      xform: xforms.axisToBool(0.9),
      priority: 300
    },
    {
      src: { value: rightTriggerPressed },
      dest: { value: paths.actions.cursor.right.startDrawing },
      xform: xforms.rising,
      priority: 200
    },
    {
      src: { value: rightTriggerPressed },
      dest: { value: paths.actions.cursor.right.stopDrawing },
      xform: xforms.falling,
      priority: 200
    },
    {
      src: { value: button("b").pressed },
      dest: { value: paths.actions.cursor.right.drop },
      xform: xforms.rising
    },
    {
      src: { value: button("y").pressed },
      dest: { value: paths.actions.cursor.right.undoDrawing },
      xform: xforms.rising,
      priority: 200
    },
    {
      src: { value: button("a").pressed },
      dest: { value: paths.actions.cursor.right.penNextColor },
      xform: xforms.rising
    },
    {
      src: { value: button("x").pressed },
      dest: { value: paths.actions.cursor.right.penPrevColor },
      xform: xforms.rising
    }
  ],
  [sets.global]: [
    {
      src: {},
      dest: { value: paths.actions.cursor.right.hideLine },
      xform: xforms.always(true)
    },
    {
      src: { value: axis("rightJoystickHorizontal") },
      dest: { value: deadzonedRightJoystickHorizontal },
      xform: xforms.deadzone(0.1)
    },
    {
      src: { value: deadzonedRightJoystickHorizontal },
      dest: { value: scaledRightJoystickHorizontal },
      xform: xforms.scale(-0.1) // horizontal look speed modifier
    },
    {
      src: { value: axis("rightJoystickVertical") },
      dest: { value: deadzonedRightJoystickVertical },
      xform: xforms.deadzone(0.1)
    },
    {
      src: { value: deadzonedRightJoystickVertical },
      dest: { value: scaledRightJoystickVertical },
      xform: xforms.scale(-0.1) // vertical look speed modifier
    },
    {
      src: {},
      dest: { value: zero },
      xform: xforms.always(0)
    },
    {
      src: {
        x: scaledRightJoystickHorizontal,
        y: scaledRightJoystickVertical
      },
      dest: { value: paths.actions.cameraDelta },
      xform: xforms.compose_vec2
    },
    {
      src: { value: paths.actions.cameraDelta },
      dest: { value: paths.actions.lobbyCameraDelta },
      xform: xforms.copy
    },
    {
      src: { value: axis("leftJoystickHorizontal") },
      dest: { value: deadzonedLeftJoystickHorizontal },
      xform: xforms.deadzone(0.1)
    },
    {
      src: { value: axis("leftJoystickVertical") },
      dest: { value: deadzonedLeftJoystickVertical },
      xform: xforms.deadzone(0.1)
    },
    {
      src: { value: axis("leftTrigger") },
      dest: { value: paths.actions.boost },
      xform: xforms.copy
    },
    {
      src: { value: button("leftBumper").pressed },
      dest: { value: paths.actions.snapRotateLeft },
      xform: xforms.rising
    },
    {
      src: { value: button("rightBumper").pressed },
      dest: { value: paths.actions.snapRotateRight },
      xform: xforms.rising
    },
    {
      src: {},
      dest: { value: vec2Zero },
      xform: xforms.vec2Zero
    },
    {
      src: { value: vec2Zero },
      dest: { value: paths.actions.cursor.right.pose },
      xform: xforms.poseFromCameraProjection()
    },
    {
      src: { value: button("y").pressed },
      dest: { value: paths.actions.spawnPen },
      xform: xforms.rising,
      priority: 100
    },
    {
      src: { value: axis("dpadVertical") },
      dest: { value: dpadUpPressed },
      xform: xforms.axisToBool(-0.9)
    },
    {
      src: { value: dpadUpPressed },
      dest: { value: paths.actions.ensureFrozen },
      xform: xforms.copy
    },
    {
      src: { value: dpadUpPressed },
      dest: { value: paths.actions.thaw },
      xform: xforms.falling
    },
    {
      src: { value: button("options").pressed },
      dest: { value: paths.actions.toggleFreeze },
      xform: xforms.rising
    },
    {
      src: { value: button("a").pressed },
      dest: { value: paths.actions.startGazeTeleport },
      xform: xforms.rising
    },
    {
      src: { value: button("a").pressed },
      dest: { value: paths.actions.stopGazeTeleport },
      xform: xforms.falling
    }
  ],
  [sets.rightCursorHoldingNothing]: [...characterAccelerationBindings()],
  [sets.rightCursorHoldingInteractable]: [
    ...characterAccelerationBindings(true),
    {
      src: { value: axis("rightTrigger") },
      dest: { value: rightTriggerPressed },
      xform: xforms.axisToBool(0.9),
      priority: 100
    },
    {
      src: { value: rightTriggerPressed },
      dest: { value: paths.actions.cursor.right.drop },
      xform: xforms.falling
    },
    {
      src: { value: deadzonedLeftJoystickVertical },
      dest: { value: scaledLeftJoystickCursorDelta },
      xform: xforms.scale(0.25)
    },
    {
      src: {
        bool: axis("leftTrigger"),
        value: scaledLeftJoystickCursorDelta
      },
      dest: { value: paths.actions.cursor.right.modDelta },
      xform: xforms.copyIfTrue
    }
  ],
  [sets.rightCursorHoveringOnUI]: [
    {
      src: { value: axis("rightTrigger") },
      dest: { value: rightTriggerPressed },
      xform: xforms.axisToBool(0.9)
    },
    {
      src: { value: rightTriggerPressed },
      dest: { value: paths.actions.cursor.right.grab },
      xform: xforms.rising
    }
  ],
  [sets.rightCursorHoveringOnInteractable]: [
    ...characterAccelerationBindings(),
    {
      src: { value: axis("rightTrigger") },
      dest: { value: rightTriggerPressed },
      xform: xforms.axisToBool(0.9),
      priority: 100
    },
    {
      src: { value: rightTriggerPressed },
      dest: { value: paths.actions.cursor.right.grab },
      xform: xforms.rising
    }
  ]
});
