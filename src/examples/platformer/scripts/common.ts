import Platformer from "../platformer";

// runs on collisions events
export function collisionCheck(event, ground: boolean, r: Platformer) {
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i !== j; ++i) {
    const pair = pairs[i];
    if (pair.activeContacts) {

      if (pair.bodyA.label === "player" && pair.bodyB.label === "bitcoin") {
        const collectitem = pair.bodyB;
        r.starter.destroyBody(collectitem);
      }

      pair.activeContacts.forEach((element) => {
        if (element.vertex.body.label === "player" &&
          element.vertex.index > 5 && element.vertex.index < 8) {
          r.player.ground = ground;
        } else {
          r.player.ground = false;
        }
      });
    }
  }
}
