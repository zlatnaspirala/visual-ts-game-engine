
### Platformer single player solution ###

 Upgraded from multiplayer :

 - Select player feature

```javascript
 export interface ISelectedPlayer {
  labelName: string;
  poster: imagesResource;
  resource: imagesResource[];
  type:string;
  spriteTile?: { byX: number, byY: number }[];
  spriteTileCurrent:  { byX: number, byY: number };
  texCom?: undefined | SpriteTextureComponent | TextureComponent;
}
```

 - Improving spriteTexture component class

  If you load 3 files class Resource will handle relation between them.
  You can combine tiles vs sprite shema animation, flip all etc.
  Sprite shema is only works on simple split width(byX) and height(byY),
  no complex tex maping solution implemented yet.


For now is it a still opened situation for animation procedure
but i hope very simple.

This is from example part -
  Return player animation set to then idle regime on keyUp event:

```javascript
 private overrideOnKeyUp() {

    // animation configuration block
    if (typeof this.player === "undefined" || this.player === null) { return; }
    const vc = this.player.render.visualComponent;
    if (vc.assets.SeqFrame.getValue() === 2) {
      return;
    }
    vc.assets.SeqFrame.setNewValue(2); // Point to the idle image
    vc.seqFrameX.setDelay(8);
    this.selectedPlayer.spriteTileCurrent = this.selectedPlayer.spriteTile[1]; // point to then correct tile
    vc.setNewShemaByX( this.selectedPlayer.spriteTileCurrent.byX );

  }
```

This can be improved in manir:

 animationSet { name: "run",  tiles , resource img/slot access index etc.. }
 animationSet { name: "attack",  tiles , resource img/slot access index etc.. }
 animationSet { name: "idle",  tiles , resource img/slot access index etc.. }


...
