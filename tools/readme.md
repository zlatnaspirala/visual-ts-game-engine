# Visual-ts game engine tools #

Folder tools/ is git submodule root folder.

### Project name: creator-2dmap ###

First level of visual tools staff.
Generate you static, text, enemies item game element with positions and dimensions.

Download support for python3 for your OS.
Download python script creator-2dmap at:

  https://github.com/zlatnaspirala/creator-2dmap

Download visual-ts-game-engine from:

  https://github.com/zlatnaspirala/visual-ts-game-engine

Install with pip3 what app need and run:
```bash
  ./python3 tool.py (unix)
  python.exe tool.py (win)
```

Minimum dependency (Python3 + tkinter)
Basic is done: put grounds static and collectItem game element, save, load and export map...

Save and load is hardcoded for now. Only one table is
possible to save but you can export any time to the game direct.

Please find you full absolute path in defaults.py config file:
```
  src\examples\platformer\scripts\packs\map2d.ts
```

`load custom` load creator2dmap file
`Save as` save creator2dmap file
On `export as` we get final map.ts.

 `Level1-map.ts` is generated map content from python app.

