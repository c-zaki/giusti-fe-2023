export class Device {
  /**
   * @see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
   *
   * @static
   * @returns
   * @memberof Device
   */
  static get isIOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  static get isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  }

  static get isSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf("safari/") > -1 && ua.indexOf("chrome") < 0);
  }

  static get isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }
}
