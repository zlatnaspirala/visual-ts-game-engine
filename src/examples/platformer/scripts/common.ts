import Platformer from "../platformer";

//runs on collisions events
export function playerGroundCheck(event, ground: boolean, r: Platformer) {
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    const pair = pairs[i];
    if (pair.bodyA.label === "ground") {
      r.player.ground = ground;
    } else if (pair.bodyB.label === "ground") {
      r.player.ground = ground;
    }
  }

}
