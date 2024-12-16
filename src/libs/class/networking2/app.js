// import {htmlHeader, scriptManager} from "../lib/utility";
import {htmlHeader, scriptManager} from "../system";
import {BIGLOG, byId, closeSession, joinSession, leaveSession, netConfig, REDLOG, removeUser} from "./matrix-stream";

/**
 * Main instance for matrix-stream
 * version 1.0.0 beta
 */

export default class Broadcaster {

	connection = null;
	session = null;

	constructor(arg) {
		console.info('[openvidu-browser-2.20.0.js] MatrixStream constructor run');
		if(typeof arg === 'undefined') {
			throw console.error('MatrixStream constructor must have argument : { domain: <DOMAIN_NAME> , port: <NUMBER> }');
		}
		netConfig.NETWORKING_DOMAIN = arg.domain;
		netConfig.NETWORKING_PORT = arg.port;
		netConfig.sessionName = arg.sessionName;
		netConfig.resolution = arg.resolution;
		netConfig.autoConnect = arg.autoConnect;
		scriptManager.load('openvidu-browser-2.20.0.js', () => {
			console.info('[openvidu-browser-2.20.0.js] MatrixStream constructor');
			this.loadNetHTML()
		});
	}

	loadNetHTML() {
		fetch("./templates/broadcaster2.html", {headers: htmlHeader}).then((res) => {return res.text()})
			.then((html) => {
				console.log(' TEST >>>>>>	loadNetHTML() {>>>>>')
				var popupUI = byId("matrix-net");
				popupUI.style = 'display: block;';
				popupUI.innerHTML = html;
				this.joinSessionUI = byId("join-btn");
				this.buttonCloseSession = byId('buttonCloseSession');
				this.buttonLeaveSession = byId('buttonLeaveSession');
				byId("sessionName").value = netConfig.sessionName;
				this.sessionName = byId("sessionName");
				console.log('[CHANNEL]' + this.sessionName.value)
				this.attachEvents()
				console.log(`%c MatrixStream constructed.`, BIGLOG)
			});
	}

	attachEvents() {

		addEventListener(`LOCAL-STREAM-READY`, (e) => {
			console.log('LOCAL-STREAM-READY ', e.detail.connection)
			this.connection = e.detail.connection;
			var CHANNEL = netConfig.sessionName
			console.log("ONLY ONES CHANNEL =>", CHANNEL);
			this.connection.send = (netArg) => {
				this.session.signal({
					data: JSON.stringify(netArg),
					to: [],
					type: CHANNEL
				}).then(() => {
					// console.log('emit all successfully');
				}).catch(error => {
					console.error("Erro signal => ", error);
				});
			}
		})

		addEventListener('setupSessionObject', (e) => {
			console.log("setupSessionObject=>", e.detail);
			this.session = e.detail;
			this.session.on(`signal:${netConfig.sessionName}`, (e) => {
				if(this.connection.connectionId == e.from.connectionId) {
					//
				} else {
					this.multiPlayer.update(e);
				}
			});
		})

		this.joinSessionUI.addEventListener('click', () => {
			console.log(`%c JOIN SESSION [${netConfig.resolution}] `, REDLOG)
			joinSession({resolution: netConfig.resolution})
		})
		this.buttonCloseSession.addEventListener('click', closeSession)
		this.buttonLeaveSession.addEventListener('click', () => {
			console.log(`%c LEAVE SESSION`, REDLOG)
			removeUser()
			leaveSession()
		})

		byId('netHeaderTitle').addEventListener('click', this.domManipulation.hideNetPanel)

		setTimeout(() => {
			console.log('ggggg', netConfig.autoConnect)
			dispatchEvent(new CustomEvent('net-ready', {}))
		}, 500)
	}

	multiPlayer = {
		root: this,
		init(rtcEvent) {
			console.log("rtcEvent add new net object -> ", rtcEvent);
			// dispatchEvent(new CustomEvent('net-new-user', {detail: {data: rtcEvent}}))
		},
		update(e) {
			e.data = JSON.parse(e.data);
			// dispatchEvent(new CustomEvent('network-data', {detail: e.data}))
			// console.log('INFO UPDATE', e);
			if(e.data.netPos) {
				if(App.scene[e.data.netObjId]) {
					// if(e.data.netPos.x) App.scene[e.data.netObjId].position.SetX(e.data.netPos.x, 'noemit');
				}
			} else if(e.data.netRot) {
				// console.log('ROT INFO UPDATE', e);
			} else if(e.data.netScale) {
				// console.log('netScale INFO UPDATE', e);
			}
		},
		/**
		 * If someone leaves all client actions is here
		 * - remove from scene
		 * - clear object from netObject_x
		 */
		leaveGamePlay(rtcEvent) {
			console.info("rtcEvent LEAVE GAME: ", rtcEvent.userid);
			dispatchEvent(new CustomEvent('net.remove-user', {detail: {data: rtcEvent}}))
		}
	};

	activateDataStream = (arg) => {
		console.log("override multiPlayer - activateDataStream", arg)
		this.multiPlayer = arg;
		this.joinSessionUI.click();
	}

	domManipulation = {
		hideNetPanel: () => {
			if(byId('matrix-net').classList.contains('hide-by-vertical')) {
				byId('matrix-net').classList.remove('hide-by-vertical')
				byId('matrix-net').classList.add('show-by-vertical')
				byId('netHeaderTitle').innerText = 'HIDE';
			} else {
				byId('matrix-net').classList.remove('show-by-vertical')
				byId('matrix-net').classList.add('hide-by-vertical')
				byId('netHeaderTitle').innerText = 'SHOW';
			}
		}
	}
}
