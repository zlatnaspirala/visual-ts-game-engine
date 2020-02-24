
/**
 * @description Dragging feature, depend only on args.
 * Every
 * @argument divid
 * @argument container
 * @argument evt
 */
let dragging = function () {

  return {
    move (divid, xpos, ypos) {
      divid.style.left = xpos + "px";
      divid.style.top = ypos + "px";
    },
    startMoving (divid, container, evt) {
      evt = evt || window.event;
      const posX = evt.clientX,
        posY = evt.clientY,
        eWi = parseInt(divid.style.width, 10),
        eHe = parseInt(divid.style.height, 10),
        cWi = parseInt(document.getElementById(container).style.width, 10),
        cHe = parseInt(document.getElementById(container).style.height, 10);

      let divTop = divid.style.top,
        divLeft = divid.style.left;

      document.getElementById(container).style.cursor = "move";
      divTop = divTop.replace("px", "");
      divLeft = divLeft.replace("px", "");
      const diffX = posX - divLeft,
        diffY = posY - divTop;

      document.onmousemove = function (event) {

        const e = event || window.event;
        let aX, aY;
        try {
          aX = event.clientX - diffX,
          aY = event.clientY - diffY;
        } catch (err) {
          console.log(err);
        }
        if (aX < 0) { aX = 0; }
        if (aY < 0) { aY = 0; }
        if (aX + eWi > cWi) { aX = cWi - eWi; }
        if (aY + eHe > cHe) { aY = cHe - eHe; }
        dragging.move(divid, aX, aY);
      };
    },
    stopMoving (container) {
      const a = document.createElement("script");
      document.getElementById(container).style.cursor = "default";
      // document.onmousemove = function () {};
      document.onmousemove = undefined;
    },
  };
}();
