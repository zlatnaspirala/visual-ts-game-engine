import { IBroadcasterSession } from "./libs/interface/networking";
import { Addson } from "./libs/types/global";

/**
 * ClientConfig is config file for whole client part of application.
 * It is a better to not mix with server config staff.
 * All data is defined like default private property values.
 * Use mmethod class to get proper.
 * Class don't have any args passed.
 */
class ClientConfig {

	/**
	 * Addson - Role is : "no dependencies scripts only"
	 * All addson are ansync loaded scripts.
	 *  - hackerTimer is for better performace also based on webWorkers. Load this script on top.
	 *  - Cache is based on webWorkers.
	 *  - dragging is script for dragging dom elements taken from stackoverflow.com.
	 *  - facebook addson is simple fb api implementation.
	 *  - adapter is powerfull media/communication fixer(Objective : working on all moder browsers).
	 */
	private addson: Addson=[
		{
			name: "cache",
			enabled: false,
			scriptPath: "externals/cacheInit.ts",
		},
		{
			name: "hackerTimer",
			enabled: true,
			scriptPath: "externals/hack-timer.js",
		},
		{
			name: "dragging",
			enabled: false,
			scriptPath: "externals/drag.ts",
		},
		{
			name: "adapter",
			enabled: true,
			scriptPath: "externals/adapter.js",
		},
		{
			name: "facebook",
			enabled: false,
			scriptPath: "externals/fb.js",
		},
	];

	/**
	 * @description This is main canvas dom
	 * id. Program will handle missing this params.
	 * It is nice to have id for main canvas dom element
	 * to avoid coallision woth other possible programs
	 * who use also canvas element.
	 * IMPLEMENTATION [WIP]
	 * @property canvasId
	 * @type  string
	 */
	public canvasId: string="vtsge";

	// Free to define what ever -> injectCanvas
	public recordCanvasOption: any={
		injectCanvas: () => document.getElementsByTagName("canvas")[0],
		frameRequestRate: 30,
		videoDuration: 20,
		outputFilename: "record-gameplay.mp4",
		mineType: "video/mp4",
		resolutions: '800x600'
	}

	public networking2: any;
	/**
	 * @description This is main coordinary types of positions
	 * Can be "diametric-fullscreen" or "frame".
	 *  - diametric-fullscreen is simple fullscreen canvas element.
	 *  - frame keeps aspect ratio in any aspect.
	 * @property drawReference
	 * @type  string
	 */
	private drawReference: string="frame";

	/**
	 * aspectRatio default value, can be changed in run time.
	 * This is 800x600, 1.78 is also good fit for lot of desktop monitors screens
	 */
	private aspectRatio: number=1.333;

	/**
	 * @description
	 * Default setup is `dev`.
	 * recommendent to use for local propose LAN ip
	 * like : 192.168.0.XXX if you wanna run ant test app with server.
	 */
	private domain: string="maximumroulette.com";
	// private domain: string = "localhost";

	/**
	 * networkDeepLogs control of dev logs for webRTC context only.
	 */
	private networkDeepLogs: boolean=false;

	/**
	 * masterServerKey is channel access id used to connect
	 * multimedia server channel.Both multiRTC2/3
	 */
	private masterServerKey: string="maximumroulette.platformer";

	/**
	 * appUseAccountsSystem If you don't want to use session
	 * in your application just setup this variable to the false.
	 */
	private appUseAccountsSystem: boolean=true;

	/**
	 * appUseBroadcaster Disable or enable broadcaster for
	 * video chats.
	 */
	private appUseBroadcaster: boolean=true;

	/**
	 * @description
	 * broadcaster socket.io address.
	 * Change it for production regime
	 */
	private broadcastAutoConnect: boolean=true;

	/**
	 * @description
	 * Possible variant by default:
	 * "register", "login"
	 */
	private startUpHtmlForm: string="register";

	private controls: {}={
		platformerPlayerController: true,
		enableMobileControlsOnDesktop: true,
	};

	private gameList: any[];

	/**
	 * @description
	 * Implement default gamePlay variable's
	 */
	private defaultGamePlayLevelName: string="public";
	private autoStartGamePlay: boolean=false;

	/**
	 * @description
	 * constructor will save interest data for game platform
	 * For now it is just name of the game. I use it in
	 * pre gameplay UI game selector.
	 */
	constructor (gameList: any[]) {
		this.gameList=gameList;

		this.networking2={
			active: true,
			domain: 'maximumroulette.com',
			port: 2020,
			sessionName: 'platformer',
			resolution: '640x480'
		};
	}

	public getRecordCanvasOptions(): string {
		return this.recordCanvasOption;
	}

	public getcontrols(): any {
		return this.controls;
	}

	public getBroadcastAutoConnect(): boolean {
		return this.broadcastAutoConnect;
	}

	public getAddson(): Addson {
		return this.addson;
	}

	public getAutoStartGamePlay(): boolean {
		return this.autoStartGamePlay;
	}

	public getGamesList() {
		return this.gameList;
	}

	public getDefaultGamePlayLevelName(): string {
		return this.defaultGamePlayLevelName;
	}

	public didAppUseAccountsSystem(): boolean {
		return this.appUseAccountsSystem;
	}

	public didAppUseBroadcast(): boolean {
		return this.appUseBroadcaster;
	}

	public getStartUpHtmlForm(): string {
		return this.startUpHtmlForm;
	}

	public getDomain() {
		if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1") {
			return window.location.hostname;
		}
		return this.domain;
	}

	public getDrawRefference(): string {
		return this.drawReference;
	}

	public getAspectRatio(): number {
		return this.aspectRatio;
	}

	public setAspectRatio(newAspectRatio: number) {
		this.aspectRatio=newAspectRatio;
	}

	public getProtocolFromAddressBar(): string {
		return (location.protocol==="https:"? "https://":"http://");
	}

	public setNetworkDeepLog(newState: boolean) {
		this.networkDeepLogs=newState;
	}

	public getNetworkDeepLog(): boolean {
		return this.networkDeepLogs;
	}

	public getMasterServerKey(): string {
		return this.masterServerKey;
	}

}
export default ClientConfig;
