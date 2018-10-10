import Platformer from "../platformer";

//runs on collisions events
export function playerGroundCheck(event, ground: boolean, r: Platformer) {
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    const pair = pairs[i];
    if ( pair.activeContacts ){
      pair.activeContacts.forEach(element => {
        if (element.vertex.body.label === "player" &&
              element.vertex.index > 5 && element.vertex.index < 8) {
           //     console.log("  JUMP:");
              r.player.ground = ground;
        } else {
              r.player.ground = false;
         // console.log("NO JUMP:");
        }
      });
    }
  }
}
