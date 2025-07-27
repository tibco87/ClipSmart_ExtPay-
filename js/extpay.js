// ExtensionPay - Official library for ExtensionPay.com
// Sign up at https://extensionpay.com to use this library. AGPLv3 licensed.

(function() {
    // Browser polyfill for cross-browser compatibility
    const browserPolyfill = (function() {
        if (typeof browser !== "undefined" && browser.runtime && browser.runtime.onMessage) {
            return browser;
        } else if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
            // Chrome polyfill
            const wrapAPIs = function(extensionAPIs) {
                const apiMetadata = {
                    "alarms": {
                        "clear": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "clearAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "bookmarks": {
                        "create": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getChildren": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getRecent": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getSubTree": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getTree": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "move": {
                            "minArgs": 2,
                            "maxArgs": 2
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "removeTree": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "search": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "update": {
                            "minArgs": 2,
                            "maxArgs": 2
                        }
                    },
                    "browserAction": {
                        "getBadgeBackgroundColor": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getBadgeText": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getPopup": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getTitle": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setBadgeBackgroundColor": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setBadgeText": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setIcon": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setPopup": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setTitle": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "commands": {
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "contextMenus": {
                        "create": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "removeAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "update": {
                            "minArgs": 2,
                            "maxArgs": 2
                        }
                    },
                    "cookies": {
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getAll": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getAllCookieStores": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "set": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "extension": {
                        "getViews": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "isAllowedFileSchemeAccess": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "isAllowedIncognitoAccess": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "history": {
                        "addUrl": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "deleteAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "deleteRange": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "deleteUrl": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getVisits": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "search": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "i18n": {
                        "getAcceptLanguages": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getMessage": {
                            "minArgs": 2,
                            "maxArgs": 3
                        },
                        "getUILanguage": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "identity": {
                        "getRedirectURL": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "launchWebAuthFlow": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "idle": {
                        "getAutoLockDelay": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "queryState": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setDetectionInterval": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "management": {
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getPermissionWarningsById": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getPermissionWarningsByManifest": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getSelf": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "setEnabled": {
                            "minArgs": 2,
                            "maxArgs": 2
                        },
                        "uninstallSelf": {
                            "minArgs": 0,
                            "maxArgs": 1
                        }
                    },
                    "notifications": {
                        "clear": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "create": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getPermissionLevel": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "update": {
                            "minArgs": 2,
                            "maxArgs": 2
                        }
                    },
                    "pageAction": {
                        "getPopup": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getTitle": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "hide": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setIcon": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setPopup": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "setTitle": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "show": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "permissions": {
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "request": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "contains": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "runtime": {
                        "getBackgroundPage": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getManifest": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getPackageDirectoryEntry": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getPlatformInfo": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "requestUpdateCheck": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "sendMessage": {
                            "minArgs": 1,
                            "maxArgs": 3
                        },
                        "sendNativeMessage": {
                            "minArgs": 2,
                            "maxArgs": 2
                        },
                        "setUninstallURL": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "storage": {
                        "local": {
                            "clear": {
                                "minArgs": 0,
                                "maxArgs": 0
                            },
                            "get": {
                                "minArgs": 0,
                                "maxArgs": 1
                            },
                            "getBytesInUse": {
                                "minArgs": 0,
                                "maxArgs": 1
                            },
                            "remove": {
                                "minArgs": 1,
                                "maxArgs": 1
                            },
                            "set": {
                                "minArgs": 1,
                                "maxArgs": 1
                            }
                        },
                        "managed": {
                            "get": {
                                "minArgs": 0,
                                "maxArgs": 1
                            },
                            "getBytesInUse": {
                                "minArgs": 0,
                                "maxArgs": 1
                            }
                        },
                        "sync": {
                            "clear": {
                                "minArgs": 0,
                                "maxArgs": 0
                            },
                            "get": {
                                "minArgs": 0,
                                "maxArgs": 1
                            },
                            "getBytesInUse": {
                                "minArgs": 0,
                                "maxArgs": 1
                            },
                            "remove": {
                                "minArgs": 1,
                                "maxArgs": 1
                            },
                            "set": {
                                "minArgs": 1,
                                "maxArgs": 1
                            }
                        }
                    },
                    "tabs": {
                        "captureTab": {
                            "minArgs": 0,
                            "maxArgs": 2
                        },
                        "create": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "detectLanguage": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "duplicate": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "executeScript": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getCurrent": {
                            "minArgs": 0,
                            "maxArgs": 0
                        },
                        "getZoom": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "getZoomSettings": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "goBack": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "goForward": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "highlight": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "insertCSS": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "move": {
                            "minArgs": 2,
                            "maxArgs": 2
                        },
                        "query": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "reload": {
                            "minArgs": 0,
                            "maxArgs": 2
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "removeCSS": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "sendMessage": {
                            "minArgs": 2,
                            "maxArgs": 3
                        },
                        "setZoom": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "setZoomSettings": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "update": {
                            "minArgs": 1,
                            "maxArgs": 2
                        }
                    },
                    "topSites": {
                        "get": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "webNavigation": {
                        "getAllFrames": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "getFrame": {
                            "minArgs": 1,
                            "maxArgs": 1
                        }
                    },
                    "webRequest": {
                        "handlerBehaviorChanged": {
                            "minArgs": 0,
                            "maxArgs": 0
                        }
                    },
                    "windows": {
                        "create": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "get": {
                            "minArgs": 1,
                            "maxArgs": 2
                        },
                        "getAll": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "getCurrent": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "getLastFocused": {
                            "minArgs": 0,
                            "maxArgs": 1
                        },
                        "remove": {
                            "minArgs": 1,
                            "maxArgs": 1
                        },
                        "update": {
                            "minArgs": 2,
                            "maxArgs": 2
                        }
                    }
                };

                if (Object.keys(apiMetadata).length === 0) {
                    throw new Error("api-metadata.json has not been included in browser-polyfill");
                }

                class DefaultWeakMap extends WeakMap {
                    constructor(createItem, items = undefined) {
                        super(items);
                        this.createItem = createItem;
                    }

                    get(key) {
                        if (!this.has(key)) {
                            this.set(key, this.createItem(key));
                        }
                        return super.get(key);
                    }
                }

                const isThenable = value => {
                    return value && typeof value === "object" && typeof value.then === "function";
                };

                const makeCallback = (promise, metadata) => {
                    return (...callbackArgs) => {
                        if (extensionAPIs.runtime.lastError) {
                            promise.reject(extensionAPIs.runtime.lastError);
                        } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                            promise.resolve(callbackArgs[0]);
                        } else {
                            promise.resolve(callbackArgs);
                        }
                    };
                };

                const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

                const wrapAsyncFunction = (name, metadata) => {
                    return function asyncFunctionWrapper(target, ...args) {
                        if (args.length < metadata.minArgs) {
                            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                        }

                        if (args.length > metadata.maxArgs) {
                            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                        }

                        return new Promise((resolve, reject) => {
                            if (metadata.fallbackToNoCallback) {
                                try {
                                    target[name](...args, makeCallback({
                                        resolve,
                                        reject
                                    }, metadata));
                                } catch (cbError) {
                                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                                    target[name](...args);
                                    metadata.fallbackToNoCallback = false;
                                    metadata.noCallback = true;
                                    resolve();
                                }
                            } else if (metadata.noCallback) {
                                target[name](...args);
                                resolve();
                            } else {
                                target[name](...args, makeCallback({
                                    resolve,
                                    reject
                                }, metadata));
                            }
                        });
                    };
                };

                const wrapMethod = (target, method, wrapper) => {
                    return new Proxy(method, {
                        apply(targetMethod, thisObj, args) {
                            return wrapper.call(thisObj, target, ...args);
                        }
                    });
                };

                let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

                const wrapObject = (target, wrappers = {}, metadata = {}) => {
                    let cache = Object.create(null);
                    let handlers = {
                        has(proxyTarget, prop) {
                            return prop in target || prop in cache;
                        },

                        get(proxyTarget, prop, receiver) {
                            if (prop in cache) {
                                return cache[prop];
                            }

                            if (!(prop in target)) {
                                return undefined;
                            }

                            let value = target[prop];

                            if (typeof value === "function") {
                                if (typeof wrappers[prop] === "function") {
                                    value = wrapMethod(target, target[prop], wrappers[prop]);
                                } else if (hasOwnProperty(metadata, prop)) {
                                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                                    value = wrapMethod(target, target[prop], wrapper);
                                } else {
                                    value = value.bind(target);
                                }
                            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                                value = wrapObject(value, wrappers[prop], metadata[prop]);
                            } else if (hasOwnProperty(metadata, "*")) {
                                value = wrapObject(value, wrappers[prop], metadata["*"]);
                            } else {
                                Object.defineProperty(cache, prop, {
                                    configurable: true,
                                    enumerable: true,
                                    get() {
                                        return target[prop];
                                    },
                                    set(value) {
                                        target[prop] = value;
                                    }
                                });
                                return value;
                            }

                            cache[prop] = value;
                            return value;
                        },

                        set(proxyTarget, prop, value, receiver) {
                            if (prop in cache) {
                                cache[prop] = value;
                            } else {
                                target[prop] = value;
                            }
                            return true;
                        },

                        defineProperty(proxyTarget, prop, desc) {
                            return Reflect.defineProperty(cache, prop, desc);
                        },

                        deleteProperty(proxyTarget, prop) {
                            return Reflect.deleteProperty(cache, prop);
                        }
                    };

                    let proxyTarget = Object.create(target);
                    return new Proxy(proxyTarget, handlers);
                };

                const wrapEvent = wrapperMap => ({
                    addListener(target, listener, ...args) {
                        target.addListener(wrapperMap.get(listener), ...args);
                    },

                    hasListener(target, listener) {
                        return target.hasListener(wrapperMap.get(listener));
                    },

                    removeListener(target, listener) {
                        target.removeListener(wrapperMap.get(listener));
                    }
                });

                let loggedSendResponseDeprecationWarning = false;
                const onMessageWrappers = new DefaultWeakMap(listener => {
                    if (typeof listener !== "function") {
                        return listener;
                    }

                    return function onMessage(message, sender, sendResponse) {
                        let didCallSendResponse = false;
                        let wrappedSendResponse;
                        let sendResponsePromise = new Promise(resolve => {
                            wrappedSendResponse = function (response) {
                                if (!loggedSendResponseDeprecationWarning) {
                                    console.warn("sendResponse callback is deprecated. Use a Promise instead.", new Error().stack);
                                    loggedSendResponseDeprecationWarning = true;
                                }
                                didCallSendResponse = true;
                                resolve(response);
                            };
                        });
                        let result;

                        try {
                            result = listener(message, sender, wrappedSendResponse);
                        } catch (err) {
                            result = Promise.reject(err);
                        }

                        const isResultThenable = result !== true && isThenable(result);

                        if (result !== true && !isResultThenable && !didCallSendResponse) {
                            return false;
                        }

                        const sendPromisedResult = promise => {
                            promise.then(msg => {
                                sendResponse(msg);
                            }, error => {
                                let message;
                                if (error && (error instanceof Error || typeof error.message === "string")) {
                                    message = error.message;
                                } else {
                                    message = "An unexpected error occurred";
                                }
                                sendResponse({
                                    __mozWebExtensionPolyfillReject__: true,
                                    message
                                });
                            }).catch(err => {
                                console.error("Failed to send onMessage rejected reply", err);
                            });
                        };

                        if (isResultThenable) {
                            sendPromisedResult(result);
                        } else {
                            sendPromisedResult(sendResponsePromise);
                        }

                        return true;
                    };
                });

                const wrappedSendMessageCallback = ({
                    reject,
                    resolve
                }, reply) => {
                    if (extensionAPIs.runtime.lastError) {
                        if (extensionAPIs.runtime.lastError.message === "The message port closed before a response was received.") {
                            resolve();
                        } else {
                            reject(extensionAPIs.runtime.lastError);
                        }
                    } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                        reject(new Error(reply.message));
                    } else {
                        resolve(reply);
                    }
                };

                const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
                    if (args.length < metadata.minArgs) {
                        throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                    }

                    if (args.length > metadata.maxArgs) {
                        throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                    }

                    return new Promise((resolve, reject) => {
                        const wrappedCb = wrappedSendMessageCallback.bind(null, {
                            resolve,
                            reject
                        });
                        args.push(wrappedCb);
                        apiNamespaceObj.sendMessage(...args);
                    });
                };

                const staticWrappers = {
                    runtime: {
                        onMessage: wrapEvent(onMessageWrappers),
                        onMessageExternal: wrapEvent(onMessageWrappers),
                        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                            minArgs: 1,
                            maxArgs: 3
                        })
                    },
                    tabs: {
                        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                            minArgs: 2,
                            maxArgs: 3
                        })
                    }
                };

                const settingMetadata = {
                    clear: {
                        minArgs: 1,
                        maxArgs: 1
                    },
                    get: {
                        minArgs: 1,
                        maxArgs: 1
                    },
                    set: {
                        minArgs: 1,
                        maxArgs: 1
                    }
                };

                apiMetadata.privacy = {
                    network: {
                        "*": settingMetadata
                    },
                    services: {
                        "*": settingMetadata
                    },
                    websites: {
                        "*": settingMetadata
                    }
                };

                return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
            };

            if (typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
                throw new Error("This script should only be loaded in a browser extension.");
            }

            return wrapAPIs(chrome);
        } else {
            return browser;
        }
    })();

    // For running as a content script. Receive a message from the successful payments page
    // and pass it on to the background page to query if the user has paid.
    if (typeof window !== 'undefined') {
        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://extensionpay.com') return;
            if (event.source != window) return;
            if (event.data === 'extpay-fetch-user' || event.data === 'extpay-trial-start') {
                window.postMessage(`${event.data}-received`);
                browserPolyfill.runtime.sendMessage(event.data);
            }
        }, false);
    }

    function ExtPay(extension_id) {
        const HOST = `https://extensionpay.com`;
        const EXTENSION_URL = `${HOST}/extension/${extension_id}`;

        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function get(key) {
            try {
                return await browserPolyfill.storage.sync.get(key)
            } catch(e) {
                // if sync not available (like with Firefox temp addons), fall back to local
                return await browserPolyfill.storage.local.get(key)
            }
        }

        async function set(dict) {
            try {
                return await browserPolyfill.storage.sync.set(dict)
            } catch(e) {
                // if sync not available (like with Firefox temp addons), fall back to local
                return await browserPolyfill.storage.local.set(dict)
            }
        }

        // ----- start configuration checks
        browserPolyfill.management && browserPolyfill.management.getSelf().then(async (ext_info) => {
            if (!ext_info.permissions.includes('storage')) {
                var permissions = ext_info.hostPermissions.concat(ext_info.permissions);
                throw `ExtPay Setup Error: please include the "storage" permission in manifest.json["permissions"] or else ExtensionPay won't work correctly.

You can copy and paste this to your manifest.json file to fix this error:

"permissions": [
    ${permissions.map(x => `"    ${x}"`).join(',\n')}${permissions.length > 0 ? ',' : ''}
    "storage"
]
`
            }
        });
        // ----- end configuration checks

        // run on "install"
        get(['extensionpay_installed_at', 'extensionpay_user']).then(async (storage) => {
            if (storage.extensionpay_installed_at) return;

            // Migration code: before v2.1 installedAt came from the server
            // so use that stored datetime instead of making a new one.
            const user = storage.extensionpay_user;
            const date = user ? user.installedAt : (new Date()).toISOString();
            await set({'extensionpay_installed_at': date});
        });

        const paid_callbacks = [];
        const trial_callbacks = [];

        async function create_key() {
            var body = {};
            var ext_info;
            if (browserPolyfill.management) {
                ext_info = await browserPolyfill.management.getSelf();
            } else if (browserPolyfill.runtime) {
                ext_info = await browserPolyfill.runtime.sendMessage('extpay-extinfo'); // ask background page for ext info
                if (!ext_info) {
                    // Safari doesn't support browser.management for some reason
                    const is_dev_mode = !('update_url' in browserPolyfill.runtime.getManifest());
                    ext_info = {installType: is_dev_mode ? 'development' : 'normal'};
                }
            } else {
                throw 'ExtPay needs to be run in a browser extension context'
            }

            if (ext_info.installType == 'development') {
                body.development = true;
            }

            const resp = await fetch(`${EXTENSION_URL}/api/new-key`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!resp.ok) {
                throw resp.status, `${HOST}/home`
            }
            const api_key = await resp.json();
            await set({extensionpay_api_key: api_key});
            return api_key;
        }

        async function get_key() {
            const storage = await get(['extensionpay_api_key']);
            if (storage.extensionpay_api_key) {
                return storage.extensionpay_api_key;
            }
            return null;
        }

        const datetime_re = /^\d\d\d\d-\d\d-\d\dT/;

        async function fetch_user() {
            var storage = await get(['extensionpay_user', 'extensionpay_installed_at']);
            const api_key = await get_key();
            if (!api_key) {
                return {
                    paid: false,
                    paidAt: null,
                    installedAt: storage.extensionpay_installed_at ? new Date(storage.extensionpay_installed_at) : new Date(), // sometimes this function gets called before the initial install time can be flushed to storage
                    trialStartedAt: null,
                }
            }

            const resp = await fetch(`${EXTENSION_URL}/api/v2/user?api_key=${api_key}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            // TODO: think harder about error states and what users will want (bad connection, server error, id not found)
            if (!resp.ok) throw 'ExtPay error while fetching user: '+(await resp.text())

            const user_data = await resp.json();

            const parsed_user = {};
            for (var [key, value] of Object.entries(user_data)) {
                if (value && value.match && value.match(datetime_re)) {
                    value = new Date(value);
                }
                parsed_user[key] = value;
            }
            parsed_user.installedAt = new Date(storage.extensionpay_installed_at);

            if (parsed_user.paidAt) {
                if (!storage.extensionpay_user || (storage.extensionpay_user && !storage.extensionpay_user.paidAt)) {
                    paid_callbacks.forEach(cb => cb(parsed_user));
                }
            }
            if (parsed_user.trialStartedAt) {
                if (!storage.extensionpay_user || (storage.extensionpay_user && !storage.extensionpay_user.trialStartedAt)) {
                    trial_callbacks.forEach(cb => cb(parsed_user));
                }
            }
            await set({extensionpay_user: user_data});

            return parsed_user;
        }

        async function get_plans() {
            const resp = await fetch(`${EXTENSION_URL}/api/v2/current-plans`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
            });
            if (!resp.ok) {
                throw `ExtPay: HTTP error while getting plans. Received http code: ${resp.status}`
            }
            return await resp.json();
        }

        async function open_popup(url, width, height) {
            if (browserPolyfill.windows && browserPolyfill.windows.create) {
                const current_window = await browserPolyfill.windows.getCurrent();
                // https://stackoverflow.com/a/68456858
                const left = Math.round((current_window.width - width) * 0.5 + current_window.left);
                const top = Math.round((current_window.height - height) * 0.5 + current_window.top);
                try {
                    browserPolyfill.windows.create({
                        url: url,
                        type: "popup",
                        focused: true,
                        width,
                        height,
                        left,
                        top
                    });
                } catch(e) {
                    // firefox doesn't support 'focused'
                    browserPolyfill.windows.create({
                        url: url,
                        type: "popup",
                        width,
                        height,
                        left,
                        top
                    });
                }
            } else {
                // for opening from a content script
                // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
                window.open(url, null, `toolbar=no,location=no,directories=no,status=no,menubar=no,width=${width},height=${height},left=450`);
            }
        }

        async function open_payment_page(plan_nickname) {
            var api_key = await get_key();
            if (!api_key) {
                api_key = await create_key();
            }
            let url = `${EXTENSION_URL}/choose-plan?api_key=${api_key}`;
            if (plan_nickname) {
                url = `${EXTENSION_URL}/choose-plan/${plan_nickname}?api_key=${api_key}`;
            }
            if (browserPolyfill.tabs && browserPolyfill.tabs.create) {
                await browserPolyfill.tabs.create({url, active: true});
            } else {
                window.open(url, '_blank');
            }
        }

        async function open_trial_page(period) {
            // let user have period string like '1 week' e.g. "start your 1 week free trial"

            var api_key = await get_key();
            if (!api_key) {
                api_key = await create_key();
            }
            var url = `${EXTENSION_URL}/trial?api_key=${api_key}`;
            if (period) {
                url += `&period=${period}`;
            }
            open_popup(url, 500, 700);
        }

        async function open_login_page() {
            var api_key = await get_key();
            if (!api_key) {
                api_key = await create_key();
            }
            const url = `${EXTENSION_URL}/reactivate?api_key=${api_key}&back=choose-plan&v2`;
            open_popup(url, 500, 800);
        }

        var polling = false;
        async function poll_user_paid() {
            // keep trying to fetch user in case stripe webhook is late
            if (polling) return;
            polling = true;
            var user = await fetch_user();
            for (var i=0; i < 2*60; ++i) {
                if (user.paidAt) {
                    polling = false;
                    return user;
                }
                await timeout(1000);
                user = await fetch_user();
            }
            polling = false;
        }

        return {
            getUser: function() {
                return fetch_user()
            },
            onPaid: {
                addListener: function(callback) {
                    const content_script_template = `"content_scripts": [
                {
            "matches": ["${HOST}/*"],
            "js": ["ExtPay.js"],
            "run_at": "document_start"
        }]`;
                    const manifest = browserPolyfill.runtime.getManifest();
                    if (!manifest.content_scripts) {
                        throw `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson

        ${content_script_template}`
                    }
                    const extpay_content_script_entry = manifest.content_scripts.find(obj => {
                        // removing port number because firefox ignores content scripts with port number
                        return obj.matches.includes(HOST.replace(':3000', '')+'/*')
                    });
                    if (!extpay_content_script_entry) {
                        throw `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json matching "${HOST}/*". You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson

        ${content_script_template}`
                    } else {
                        if (!extpay_content_script_entry.run_at || extpay_content_script_entry.run_at !== 'document_start') {
                            throw `ExtPay setup error: To use the onPaid callback handler, please make sure the ExtPay content script in your manifest.json runs at document start. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifest.json

        ${content_script_template}`
                        }
                    }

                    paid_callbacks.push(callback);
                },
                // removeListener: function(callback) {
                //     // TODO
                // }
            },
            getPlans: get_plans,
            openPaymentPage: open_payment_page,
            openTrialPage: open_trial_page,
            openLoginPage: open_login_page,
            onTrialStarted: {
                addListener: function(callback) {
                    trial_callbacks.push(callback);
                }
            },
            startBackground: function() {
                browserPolyfill.runtime.onMessage.addListener(function(message, sender, send_response) {
                    if (message == 'extpay-fetch-user') {
                        // Only called via extensionpay.com/extension/[extension-id]/paid -> content_script when user successfully pays.
                        // It's possible attackers could trigger this but that is basically harmless. It would just query the user.
                        poll_user_paid();
                    } else if (message == 'extpay-trial-start') {
                        // no need to poll since the trial confirmation page has already set trialStartedAt
                        fetch_user();
                    } else if (message == 'extpay-extinfo' && browserPolyfill.management) {
                        // get this message from content scripts which can't access browser.management
                        return browserPolyfill.management.getSelf()
                    }
                });
            }
        }
    }

    // Make ExtPay available globally
    if (typeof window !== 'undefined') {
        window.ExtPay = ExtPay;
    }
    
    // Make ExtPay available in service worker context
    if (typeof self !== 'undefined') {
        self.ExtPay = ExtPay;
    }
    
    return ExtPay;
})(); 