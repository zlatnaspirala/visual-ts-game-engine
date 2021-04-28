
export let scriptManager = {
  scriptManager_ID: 0,
  loaded: {},
  load: function addScript(src: string) {
    const s = document.createElement("script");
    s.onload = function (e) {
      console.info("Loaded ", e)
      scriptManager.scriptManager_ID++;
    };
    s.setAttribute("src", src);

    s.onerror = function (err) {
      console.warn("Script loader faild to load: ", err);
    };

    try {
      document.body.appendChild(s);
    } catch (err) {
      console.error("Something wrong with loading async javascript code. `document.body` undefined.")
    }

  },
};

export function byId(id: string) {
  return document.getElementById(id);
}

export function getElement(selector) {
  return document.querySelector(selector);
}

export function createAppEvent(name: string, myDetails: any): CustomEvent {
  return new CustomEvent(name, {
    detail: {
      eventName: name,
      data: myDetails,
    },
    bubbles: true,
  });
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF".split("");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

export function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) { return "0 Bytes"; }
  // tslint:disable-next-line:radix
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) as any);
  return (Math.round(bytes / (Math.pow(1024, i), 2) as any)) + " " + sizes[i];
}

export function randomIntFromTo(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function validateEmail(email: string): string | null {
  // tslint:disable-next-line:max-line-length
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (regexp.test(email) === false) {
    return "Email is not valid !";
  }
  return null;
}

export function validatePassword(pass: string): boolean {
  if (pass.length < 8) {
    return false;
  }
  return true;
}

export const HeaderTypes = {
  textPlan: "text/plain",
  html: "text/html",
  jpeg: "image/jpeg",
  png: "image/png",
  mpeg: "audio/mpeg",
  ogg: "audio/ogg",
  audio: "audio/*",
  mp4: "video/mp4",
  app: "application/*",
  appJson: "application/json",
  appJS: "application/javascript",
  appECMA: "application/ecmascript",
  appOctetSteam: "application/octet-stream",
};

export const jsonHeaders = new Headers({
  "Content-Type": "application/json",
  "Accept": "application/json",
});

export const htmlHeader = new Headers({
  "Content-Type": "text/html",
  "Accept": "text/plain",
});

export function encodeString(str): any {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(str);
}

export function decodeString(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return atob(str);
}

export function encodeStringTest(str): any {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode(parseInt("0x" + p1, 16));
    }));
}
