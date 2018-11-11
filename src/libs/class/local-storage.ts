import { UniVector } from "../types/global";

class LocalStorageMemory {

  constructor() {
    // empty
  }

  /**
   * save  Put the object into storage.
   * @example Usage : save("MyObjectKey", myObject )
   * @method save
   * @param {String} Name Name of localstorage key
   * @param {object} Value Any object we can store.
   * @return {Any} What ever we are stored intro localStorage.
   */
  public save(name, obj) {
    try {
      localStorage.setItem(name, JSON.stringify(obj));
    } catch (e) {
      console.log("Something wrong in LocalStorageMemory class , method save!");
    }
  }

  /**
   * load  Load a object from storage. Retrieve the object from storage
   * @example Usage : load("MyObjectKey")
   * @function load
   * @param {String} Name Name of localstorage key
   * @return {Any} What ever we are stored intro localStorage.
   */
  public load(name) {
    if (localStorage.getItem(name) === "undefined" || localStorage.getItem(name) == null || localStorage.getItem(name) === "") {
      console.warn("LocalStorageMemory method load return false!");
      return false;
    } else {
      return JSON.parse(localStorage.getItem(name));
    }
  }

}
export default LocalStorageMemory;
