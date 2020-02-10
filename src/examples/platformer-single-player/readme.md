
## Platformer single player solution ##

### version 0.3.4 ###
#### Published on apps facebook ####
http://apps.facebook.com/nidzica

 Next feature :

 - Select player feature for multiplayer

```javascript
export interface ISelectedPlayer {
  labelName: string;
  poster: imagesResource;
  resource: imagesResource[];
  type:string;
  spriteTile?:{key: { byX: number, byY: number }} | any;
  spriteTileCurrent: string;
  setCurrentTile(index: string): void;
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
  private overrideOnKeyDown = () => {

    var testRoot = this;

    if (typeof testRoot.player === "undefined" || testRoot.player === null) { return; }
    const vc = testRoot.player.render.visualComponent;
    if (vc.assets.SeqFrame.getValue() === 0) { return; }

    testRoot.selectedPlayer.setCurrentTile("run");
    testRoot.player.render.visualComponent.setNewShema(testRoot.selectedPlayer);
    testRoot.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
    testRoot.player.render.visualComponent.seqFrameX.setDelay(8);

  }
```
