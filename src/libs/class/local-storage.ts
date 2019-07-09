import { UniVector } from "../types/global";

/**
 * LocalStorageMemory save and load js objects in localStorage.
 */
class LocalStorageMemory {

  public localStorage;

  constructor() {
    // empty
    this.localStorage = window.localStorage;
  }

  /**
   * save  Put the object into storage.
   * @example Usage : save("MyObjectKey", myObject )
   * @method save
   * @param {String} Name Name of localstorage key
   * @param {object} Value Any object we can store.
   * @return {false | object} What ever we are stored intro localStorage.
   */
  public save(name, obj) {
    try {
      return localStorage.setItem(name, JSON.stringify(obj));
    } catch (e) {
      console.log("Something wrong in LocalStorageMemory class , method save!");
      return false;
    }
  }

  /**
   * Load saved object from storage. Retrieve the object from storage or
   * return false.
   * @example Usage : var giveMeMyObject = load("MyObjectKey")
   * @function load
   * @param {String} Name Name of localstorage key
   * @return {false | object} What ever we are stored intro localStorage.
   */
  public load(name) {
    if (localStorage.getItem(name) === "undefined" || localStorage.getItem(name) == null || localStorage.getItem(name) === "") {
      console.warn("LocalStorageMemory method load return's: ", localStorage.getItem(name));
      return false;
    } else {
      return JSON.parse(localStorage.getItem(name));
    }
  }

}
export default LocalStorageMemory;
