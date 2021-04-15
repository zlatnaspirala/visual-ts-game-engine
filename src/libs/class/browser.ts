

/**
 * @description This is possible value's for property description:
 * "mobile_firefox_android" "mobile_firefox_android_tablet" "opera_mobile_android"
 * "opera_mobile_android_tablet" "safari_mobile_iphone" "mobile_safari_chrome_ipad"
 * "android_native" "mobile_chrome_android_tablet" "mobile_chrome_android"
 * "chrome_browser" "firefox_desktop" "opera_desktop" "firefox_desktop_linux"
 * "chrome_desktop_linux" "opera_desktop_linux" 
 */
class Browser {

    public isMobile: boolean = false;
    public device: string = "unknow";
    public uAgent = navigator.userAgent;
    // No numerated variable -> os
    public os: string = "";
    public description: string = "";

    private gecko: RegExpMatchArray | boolean | any;
    private navIpad: RegExpMatchArray | boolean | any;
    private operatablet: RegExpMatchArray | boolean | any;
    private navIphone: RegExpMatchArray | boolean | any;
    private navFirefox: RegExpMatchArray | boolean | any;
    private navChrome: RegExpMatchArray | null;
    private navOpera: RegExpMatchArray | boolean | any;
    private navSafari: RegExpMatchArray | null;
    private navandroid: RegExpMatchArray | boolean | any;
    private mobile: RegExpMatchArray | boolean | any;
    private navMozilla: RegExpMatchArray | boolean | any;
    private navUbuntu: RegExpMatchArray | boolean;
    private navLinux: RegExpMatchArray | boolean;

    private windowsOS: RegExpMatchArray | null = null;

    constructor() {

        this.navLinux = this.uAgent.match(/Linux/gi);
        this.navUbuntu = this.uAgent.match(/Ubuntu/gi);
        this.gecko = this.uAgent.match(/gecko/gi);
        this.navOpera = (this.uAgent.match(/Opera|OPR\//) ? true : false);
        this.operatablet = this.uAgent.match(/Tablet/gi);
        this.navIpad = this.uAgent.match(/ipad/gi);
        this.navIphone = this.uAgent.match(/iphone/gi);
        this.navFirefox = this.uAgent.match(/Firefox/gi);
        this.navMozilla = this.uAgent.match(/mozilla/gi);
        this.navChrome = this.uAgent.match(/Chrome/gi);
        this.navSafari = this.uAgent.match(/safari/gi);
        this.navandroid = this.uAgent.match(/android/gi);
        this.windowsOS = this.uAgent.match(/Windows NT/gi);
        this.mobile = this.uAgent.match(/mobile/gi);

        this.isMobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

        if (this.isMobile) {
            const userAgent = this.uAgent.toLowerCase();
            if ((userAgent.search("android") > -1) && (userAgent.search("mobile") > -1)) {
                this.device = "ANDROID";
            } else if ((userAgent.search("android") > -1) && !(userAgent.search("mobile") > -1)) {
                // TYPEOFANDROID = 1;
                this.device = "ANDROID_TABLET";
            }

        } else {
            this.device = "desktop";
        }

        this.check();

    }

    private check() {

        if (this.windowsOS) {
            this.device = "desktop";
            this.os = "win";
        }

        // FIREFOX on android
        if (this.navFirefox && this.navandroid && this.device === "ANDROID") {
            this.description = "mobile_firefox_android";
        }
        // FIREFOX on android T
        if (this.navFirefox && this.navandroid && this.device === "ANDROID_TABLET") {
            this.description = "mobile_firefox_android_tablet";
        }
        // OPERA on ANDROID
        if (this.navOpera && this.navandroid) {
            this.description = "opera_mobile_android";
        }
        // OPERA FOR ANDROID TABLET
        if (this.navOpera && this.navandroid && this.operatablet) {
            this.description = "opera_mobile_android_tablet";
        }
        //  safari mobile for IPHONE also safari mobile for IPAD and CHROME IPAD
        if (this.navSafari) {
            const Iphonesafari = this.uAgent.match(/iphone/gi);
            if (Iphonesafari) {
                this.device = "IPHONE";
                this.description = "safari_mobile_iphone";
            } else if (this.navIpad) {
                this.device = "IPAD";
                this.description = "mobile_safari_chrome_ipad";
            } else if (this.navandroid) {
                this.device = "ANDROID";
                this.description = "android_native";
            }
        }
        // chrome
        if (this.navChrome && this.navSafari && this.navMozilla && this.device === "ANDROID_TABLET") {
            this.description = "mobile_chrome_android_tablet";
        }
        if (this.navChrome && this.navSafari && this.navMozilla && this.device === "ANDROID") {
            this.description = "mobile_chrome_android";
        }
        if (this.navChrome && this.navSafari && this.navMozilla[0] && this.os === "win") {
            this.description = "chrome";
        }
        if (this.navChrome && this.device === "ANDROID") {
            this.description = "chrome_browser";
        }
        if (this.navMozilla && !this.isMobile && this.gecko && this.navFirefox) {
            this.description = "firefox_desktop";
        }
        if (this.navOpera && this.device === "ANDROID" && !this.isMobile) {
            this.device = "desktop";
            this.description = "opera_desktop";
        }
        // linux
        if (this.navUbuntu && this.navMozilla && this.navFirefox && this.navLinux) {
            this.device = "desktop";
            this.description = "firefox_desktop_linux";
        }
        if (this.navMozilla && this.navLinux && this.navChrome && this.navSafari) {
            this.device = "desktop";
            this.description = "chrome_desktop_linux";
        }
        if (this.navMozilla && this.navLinux && this.navChrome && this.navSafari && this.navOpera) {
            this.device = "desktop";
            this.description = "opera_desktop_linux";
        }

    }

}
export default Browser;
