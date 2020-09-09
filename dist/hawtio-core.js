var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Init;
(function (Init) {
    var InitService = /** @class */ (function () {
        InitService.$inject = ["$q"];
        function InitService($q) {
            'ngInject';
            this.$q = $q;
            this.initFunctions = [];
        }
        InitService.prototype.registerInitFunction = function (initFunction) {
            this.initFunctions.push(initFunction);
        };
        InitService.prototype.init = function () {
            return this.$q.all(this.initFunctions.map(function (initFunction) { return initFunction(); }));
        };
        return InitService;
    }());
    Init.InitService = InitService;
})(Init || (Init = {}));
/// <reference path="init/init.service.ts"/>
var App;
(function (App) {
    var AppController = /** @class */ (function () {
        AppController.$inject = ["initService"];
        function AppController(initService) {
            'ngInject';
            this.initService = initService;
            this.loading = true;
        }
        AppController.prototype.$onInit = function () {
            var _this = this;
            this.initService.init()
                .then(function () { return _this.loading = false; });
        };
        return AppController;
    }());
    App.AppController = AppController;
    App.appComponent = {
        template: "\n      <hawtio-loading loading=\"$ctrl.loading\">\n        <page></page>\n      </hawtio-loading>\n    ",
        controller: AppController
    };
})(App || (App = {}));
/// <reference path="../config/config.ts"/>
var About;
(function (About) {
    var AboutService = /** @class */ (function () {
        AboutService.$inject = ["configManager"];
        function AboutService(configManager) {
            'ngInject';
            this.configManager = configManager;
            this.productInfo = this.configManager.getAboutValue('productInfo') || [];
            this.productInfo = _.sortBy(this.productInfo, ['name']);
        }
        AboutService.prototype.getTitle = function () {
            return this.configManager.getAboutValue('title');
        };
        AboutService.prototype.getProductInfo = function () {
            return this.productInfo;
        };
        AboutService.prototype.addProductInfo = function (name, value) {
            this.productInfo.push({ name: name, value: value });
            this.productInfo = _.sortBy(this.productInfo, ['name']);
        };
        AboutService.prototype.getCopyright = function () {
            return this.configManager.getAboutValue('copyright');
        };
        AboutService.prototype.getImgSrc = function () {
            return this.configManager.getAboutValue('imgSrc');
        };
        return AboutService;
    }());
    About.AboutService = AboutService;
})(About || (About = {}));
/// <reference path="about/about.service.ts"/>
var App;
(function (App) {
    configureAboutPage.$inject = ["aboutService"];
    function configureAboutPage(aboutService) {
        'ngInject';
        aboutService.addProductInfo('Hawtio Core', 'PACKAGE_VERSION_PLACEHOLDER');
    }
    App.configureAboutPage = configureAboutPage;
})(App || (App = {}));
/// <reference path="about.service.ts"/>
/// <reference path="../config/config.ts"/>
var About;
(function (About) {
    var AboutController = /** @class */ (function () {
        AboutController.$inject = ["$rootScope", "aboutService"];
        function AboutController($rootScope, aboutService) {
            'ngInject';
            this.$rootScope = $rootScope;
            this.aboutService = aboutService;
            this.open = false;
        }
        AboutController.prototype.$onInit = function () {
            var _this = this;
            this.$rootScope.$on(About.SHOW_ABOUT_EVENT, function () {
                _this.open = true;
            });
        };
        Object.defineProperty(AboutController.prototype, "title", {
            get: function () {
                return this.aboutService.getTitle();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AboutController.prototype, "productInfo", {
            get: function () {
                return this.aboutService.getProductInfo();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AboutController.prototype, "copyright", {
            get: function () {
                return this.aboutService.getCopyright();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AboutController.prototype, "imgSrc", {
            get: function () {
                return this.aboutService.getImgSrc();
            },
            enumerable: false,
            configurable: true
        });
        AboutController.prototype.close = function () {
            this.open = false;
        };
        return AboutController;
    }());
    About.AboutController = AboutController;
    About.aboutComponent = {
        templateUrl: 'about/about.component.html',
        controller: AboutController
    };
})(About || (About = {}));
/// <reference path="about.component.ts"/>
/// <reference path="about.service.ts"/>
var About;
(function (About) {
    About.aboutModule = angular
        .module('hawtio-about', [])
        .component('about', About.aboutComponent)
        .service('aboutService', About.AboutService)
        .name;
})(About || (About = {}));
var Core;
(function (Core) {
    var DEFAULT_USER = 'public';
    /**
     * UserDetails service that represents user credentials and login/logout actions.
     */
    var AuthService = /** @class */ (function () {
        AuthService.$inject = ["postLoginTasks", "preLogoutTasks", "postLogoutTasks"];
        function AuthService(postLoginTasks, preLogoutTasks, postLogoutTasks) {
            'ngInject';
            this.postLoginTasks = postLoginTasks;
            this.preLogoutTasks = preLogoutTasks;
            this.postLogoutTasks = postLogoutTasks;
            this._username = DEFAULT_USER;
            this._password = null;
            this._token = null;
            this._loggedIn = false;
        }
        /**
         * Log in as a specific user.
         */
        AuthService.prototype.login = function (username, password, token) {
            this._username = username;
            this._password = password;
            if (token) {
                this._token = token;
            }
            this._loggedIn = true;
            Core.log.info('Logged in as', this._username);
            this.postLoginTasks.execute();
        };
        /**
         * Log out the current user.
         */
        AuthService.prototype.logout = function () {
            var _this = this;
            if (!this._loggedIn) {
                Core.log.debug('Not logged in');
                return;
            }
            this.preLogoutTasks.execute(function () {
                var username = _this._username;
                // do logout
                _this.clear();
                _this.postLogoutTasks.execute(function () {
                    Core.log.info('Logged out:', username);
                });
            });
        };
        AuthService.prototype.clear = function () {
            this._username = DEFAULT_USER;
            this._password = null;
            this._token = null;
            this._loggedIn = false;
        };
        Object.defineProperty(AuthService.prototype, "username", {
            get: function () {
                return this._username;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "password", {
            get: function () {
                return this._password;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "token", {
            get: function () {
                return this._token;
            },
            set: function (token) {
                this._token = token;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "loggedIn", {
            get: function () {
                return this._loggedIn;
            },
            enumerable: false,
            configurable: true
        });
        AuthService.prototype.isDefaultUser = function () {
            return this._username === DEFAULT_USER;
        };
        return AuthService;
    }());
    Core.AuthService = AuthService;
})(Core || (Core = {}));
var Core;
(function (Core) {
    function getBasicAuthHeader(username, password) {
        var authInfo = username + ":" + password;
        authInfo = window.btoa(authInfo);
        return "Basic " + authInfo;
    }
    Core.getBasicAuthHeader = getBasicAuthHeader;
})(Core || (Core = {}));
/// <reference path="auth.service.ts"/>
/// <reference path="auth.helper.ts"/>
var Core;
(function (Core) {
    Core.authModule = angular
        .module('hawtio-core-auth', [])
        .service('authService', Core.AuthService)
        .factory('userDetails', ['authService', function (authService) { return authService; }]) // remove when all references are gone
        .name;
})(Core || (Core = {}));
/// <reference path="config.ts"/>
var Core;
(function (Core) {
    var ConfigManager = /** @class */ (function () {
        function ConfigManager(_config) {
            this._config = _config;
        }
        Object.defineProperty(ConfigManager.prototype, "config", {
            get: function () {
                return this._config;
            },
            set: function (value) {
                this._config = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ConfigManager.prototype, "branding", {
            get: function () {
                return this._config.branding;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ConfigManager.prototype, "login", {
            get: function () {
                return this._config.login;
            },
            enumerable: false,
            configurable: true
        });
        ConfigManager.prototype.getBrandingValue = function (key) {
            if (this._config && this._config.branding && this._config.branding[key]) {
                return this._config.branding[key];
            }
            else {
                return '';
            }
        };
        ConfigManager.prototype.getAboutValue = function (key) {
            if (this._config && this._config.about && this._config.about[key]) {
                return this._config.about[key];
            }
            else {
                return null;
            }
        };
        ConfigManager.prototype.isRouteEnabled = function (path) {
            return !this._config || !this._config.disabledRoutes || this._config.disabledRoutes.indexOf(path) === -1;
        };
        return ConfigManager;
    }());
    Core.ConfigManager = ConfigManager;
})(Core || (Core = {}));
/// <reference path="../config-manager.ts"/>
var Core;
(function (Core) {
    var BrandingImageController = /** @class */ (function () {
        BrandingImageController.$inject = ["configManager"];
        function BrandingImageController(configManager) {
            'ngInject';
            this.configManager = configManager;
        }
        BrandingImageController.prototype.$onInit = function () {
            this.srcValue = this.configManager.getBrandingValue(this.src);
            this.altValue = this.configManager.getBrandingValue(this.alt);
        };
        return BrandingImageController;
    }());
    Core.BrandingImageController = BrandingImageController;
    Core.brandingImageComponent = {
        bindings: {
            class: '@',
            src: '@',
            alt: '@'
        },
        template: '<img class="{{$ctrl.class}}" src="{{$ctrl.srcValue}}" alt="{{$ctrl.altValue}}"/>',
        controller: BrandingImageController
    };
})(Core || (Core = {}));
/// <reference path="../config-manager.ts"/>
var Core;
(function (Core) {
    var BrandingTextController = /** @class */ (function () {
        BrandingTextController.$inject = ["configManager"];
        function BrandingTextController(configManager) {
            'ngInject';
            this.configManager = configManager;
        }
        BrandingTextController.prototype.$onInit = function () {
            this.value = this.configManager.getBrandingValue(this.key);
        };
        return BrandingTextController;
    }());
    Core.BrandingTextController = BrandingTextController;
    Core.brandingTextComponent = {
        bindings: {
            key: '@'
        },
        template: '{{$ctrl.value}}',
        controller: BrandingTextController
    };
})(Core || (Core = {}));
/// <reference path="branding/branding-image.component.ts"/>
/// <reference path="branding/branding-text.component.ts"/>
/// <reference path="config.ts"/>
/// <reference path="config-manager.ts"/>
var Core;
(function (Core) {
    initConfigManager.$inject = ["$provide"];
    applyBranding.$inject = ["configManager"];
    Core.configModule = angular
        .module('hawtio-config', [])
        .config(initConfigManager)
        .component('hawtioBrandingImage', Core.brandingImageComponent)
        .component('hawtioBrandingText', Core.brandingTextComponent)
        .run(applyBranding)
        .name;
    function initConfigManager($provide) {
        'ngInject';
        var config = window['hawtconfig'];
        var configManager = new Core.ConfigManager(config);
        $provide.constant('configManager', configManager);
        delete window['hawtconfig'];
    }
    function applyBranding(configManager) {
        'ngInject';
        var branding = configManager.branding;
        if (!branding) {
            return;
        }
        if (branding.appName) {
            Core.log.info('Updating title', '-', branding.appName);
            document.title = branding.appName;
        }
        if (branding.css) {
            updateHref('#branding', branding.css);
        }
        if (branding.favicon) {
            updateHref('#favicon', branding.favicon);
        }
    }
    Core.applyBranding = applyBranding;
    function updateHref(id, path) {
        Core.log.info('Updating href for', id, '-', path);
        var elm = $(id);
        elm.prop('disabled', true);
        elm.attr({ href: path });
        elm.prop('disabled', false);
    }
})(Core || (Core = {}));
var Core;
(function (Core) {
    function configLoader(next) {
        Core.log.info('Loading hawtconfig.json...');
        $.getJSON('hawtconfig.json')
            .done(function (config) {
            window['hawtconfig'] = config;
            Core.log.info('hawtconfig.json loaded');
        })
            .fail(function (jqxhr, textStatus, errorThrown) {
            Core.log.error("Error fetching 'hawtconfig.json'. Status: '" + textStatus + "'. Error: '" + errorThrown + "'");
        })
            .always(function () {
            next();
        });
    }
    Core.configLoader = configLoader;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HumanizeService = /** @class */ (function () {
        function HumanizeService() {
        }
        HumanizeService.prototype.toUpperCase = function (str) {
            return _.upperCase(str);
        };
        HumanizeService.prototype.toLowerCase = function (str) {
            return _.lowerCase(str);
        };
        HumanizeService.prototype.toSentenceCase = function (str) {
            return _.capitalize(_.lowerCase(str));
        };
        HumanizeService.prototype.toTitleCase = function (str) {
            return _.startCase(_.lowerCase(str));
        };
        return HumanizeService;
    }());
    Core.HumanizeService = HumanizeService;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PatternFlyService = /** @class */ (function () {
        function PatternFlyService() {
        }
        PatternFlyService.prototype.filter = function (items, filterConfig) {
            var filteredItems = items;
            if (filterConfig.appliedFilters) {
                filterConfig.appliedFilters.forEach(function (filter) {
                    var filterType = _.find(filterConfig.fields, { 'id': filter.id })['filterType'];
                    switch (filterType) {
                        case 'text':
                            var regExp_1 = new RegExp(filter.value, 'i');
                            filteredItems = filteredItems.filter(function (item) { return regExp_1.test(item[filter.id]); });
                            break;
                        case 'number':
                            filteredItems = filteredItems.filter(function (item) { return item[filter.id] === parseInt(filter.value); });
                            break;
                        case 'select':
                            filteredItems = filteredItems.filter(function (item) { return item[filter.id] === filter.value; });
                            break;
                    }
                });
            }
            filterConfig.resultsCount = filteredItems.length;
            return filteredItems;
        };
        return PatternFlyService;
    }());
    Core.PatternFlyService = PatternFlyService;
})(Core || (Core = {}));
/// <reference path="humanize/humanize.service.ts"/>
/// <reference path="patternfly/patternfly.service.ts"/>
var Core;
(function (Core) {
    Core._module = angular
        .module('hawtio-core', [])
        .service('humanizeService', Core.HumanizeService)
        .service('patternFlyService', Core.PatternFlyService);
    Core.coreModule = Core._module.name;
    Core.log = Logger.get(Core.coreModule);
})(Core || (Core = {}));
var Bootstrap;
(function (Bootstrap) {
    // hawtio log initialization
    // globals Logger window console document localStorage $ angular jQuery navigator Jolokia
    Logger.setLevel(Logger.INFO);
    Logger.storagePrefix = 'hawtio';
    Logger.oldGet = Logger.get;
    Logger.loggers = {};
    Logger.get = function (name) {
        var answer = Logger.oldGet(name);
        Logger.loggers[name] = answer;
        return answer;
    };
    // we'll default to 100 statements I guess...
    window['LogBuffer'] = 100;
    if ('localStorage' in window) {
        if (!('logLevel' in window.localStorage)) {
            window.localStorage['logLevel'] = JSON.stringify(Logger.INFO);
        }
        var logLevel = Logger.DEBUG;
        try {
            logLevel = JSON.parse(window.localStorage['logLevel']);
        }
        catch (e) {
            console.error("Failed to parse log level setting: ", e);
        }
        Logger.setLevel(logLevel);
        if ('showLog' in window.localStorage) {
            var showLog = window.localStorage['showLog'];
            if (showLog === 'true') {
                var container = document.getElementById("log-panel");
                if (container) {
                    container.setAttribute("style", "bottom: 50%;");
                }
            }
        }
        if ('logBuffer' in window.localStorage) {
            var logBuffer = window.localStorage['logBuffer'];
            window['LogBuffer'] = parseInt(logBuffer, 10);
        }
        else {
            window.localStorage['logBuffer'] = window['LogBuffer'];
        }
        if ('childLoggers' in window.localStorage) {
            try {
                var childLoggers = JSON.parse(localStorage['childLoggers']);
                childLoggers.forEach(function (childLogger) {
                    Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
                });
            }
            catch (e) {
            }
        }
    }
    var consoleLogger = null;
    if ('console' in window) {
        window['JSConsole'] = window.console;
        consoleLogger = function (messages, context) {
            var MyConsole = window['JSConsole'];
            var hdlr = MyConsole.log;
            // Prepend the logger's name to the log message for easy identification.
            if (context.name) {
                messages[0] = "[" + context.name + "] " + messages[0];
            }
            // Delegate through to custom warn/error loggers if present on the console.
            if (context.level === Logger.WARN && 'warn' in MyConsole) {
                hdlr = MyConsole.warn;
            }
            else if (context.level === Logger.ERROR && 'error' in MyConsole) {
                hdlr = MyConsole.error;
            }
            else if (context.level === Logger.INFO && 'info' in MyConsole) {
                hdlr = MyConsole.info;
            }
            if (hdlr && hdlr.apply) {
                try {
                    hdlr.apply(MyConsole, messages);
                }
                catch (e) {
                    MyConsole.log(messages);
                }
            }
        };
    }
    // keep these hidden in the Logger object
    Logger.getType = function (obj) { return _.toString(obj).slice(8, -1); };
    Logger.isError = function (obj) { return obj && Logger.getType(obj) === 'Error'; };
    Logger.isArray = function (obj) { return obj && Logger.getType(obj) === 'Array'; };
    Logger.isObject = function (obj) { return obj && Logger.getType(obj) === 'Object'; };
    Logger.isString = function (obj) { return obj && Logger.getType(obj) === 'String'; };
    window['logInterceptors'] = [];
    Logger.formatStackTraceString = function (stack) {
        var lines = stack.split("\n");
        if (lines.length > 100) {
            // too many lines, let's snip the middle so the browser doesn't bail
            var start = 20;
            var amount = lines.length - start * 2;
            lines.splice(start, amount, '>>> snipped ' + amount + ' frames <<<');
        }
        var stackTrace = "<div class=\"log-stack-trace\">\n";
        for (var j = 0; j < lines.length; j++) {
            var line = lines[j];
            if (line.trim().length === 0) {
                continue;
            }
            stackTrace = stackTrace + "<p>" + line + "</p>\n";
        }
        stackTrace = stackTrace + "</div>\n";
        return stackTrace;
    };
    Logger.setHandler(function (messages, context) {
        var node = undefined;
        var panel = undefined;
        var container = document.getElementById("hawtio-log-panel");
        if (container) {
            panel = document.getElementById("hawtio-log-panel-statements");
            node = document.createElement("li");
        }
        var text = "";
        var postLog = [];
        // try and catch errors logged via console.error(e.toString) and reformat
        if (context['level'].name === 'ERROR' && messages.length === 1) {
            if (Logger.isString(messages[0])) {
                var message = messages[0];
                var messageSplit = message.split(/\n/);
                if (messageSplit.length > 1) {
                    // we may have more cases that require normalizing, so a more flexible solution
                    // may be needed
                    var lookFor = "Error: Jolokia-Error: ";
                    if (messageSplit[0].search(lookFor) === 0) {
                        var msg = messageSplit[0].slice(lookFor.length);
                        window['JSConsole'].info("msg: ", msg);
                        try {
                            var errorObject = JSON.parse(msg);
                            var error = new Error();
                            error.message = errorObject['error'];
                            error.stack = errorObject['stacktrace'].replace("\\t", "&nbsp;&nbsp").replace("\\n", "\n");
                            messages = [error];
                        }
                        catch (e) {
                            // we'll just bail and let it get logged as a string...
                        }
                    }
                    else {
                        var error = new Error();
                        error.message = messageSplit[0];
                        error.stack = message;
                        messages = [error];
                    }
                }
            }
        }
        var scroll = false;
        if (node) {
            var _loop_1 = function (i) {
                var message = messages[i];
                if (Logger.isArray(message) || Logger.isObject(message)) {
                    var obj = "";
                    try {
                        obj = '<pre data-language="javascript">' + JSON.stringify(message, null, 2) + '</pre>';
                    }
                    catch (error) {
                        obj = message + " (failed to convert) ";
                        // silently ignore, could be a circular object...
                    }
                    text = text + obj;
                }
                else if (Logger.isError(message)) {
                    if ('message' in message) {
                        text = text + message['message'];
                    }
                    if ('stack' in message) {
                        postLog.push(function () {
                            var stackTrace = Logger.formatStackTraceString(message['stack']);
                            var logger = context.name ? Logger.get(context.name) : Logger;
                            logger.info("Stack trace:", stackTrace);
                        });
                    }
                }
                else {
                    text = text + message;
                }
            };
            for (var i = 0; i < messages.length; i++) {
                _loop_1(i);
            }
            if (context.name) {
                text = "[<span class=\"green\">" + context.name + "</span>] " + text;
            }
            node.innerHTML = text;
            node.className = context.level.name;
            if (container) {
                if (container.scrollHeight === 0) {
                    scroll = true;
                }
                if (panel.scrollTop > (panel.scrollHeight - container.scrollHeight - 200)) {
                    scroll = true;
                }
            }
        }
        // on add
        if (panel && node) {
            panel.appendChild(node);
            if (panel.childNodes.length > parseInt(window['LogBuffer'])) {
                panel.removeChild(panel.firstChild);
            }
            if (scroll) {
                panel.scrollTop = panel.scrollHeight;
            }
        }
        if (consoleLogger) {
            consoleLogger(messages, context);
        }
        var interceptors = window['logInterceptors'];
        for (var i = 0; i < interceptors.length; i++) {
            interceptors[i](context.level.name, text);
        }
        postLog.forEach(function (func) { return func(); });
    });
})(Bootstrap || (Bootstrap = {}));
var Core;
(function (Core) {
    /*
    * Plugin loader and discovery mechanism for hawtio
    */
    var PluginLoader = /** @class */ (function () {
        function PluginLoader() {
            var _this = this;
            this.bootstrapEl = document.documentElement;
            this.loaderCallback = null;
            /**
             * List of URLs that the plugin loader will try and discover
             * plugins from
             */
            this.urls = [];
            /**
             * Holds all of the angular modules that need to be bootstrapped
             */
            this.modules = [];
            /**
             * Tasks to be run before bootstrapping, tasks can be async.
             * Supply a function that takes the next task to be
             * executed as an argument and be sure to call the passed
             * in function.
             */
            this.tasks = [];
            this.runs = 0;
            this.executedTasks = [];
            this.deferredTasks = [];
            this.bootstrapTask = {
                name: 'HawtioBootstrap',
                depends: '*',
                task: function (next) {
                    if (_this.deferredTasks.length > 0) {
                        Core.log.info("Tasks yet to run:");
                        _this.listTasks(_this.deferredTasks);
                        _this.runs = _this.runs + 1;
                        Core.log.info("Task list restarted:", _this.runs, "times");
                        if (_this.runs === 5) {
                            Core.log.info("Orphaned tasks:");
                            _this.listTasks(_this.deferredTasks);
                            _this.deferredTasks.length = 0;
                        }
                        else {
                            _this.deferredTasks.push(_this.bootstrapTask);
                        }
                    }
                    Core.log.debug("Executed tasks:", _this.executedTasks);
                    next();
                }
            };
            this.setLoaderCallback({
                scriptLoaderCallback: function (self, total, remaining) {
                    Core.log.debug("Total scripts:", total, "Remaining:", remaining);
                },
                urlLoaderCallback: function (self, total, remaining) {
                    Core.log.debug("Total URLs:", total, "Remaining:", remaining);
                }
            });
        }
        /**
         * Set the HTML element that the plugin loader will pass to angular.bootstrap
         */
        PluginLoader.prototype.setBootstrapElement = function (el) {
            Core.log.debug("Setting bootstrap element to:", el);
            this.bootstrapEl = el;
            return this;
        };
        /**
         * Get the HTML element used for angular.bootstrap
         */
        PluginLoader.prototype.getBootstrapElement = function () {
            return this.bootstrapEl;
        };
        /**
         * Register a function to be executed after scripts are loaded but
         * before the app is bootstrapped.
         *
         * 'task' can either be a simple function or a PreBootstrapTask object
         */
        PluginLoader.prototype.registerPreBootstrapTask = function (task, front) {
            var taskToAdd;
            if (angular.isFunction(task)) {
                Core.log.debug("Adding legacy task");
                taskToAdd = {
                    task: task
                };
            }
            else {
                taskToAdd = task;
            }
            if (!taskToAdd.name) {
                taskToAdd.name = 'unnamed-task-' + (this.tasks.length + 1);
            }
            if (taskToAdd.depends && !_.isArray(taskToAdd.depends) && taskToAdd.depends !== '*') {
                taskToAdd.depends = [taskToAdd.depends];
            }
            if (!front) {
                this.tasks.push(taskToAdd);
            }
            else {
                this.tasks.unshift(taskToAdd);
            }
            return this;
        };
        /**
         * Add an angular module to the list of modules to bootstrap
         */
        PluginLoader.prototype.addModule = function (module) {
            Core.log.debug("Adding module:", module);
            this.modules.push(module);
            return this;
        };
        ;
        /**
         * Add a URL for discovering plugins.
         */
        PluginLoader.prototype.addUrl = function (url) {
            Core.log.debug("Adding URL:", url);
            this.urls.push(url);
            return this;
        };
        ;
        /**
         * Return the current list of configured modules.
         *
         * It is invoked from HawtioCore's bootstrapping.
         */
        PluginLoader.prototype.getModules = function () {
            return this.modules;
        };
        /**
         * Set a callback to be notified as URLs are checked and plugin
         * scripts are downloaded
         */
        PluginLoader.prototype.setLoaderCallback = function (callback) {
            this.loaderCallback = callback;
            return this;
        };
        /**
         * Downloads plugins at any configured URLs and bootstraps the app.
         *
         * It is invoked from HawtioCore's bootstrapping.
         */
        PluginLoader.prototype.loadPlugins = function (callback) {
            var _this = this;
            Core.log.info("Bootstrapping Hawtio app...");
            var plugins = {};
            var counter = {
                total: this.urls.length,
                remain: this.urls.length
            };
            if (counter.total === 0) {
                this.loadScripts(plugins, callback);
                return;
            }
            var regex = new RegExp(/^jolokia:/);
            this.urls.forEach(function (url, index) {
                if (regex.test(url)) {
                    var parts = url.split(':');
                    parts = parts.reverse();
                    parts.pop();
                    url = parts.pop();
                    var attribute = parts.reverse().join(':');
                    var jolokia = new Jolokia(url);
                    try {
                        var data = jolokia.getAttribute(attribute, null);
                        $.extend(plugins, data);
                    }
                    catch (Exception) {
                        // ignore
                    }
                    _this.urlLoaded(plugins, counter, callback);
                }
                else {
                    Core.log.debug("Trying url:", url);
                    $.get(url, function (data) {
                        if (angular.isString(data)) {
                            try {
                                data = angular.fromJson(data);
                            }
                            catch (error) {
                                // ignore this source of plugins
                                return;
                            }
                        }
                        $.extend(plugins, data);
                    }).always(function () { return _this.urlLoaded(plugins, counter, callback); });
                }
            });
        };
        PluginLoader.prototype.urlLoaded = function (plugins, counter, callback) {
            counter.remain = counter.remain - 1;
            if (this.loaderCallback) {
                this.loaderCallback.urlLoaderCallback(this.loaderCallback, counter.total, counter.remain + 1);
            }
            if (counter.remain === 0) {
                this.loadScripts(plugins, callback);
            }
        };
        PluginLoader.prototype.loadScripts = function (plugins, callback) {
            var _this = this;
            // keep track of when scripts are loaded so we can execute the callback
            var loaded = 0;
            _.forOwn(plugins, function (data, key) {
                loaded = loaded + data.Scripts.length;
            });
            var totalScripts = loaded;
            var scriptLoaded = function () {
                $.ajaxSetup({ async: true });
                loaded = loaded - 1;
                if (_this.loaderCallback) {
                    _this.loaderCallback.scriptLoaderCallback(_this.loaderCallback, totalScripts, loaded + 1);
                }
                if (loaded === 0) {
                    _this.bootstrap(callback);
                }
            };
            if (loaded > 0) {
                _.forOwn(plugins, function (data, key) {
                    data.Scripts.forEach(function (script) {
                        var scriptName = data.Context + "/" + script;
                        Core.log.debug("Fetching script:", scriptName);
                        $.ajaxSetup({ async: false });
                        $.getScript(scriptName)
                            .done(function (textStatus) {
                            Core.log.debug("Loaded script:", scriptName);
                        })
                            .fail(function (jqxhr, settings, exception) {
                            Core.log.info("Failed loading script: \"", exception.message, "\" (<a href=\"", scriptName, ":", exception.lineNumber, "\">", scriptName, ":", exception.lineNumber, "</a>)");
                        })
                            .always(scriptLoaded);
                    });
                });
            }
            else {
                // no scripts to load, so just do the callback
                $.ajaxSetup({ async: true });
                this.bootstrap(callback);
            }
        };
        PluginLoader.prototype.bootstrap = function (callback) {
            var _this = this;
            this.registerPreBootstrapTask(this.bootstrapTask);
            setTimeout(function () { return _this.executeTasks(callback); }, 1);
        };
        PluginLoader.prototype.executeTasks = function (callback) {
            var _this = this;
            var taskObject = null;
            var tmp = [];
            // if we've executed all of the tasks, let's drain any deferred tasks
            // into the regular task queue
            if (this.tasks.length === 0) {
                taskObject = this.deferredTasks.shift();
            }
            // first check and see what tasks have executed and see if we can pull a task
            // from the deferred queue
            while (!taskObject && this.deferredTasks.length > 0) {
                var task = this.deferredTasks.shift();
                if (task.depends === '*') {
                    if (this.tasks.length > 0) {
                        tmp.push(task);
                    }
                    else {
                        taskObject = task;
                    }
                }
                else {
                    var intersect = this.intersection(this.executedTasks, task.depends);
                    if (intersect.length === task.depends.length) {
                        taskObject = task;
                    }
                    else {
                        tmp.push(task);
                    }
                }
            }
            if (tmp.length > 0) {
                tmp.forEach(function (task) { return _this.deferredTasks.push(task); });
            }
            // no deferred tasks to execute, let's get a new task
            if (!taskObject) {
                taskObject = this.tasks.shift();
            }
            // check if task has dependencies
            if (taskObject && taskObject.depends && this.tasks.length > 0) {
                Core.log.debug("Task '" + taskObject.name + "' has dependencies:", taskObject.depends);
                if (taskObject.depends === '*') {
                    if (this.tasks.length > 0) {
                        Core.log.debug("Task '" + taskObject.name + "' wants to run after all other tasks, deferring");
                        this.deferredTasks.push(taskObject);
                        this.executeTasks(callback);
                        return;
                    }
                }
                else {
                    var intersect = this.intersection(this.executedTasks, taskObject.depends);
                    if (intersect.length != taskObject.depends.length) {
                        Core.log.debug("Deferring task: '" + taskObject.name + "'");
                        this.deferredTasks.push(taskObject);
                        this.executeTasks(callback);
                        return;
                    }
                }
            }
            if (taskObject) {
                Core.log.debug("Executing task: '" + taskObject.name + "'");
                var called = false;
                var next_1 = function () {
                    if (next_1['notFired']) {
                        next_1['notFired'] = false;
                        _this.executedTasks.push(taskObject.name);
                        setTimeout(function () { return _this.executeTasks(callback); }, 1);
                    }
                };
                next_1['notFired'] = true;
                taskObject.task(next_1);
            }
            else {
                Core.log.debug("All tasks executed");
                setTimeout(callback, 1);
            }
        };
        PluginLoader.prototype.listTasks = function (tasks) {
            tasks.forEach(function (task) {
                return Core.log.info("  name:", task.name, "depends:", task.depends);
            });
        };
        PluginLoader.prototype.intersection = function (search, needle) {
            if (!Array.isArray(needle)) {
                needle = [needle];
            }
            var answer = [];
            needle.forEach(function (n) {
                search.forEach(function (s) {
                    if (n === s) {
                        answer.push(s);
                    }
                });
            });
            return answer;
        };
        /**
         * Dumps the current list of configured modules and URLs to the console
         */
        PluginLoader.prototype.debug = function () {
            Core.log.debug("urls and modules");
            Core.log.debug(this.urls);
            Core.log.debug(this.modules);
        };
        ;
        return PluginLoader;
    }());
    Core.PluginLoader = PluginLoader;
})(Core || (Core = {}));
/// <reference path="core.module.ts"/>
/// <reference path="logging-init.ts"/>
/// <reference path="plugin-loader.ts"/>
/*
 * Plugin loader and discovery mechanism for hawtio
 */
var hawtioPluginLoader = new Core.PluginLoader();
// Hawtio core plugin responsible for bootstrapping a hawtio app
var HawtioCore = (function () {
    'use strict';
    function HawtioCoreClass() {
    }
    /**
     * The app's injector, set once bootstrap is completed
     */
    Object.defineProperty(HawtioCoreClass.prototype, "injector", {
        get: function () {
            if (HawtioCore.UpgradeAdapter) {
                return HawtioCore.UpgradeAdapter.ng1Injector;
            }
            return HawtioCore._injector;
        },
        enumerable: true,
        configurable: true
    });
    var HawtioCore = new HawtioCoreClass();
    Core._module
        .config(["$locationProvider", function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }])
        .run(['documentBase', function (documentBase) { return Core.log.debug("HawtioCore loaded at", documentBase); }]);
    var dummyLocalStorage = {
        length: 0,
        key: function (index) { return undefined; },
        getItem: function (key) { return dummyLocalStorage[key]; },
        setItem: function (key, data) { return dummyLocalStorage[key] = data; },
        removeItem: function (key) {
            var removed = dummyLocalStorage[key];
            delete dummyLocalStorage[key];
            return removed;
        },
        clear: function () { }
    };
    HawtioCore.dummyLocalStorage = dummyLocalStorage;
    HawtioCore.documentBase = function () {
        var base = $('head').find('base');
        var answer = '/';
        if (base && base.length > 0) {
            answer = base.attr('href');
        }
        else {
            Core.log.warn("Document is missing a 'base' tag, defaulting to '/'");
        }
        return answer;
    };
    /**
     * services, mostly stubs
     */
    Core._module
        // localStorage service, returns a dummy impl
        // if for some reason it's not in the window
        // object
        .factory('localStorage', function () { return window.localStorage || dummyLocalStorage; })
        // Holds the document base so plugins can easily
        // figure out absolute URLs when needed
        .factory('documentBase', function () { return HawtioCore.documentBase(); })
        // Holds a mapping of plugins to layouts, plugins use 
        // this to specify a full width view, tree view or their 
        // own custom view
        .factory('viewRegistry', function () {
        return {};
    })
        // Placeholder service for the page title service
        .factory('pageTitle', function () {
        return {
            addTitleElement: function () { },
            getTitle: function () { return undefined; },
            getTitleWithSeparator: function () { return undefined; },
            getTitleExcluding: function () { return undefined; },
            getTitleArrayExcluding: function () { return undefined; }
        };
    })
        // service for the javascript object that does notifications
        .factory('toastr', ["$window", function ($window) {
            var answer = $window.toastr;
            if (!answer) {
                // lets avoid any NPEs
                answer = {};
                $window.toastr = answer;
            }
            return answer;
        }]).factory('HawtioDashboard', function () {
        return {
            hasDashboard: false,
            inDashboard: false,
            getAddLink: function () { return ''; }
        };
    });
    // bootstrap the app
    $(function () {
        jQuery['uaMatch'] = function (ua) {
            ua = ua.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };
        // Don't clobber any existing jQuery['browser'] in case it's different
        if (!jQuery['browser']) {
            var matched = jQuery['uaMatch'](navigator.userAgent);
            var browser = {};
            if (matched.browser) {
                browser[matched.browser] = true;
                browser['version'] = matched.version;
            }
            // Chrome is Webkit, but Webkit is also Safari.
            if (browser['chrome']) {
                browser['webkit'] = true;
            }
            else if (browser['webkit']) {
                browser['safari'] = true;
            }
            jQuery['browser'] = browser;
        }
        if (window['ng'] && window['ng']['upgrade']) {
            // Create this here so that plugins can use pre-bootstrap tasks
            // to add providers
            HawtioCore.UpgradeAdapter = new ng['upgrade'].UpgradeAdapter();
        }
        hawtioPluginLoader.loadPlugins(function () {
            if (HawtioCore.injector || HawtioCore.UpgradeAdapterRef) {
                Core.log.debug("Application already bootstrapped");
                return;
            }
            var bootstrapEl = hawtioPluginLoader.getBootstrapElement();
            Core.log.debug("Using bootstrap element:", bootstrapEl);
            // bootstrap in hybrid mode if angular2 is detected
            if (HawtioCore.UpgradeAdapter) {
                Core.log.debug("ngUpgrade detected, bootstrapping in Angular 1/2 hybrid mode");
                HawtioCore.UpgradeAdapterRef = HawtioCore.UpgradeAdapter.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
                HawtioCore._injector = HawtioCore.UpgradeAdapterRef.ng1Injector;
            }
            else {
                HawtioCore._injector = angular.bootstrap(bootstrapEl, hawtioPluginLoader.getModules(), { strictDi: true });
            }
            Core.log.debug("Bootstrapped application");
        });
    });
    return HawtioCore;
})();
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-tasks");
    var Tasks = /** @class */ (function () {
        function Tasks(name) {
            this.name = name;
            this.tasks = {};
            this.tasksExecuted = false;
        }
        Tasks.prototype.addTask = function (name, task) {
            this.tasks[name] = task;
            if (this.tasksExecuted) {
                this.executeTask(name, task);
            }
            return this;
        };
        Tasks.prototype.execute = function (callback) {
            var _this = this;
            log.debug("Executing tasks:", this.name);
            if (this.tasksExecuted) {
                return;
            }
            _.forOwn(this.tasks, function (task, name) { return _this.executeTask(name, task); });
            this.tasksExecuted = true;
            if (!_.isNil(callback)) {
                callback();
            }
        };
        Tasks.prototype.executeTask = function (name, task) {
            if (_.isNull(task)) {
                return;
            }
            log.debug("Executing task:", name);
            try {
                task();
            }
            catch (error) {
                log.debug("Failed to execute task:", name, "error:", error);
            }
        };
        Tasks.prototype.reset = function () {
            this.tasksExecuted = false;
        };
        return Tasks;
    }());
    Core.Tasks = Tasks;
    var ParameterizedTasks = /** @class */ (function (_super) {
        __extends(ParameterizedTasks, _super);
        function ParameterizedTasks(name) {
            var _this = _super.call(this, name) || this;
            _this.tasks = {};
            return _this;
        }
        ParameterizedTasks.prototype.addTask = function (name, task) {
            this.tasks[name] = task;
            return this;
        };
        ParameterizedTasks.prototype.execute = function () {
            var _this = this;
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            log.debug("Executing tasks:", this.name);
            if (this.tasksExecuted) {
                return;
            }
            _.forOwn(this.tasks, function (task, name) { return _this.executeParameterizedTask(name, task, params); });
            this.tasksExecuted = true;
            this.reset();
        };
        ParameterizedTasks.prototype.executeParameterizedTask = function (name, task, params) {
            if (_.isNull(task)) {
                return;
            }
            log.debug("Executing task:", name, "with parameters:", params);
            try {
                task.apply(task, params);
            }
            catch (e) {
                log.debug("Failed to execute task:", name, "error:", e);
            }
        };
        return ParameterizedTasks;
    }(Tasks));
    Core.ParameterizedTasks = ParameterizedTasks;
})(Core || (Core = {}));
/// <reference path="tasks.ts"/>
var Core;
(function (Core) {
    initializeTasks.$inject = ["$rootScope", "locationChangeStartTasks", "postLoginTasks", "preLogoutTasks", "postLogoutTasks"];
    Core.eventServicesModule = angular
        .module('hawtio-core-event-services', [])
        // service to register tasks that should happen when the URL changes
        .factory('locationChangeStartTasks', function () { return new Core.ParameterizedTasks('LocationChangeStartTasks'); })
        // service to register stuff that should happen when the user logs in
        .factory('postLoginTasks', function () { return new Core.Tasks('PostLogin'); })
        // service to register stuff that should happen when the user logs out
        .factory('preLogoutTasks', function () { return new Core.Tasks('PreLogout'); })
        // service to register stuff that should happen after the user logs out
        .factory('postLogoutTasks', function () { return new Core.Tasks('PostLogout'); })
        .run(initializeTasks)
        .name;
    function initializeTasks($rootScope, locationChangeStartTasks, postLoginTasks, preLogoutTasks, postLogoutTasks) {
        'ngInject';
        // Reset pre/post-logout tasks after login
        postLoginTasks
            .addTask("ResetPreLogoutTasks", function () { return preLogoutTasks.reset(); })
            .addTask("ResetPostLogoutTasks", function () { return postLogoutTasks.reset(); });
        // Reset pre-login tasks before logout
        preLogoutTasks
            .addTask("ResetPostLoginTasks", function () { return postLoginTasks.reset(); });
        $rootScope.$on('$locationChangeStart', function ($event, newUrl, oldUrl) {
            return locationChangeStartTasks.execute($event, newUrl, oldUrl);
        });
        Core.log.debug("Event services loaded");
    }
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HawtioExtension = /** @class */ (function () {
        function HawtioExtension() {
            this._registeredExtensions = {};
        }
        HawtioExtension.prototype.add = function (extensionPointName, fn) {
            if (!this._registeredExtensions[extensionPointName]) {
                this._registeredExtensions[extensionPointName] = [];
            }
            this._registeredExtensions[extensionPointName].push(fn);
        };
        HawtioExtension.prototype.render = function (extensionPointName, element, scope) {
            var fns = this._registeredExtensions[extensionPointName];
            if (!fns) {
                return;
            }
            for (var i = 0; i < fns.length; i++) {
                var toAppend = fns[i](scope);
                if (!toAppend) {
                    return;
                }
                if (typeof toAppend == "string") {
                    toAppend = document.createTextNode(toAppend);
                }
                element.append(toAppend);
            }
        };
        return HawtioExtension;
    }());
    Core.HawtioExtension = HawtioExtension;
})(Core || (Core = {}));
/// <reference path="hawtio-extension.ts"/>
var Core;
(function (Core) {
    hawtioExtensionDirective.$inject = ["HawtioExtension"];
    function hawtioExtensionDirective(HawtioExtension) {
        'ngInject';
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                if (attrs.name) {
                    HawtioExtension.render(attrs.name, element, scope);
                }
            }
        };
    }
    Core.hawtioExtensionDirective = hawtioExtensionDirective;
})(Core || (Core = {}));
/// <reference path="hawtio-extension.ts"/>
/// <reference path="hawtio-extension.directive.ts"/>
var Core;
(function (Core) {
    Core.hawtioExtensionModule = angular
        .module('hawtio-extension-service', [])
        .service('HawtioExtension', Core.HawtioExtension)
        .directive('hawtioExtension', Core.hawtioExtensionDirective)
        .name;
})(Core || (Core = {}));
var Help;
(function (Help) {
    var HelpTopic = /** @class */ (function () {
        function HelpTopic() {
        }
        HelpTopic.prototype.isIndexTopic = function () {
            return this.topicName === 'index';
        };
        return HelpTopic;
    }());
    Help.HelpTopic = HelpTopic;
})(Help || (Help = {}));
/// <reference path="help-topic.ts"/>
var Help;
(function (Help) {
    var HelpRegistry = /** @class */ (function () {
        HelpRegistry.$inject = ["$rootScope"];
        function HelpRegistry($rootScope) {
            'ngInject';
            this.$rootScope = $rootScope;
            this.topicNameMappings = {
                activemq: 'ActiveMQ',
                camel: 'Camel',
                jboss: 'JBoss',
                jclouds: 'jclouds',
                jmx: 'JMX',
                jvm: 'Connect',
                log: 'Logs',
                openejb: 'OpenEJB',
                osgi: 'OSGi'
            };
            this.subTopicNameMappings = {
                user: 'User Guide',
                developer: 'Developers',
                faq: 'FAQ',
                changes: 'Change Log'
            };
            this.topics = [];
        }
        HelpRegistry.prototype.addUserDoc = function (topicName, path, isValid) {
            this.addSubTopic(topicName, 'user', path, isValid);
        };
        HelpRegistry.prototype.addDevDoc = function (topicName, path, isValid) {
            this.addSubTopic(topicName, 'developer', path, isValid);
        };
        HelpRegistry.prototype.addSubTopic = function (topicName, subtopic, path, isValid) {
            this.getOrCreateTopic(topicName, subtopic, path, isValid);
        };
        HelpRegistry.prototype.getOrCreateTopic = function (topicName, subTopicName, path, isValid) {
            if (isValid === void 0) { isValid = function () { return true; }; }
            var topic = this.getTopic(topicName, subTopicName);
            if (!angular.isDefined(topic)) {
                topic = new Help.HelpTopic();
                topic.topicName = topicName;
                topic.subTopicName = subTopicName;
                topic.path = path;
                topic.isValid = isValid;
                topic.label = topic.isIndexTopic() ? this.getLabel(subTopicName) : this.getLabel(topicName);
                this.topics.push(topic);
                this.$rootScope.$broadcast('hawtioNewHelpTopic');
            }
            return topic;
        };
        HelpRegistry.prototype.getLabel = function (name) {
            if (angular.isDefined(this.topicNameMappings[name])) {
                return this.topicNameMappings[name];
            }
            if (angular.isDefined(this.subTopicNameMappings[name])) {
                return this.subTopicNameMappings[name];
            }
            return name;
        };
        HelpRegistry.prototype.getTopics = function () {
            return this.topics.filter(function (topic) { return topic.isValid(); });
        };
        HelpRegistry.prototype.getTopic = function (topicName, subTopicName) {
            return this.topics.filter(function (topic) {
                return topic.topicName === topicName && topic.subTopicName === subTopicName;
            })[0];
        };
        return HelpRegistry;
    }());
    Help.HelpRegistry = HelpRegistry;
})(Help || (Help = {}));
/// <reference path="help-registry.ts"/>
/// <reference path="help-topic.ts"/>
var Help;
(function (Help) {
    var HelpService = /** @class */ (function () {
        HelpService.$inject = ["$templateCache", "helpRegistry"];
        function HelpService($templateCache, helpRegistry) {
            'ngInject';
            this.$templateCache = $templateCache;
            this.helpRegistry = helpRegistry;
            marked.setOptions({
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: true,
                sanitize: false,
                smartLists: true,
                langPrefix: 'language-'
            });
        }
        HelpService.prototype.getTopics = function () {
            return this.helpRegistry.getTopics().filter(function (topic) { return topic.isIndexTopic(); });
        };
        HelpService.prototype.getSubTopics = function (topic) {
            var otherSubTopics = this.helpRegistry.getTopics().filter(function (t) { return !t.isIndexTopic() &&
                t.subTopicName === topic.subTopicName; });
            otherSubTopics = _.sortBy(otherSubTopics, 'label');
            return __spreadArrays([topic], otherSubTopics);
        };
        HelpService.prototype.getTopic = function (topicName, subTopicName) {
            return this.helpRegistry.getTopic(topicName, subTopicName);
        };
        HelpService.prototype.getHelpContent = function (topic) {
            if (!angular.isDefined(topic)) {
                return "\n          <h3 id=\"error\">Error</h3>\n          <div class=\"alert alert-danger\">\n            <span class=\"pficon pficon-error-circle-o\"></span>\n            Help data is not defined for <code>" + topic.path + "</code>\n          </div>";
            }
            else {
                var template = this.$templateCache.get(topic.path);
                if (template) {
                    return marked(template);
                }
                else {
                    return "\n            <h3 id=\"error\">Error</h3>\n            <div class=\"alert alert-danger\">\n              <span class=\"pficon pficon-error-circle-o\"></span>\n              Unable to display help data for <code>" + topic.path + "</code>\n            </div>";
                }
            }
        };
        return HelpService;
    }());
    Help.HelpService = HelpService;
})(Help || (Help = {}));
/// <reference path="help.service.ts"/>
var Help;
(function (Help) {
    var HelpController = /** @class */ (function () {
        HelpController.$inject = ["$rootScope", "helpService", "$sce"];
        function HelpController($rootScope, helpService, $sce) {
            'ngInject';
            this.helpService = helpService;
            this.$sce = $sce;
        }
        HelpController.prototype.$onInit = function () {
            this.topics = this.helpService.getTopics();
            this.onSelectTopic(this.helpService.getTopic('index', 'user'));
        };
        HelpController.prototype.onSelectTopic = function (topic) {
            this.selectedTopic = topic;
            this.subTopics = this.helpService.getSubTopics(topic);
            this.onSelectSubTopic(this.subTopics[0]);
        };
        HelpController.prototype.onSelectSubTopic = function (subTopic) {
            this.selectedSubTopic = subTopic;
            this.html = this.$sce.trustAsHtml(this.helpService.getHelpContent(subTopic));
        };
        return HelpController;
    }());
    Help.HelpController = HelpController;
    Help.helpComponent = {
        templateUrl: 'help/help.component.html',
        controller: HelpController
    };
})(Help || (Help = {}));
var Help;
(function (Help) {
    configureRoutes.$inject = ["$routeProvider"];
    configureDocumentation.$inject = ["helpRegistry", "$templateCache"];
    configureMenu.$inject = ["HawtioExtension", "$compile"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider.when('/help', { template: '<help></help>' });
    }
    Help.configureRoutes = configureRoutes;
    function configureDocumentation(helpRegistry, $templateCache) {
        'ngInject';
        helpRegistry.addUserDoc('index', 'help/help.md');
        // These docs live in the main hawtio project
        helpRegistry.addSubTopic('index', 'faq', 'plugins/help/doc/FAQ.md', function () {
            return $templateCache.get('plugins/help/doc/FAQ.md') !== undefined;
        });
        helpRegistry.addSubTopic('index', 'changes', 'plugins/help/doc/CHANGES.md', function () {
            return $templateCache.get('plugins/help/doc/CHANGES.md') !== undefined;
        });
    }
    Help.configureDocumentation = configureDocumentation;
    function configureMenu(HawtioExtension, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-help', function ($scope) {
            var template = '<a class="pf-c-dropdown__menu-item" ng-href="help">Help</a>';
            return $compile(template)($scope);
        });
    }
    Help.configureMenu = configureMenu;
})(Help || (Help = {}));
/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
/// <reference path="help-registry.ts"/>
var Help;
(function (Help) {
    Help.helpModule = angular
        .module('hawtio-help', [])
        .config(Help.configureRoutes)
        .run(Help.configureDocumentation)
        .run(Help.configureMenu)
        .component('help', Help.helpComponent)
        .service('helpService', Help.HelpService)
        .service('helpRegistry', Help.HelpRegistry)
        .name;
})(Help || (Help = {}));
/// <reference path="init.service.ts"/>
var Init;
(function (Init) {
    Init.initModule = angular
        .module('hawtio-init', [])
        .service('initService', Init.InitService)
        .name;
})(Init || (Init = {}));
var Page;
(function (Page) {
    var PageHeaderController = /** @class */ (function () {
        PageHeaderController.$inject = ["configManager"];
        function PageHeaderController(configManager) {
            'ngInject';
            this.appName = configManager.getBrandingValue('appName');
            this.appLogoUrl = configManager.getBrandingValue('appLogoUrl');
        }
        return PageHeaderController;
    }());
    Page.pageHeaderComponent = {
        bindings: {
            onNavToggle: '&'
        },
        template: "\n      <div class=\"pf-c-page__header-brand\">\n        <div class=\"pf-c-page__header-brand-toggle\">\n          <button class=\"pf-c-button pf-m-plain\" ng-click=\"$ctrl.onNavToggle()\">\n            <i class=\"fa fa-bars\" aria-hidden=\"true\"></i>\n          </button>\n        </div>\n        <div class=\"pf-c-page__header-brand-link\">\n          <img class=\"pf-c-brand\" ng-src=\"{{$ctrl.appLogoUrl}}\" alt=\"{{$ctrl.appName}}\">\n        </div>\n      </div>\n      <div class=\"pf-c-page__header-selector\" hawtio-extension name=\"context-selector\">\n      </div>\n      <div class=\"pf-c-page__header-tools\">\n        <div class=\"pf-c-page__header-tools-group pf-m-icons\">\n          <span hawtio-extension name=\"header-tools\"></span>\n          <help-dropdown></help-dropdown>\n        </div>\n        <div class=\"pf-c-page__header-tools-group\">\n          <user-dropdown></user-dropdown>\n        </div>\n      </div>\n    ",
        controller: PageHeaderController
    };
})(Page || (Page = {}));
/// <reference path="page-header.component.ts"/>
var Page;
(function (Page) {
    Page.pageHeaderModule = angular
        .module('hawtio-page-header', [])
        .component('pageHeader', Page.pageHeaderComponent)
        .name;
})(Page || (Page = {}));
var Page;
(function (Page) {
    Page.pageMainComponent = {
        bindings: {
            templateUrl: '@'
        },
        template: "\n      <section class=\"pf-c-page__main-section pf-m-light\">\n        <ng-include src=\"$ctrl.templateUrl\"></ng-include>\n      </section>\n    "
    };
})(Page || (Page = {}));
/// <reference path="page-main.component.ts"/>
var Page;
(function (Page) {
    Page.pageMainModule = angular
        .module('hawtio-page-main', [])
        .component('pageMain', Page.pageMainComponent)
        .name;
})(Page || (Page = {}));
var Nav;
(function (Nav) {
    Nav.DEFAULT_TEMPLATE = '<div ng-view></div>';
    Nav.DEFAULT_TEMPLATE_URL = '/defaultTemplateUrl.html';
    var MainNavItem = /** @class */ (function () {
        function MainNavItem(item) {
            this.template = Nav.DEFAULT_TEMPLATE;
            this.isValid = function () { return true; };
            this.rank = 0;
            if (item.href && item.basePath) {
                throw new Error("Must specify 'href' or 'basePath', not both.");
            }
            _.assign(this, item);
        }
        Object.defineProperty(MainNavItem.prototype, "templateUrl", {
            get: function () {
                return _.kebabCase(this.title) + '.html';
            },
            enumerable: false,
            configurable: true
        });
        return MainNavItem;
    }());
    Nav.MainNavItem = MainNavItem;
})(Nav || (Nav = {}));
/// <reference path="main-nav-item.ts"/>
var Nav;
(function (Nav) {
    var MainNavService = /** @class */ (function () {
        MainNavService.$inject = ["$location", "$templateCache", "configManager"];
        function MainNavService($location, $templateCache, configManager) {
            'ngInject';
            this.$location = $location;
            this.$templateCache = $templateCache;
            this.configManager = configManager;
            this.allItems = [];
            $templateCache.put(Nav.DEFAULT_TEMPLATE_URL, Nav.DEFAULT_TEMPLATE);
        }
        MainNavService.prototype.addItem = function (props) {
            var mainNavItem = new Nav.MainNavItem(props);
            if (this.isMainNavItemEnabled(mainNavItem)) {
                this.allItems.push(mainNavItem);
                this.$templateCache.put(mainNavItem.templateUrl, mainNavItem.template);
            }
        };
        MainNavService.prototype.isMainNavItemEnabled = function (mainNavItem) {
            return (mainNavItem.basePath && this.configManager.isRouteEnabled(mainNavItem.basePath)) ||
                (mainNavItem.href && this.configManager.isRouteEnabled(mainNavItem.href));
        };
        MainNavService.prototype.getValidItems = function () {
            return this.allItems
                .filter(function (item) { return item.isValid(); })
                .sort(function (a, b) { return a.rank !== b.rank ? b.rank - a.rank : a.title.localeCompare(b.title); });
        };
        MainNavService.prototype.getActiveItem = function () {
            var items = this.getValidItems();
            return _.find(items, function (item) { return item['isActive']; });
        };
        MainNavService.prototype.activateItem = function (item) {
            this.clearActiveItem();
            item['isActive'] = true;
        };
        MainNavService.prototype.clearActiveItem = function () {
            this.allItems.forEach(function (item) { return item['isActive'] = false; });
        };
        MainNavService.prototype.changeRouteIfRequired = function () {
            var activeItem = this.getActiveItem();
            if (activeItem && activeItem.href) {
                this.$location.path(activeItem.href);
            }
        };
        MainNavService.prototype.findItemByPath = function () {
            var items = this.getValidItems();
            return this.getItemThatMatcheslocation(items);
        };
        MainNavService.prototype.isMainNavPath = function () {
            return this.getItemThatMatcheslocation(this.allItems) !== undefined;
        };
        MainNavService.prototype.getItemThatMatcheslocation = function (items) {
            var _this = this;
            return _.find(items, function (item) { return _.startsWith(_this.$location.path(), item.href || item.basePath); });
        };
        MainNavService.prototype.isRootPath = function () {
            return this.$location.path() === '/';
        };
        return MainNavService;
    }());
    Nav.MainNavService = MainNavService;
})(Nav || (Nav = {}));
/// <reference path="../../navigation/main-nav/main-nav-item.ts"/>
/// <reference path="../../navigation/main-nav/main-nav.service.ts"/>
var Page;
(function (Page) {
    var PageSidebarController = /** @class */ (function () {
        PageSidebarController.$inject = ["mainNavService", "$rootScope", "$interval", "$window"];
        function PageSidebarController(mainNavService, $rootScope, $interval, $window) {
            'ngInject';
            var _this = this;
            this.mainNavService = mainNavService;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$window = $window;
            this.updateView = function (item) {
                if (item) {
                    _this.templateUrl = item.templateUrl;
                    _this.mainNavService.activateItem(item);
                }
                else {
                    _this.templateUrl = Nav.DEFAULT_TEMPLATE_URL;
                    _this.mainNavService.clearActiveItem();
                }
                _this.onTemplateChange({ templateUrl: _this.templateUrl });
                _this.mainNavService.changeRouteIfRequired();
                _this.activeItem = item;
            };
        }
        PageSidebarController.prototype.$onInit = function () {
            var _this = this;
            this.loadDataAndSetActiveItem();
            this.unregisterRouteChangeListener = this.$rootScope.$on('$routeChangeStart', function () {
                var item = _this.mainNavService.findItemByPath();
                _this.updateView(item);
            });
            this.itemsChecker = this.$interval(function () {
                var items = _this.mainNavService.getValidItems();
                if (items.length !== _this.items.length) {
                    var previousActiveItem = _this.getActiveItem();
                    if (previousActiveItem) {
                        _this.loadDataAndSetActiveItem();
                    }
                    else {
                        _this.loadData();
                    }
                }
            }, 10000);
        };
        PageSidebarController.prototype.getActiveItem = function () {
            return _.find(this.items, function (item) { return item['isActive']; });
        };
        PageSidebarController.prototype.$onDestroy = function () {
            this.unregisterRouteChangeListener();
            this.$interval.cancel(this.itemsChecker);
        };
        PageSidebarController.prototype.loadData = function () {
            this.items = this.mainNavService.getValidItems();
        };
        PageSidebarController.prototype.loadDataAndSetActiveItem = function () {
            this.items = this.mainNavService.getValidItems();
            var activeItem = this.mainNavService.getActiveItem();
            if (!activeItem && (this.mainNavService.isRootPath() || this.mainNavService.isMainNavPath())) {
                activeItem = this.mainNavService.findItemByPath() || this.items[0];
            }
            this.updateView(activeItem);
        };
        PageSidebarController.prototype.onClick = function (item) {
            this.updateView(item);
            this.onItemClick();
        };
        return PageSidebarController;
    }());
    Page.pageSidebarComponent = {
        bindings: {
            onTemplateChange: '&',
            onItemClick: '&'
        },
        template: "\n      <nav class=\"pf-c-nav pf-m-dark\">\n        <ul class=\"pf-c-nav__list\">\n          <li class=\"pf-c-nav__item\" ng-repeat=\"item in $ctrl.items\">\n            <a href=\"#\" class=\"pf-c-nav__link\" ng-class=\"{'pf-m-current': item === $ctrl.activeItem}\"\n              ng-click=\"$ctrl.onClick(item)\">\n              {{item.title}}\n            </a>\n          </li>\n        </ul>\n      </nav>\n    ",
        controller: PageSidebarController
    };
})(Page || (Page = {}));
/// <reference path="page-sidebar.component.ts"/>
var Page;
(function (Page) {
    Page.pageSidebarModule = angular
        .module('hawtio-page-sidebar', [])
        .component('pageSidebar', Page.pageSidebarComponent)
        .name;
})(Page || (Page = {}));
var Page;
(function (Page) {
    var PageController = /** @class */ (function () {
        PageController.$inject = ["$window", "$timeout", "$rootScope"];
        function PageController($window, $timeout, $rootScope) {
            'ngInject';
            this.$window = $window;
            this.$timeout = $timeout;
            this.$rootScope = $rootScope;
            this.WIDTH_LIMIT = 768;
            this.isNavOpen = true;
            this.previousWidth = this.$window.innerWidth;
        }
        PageController.prototype.$onInit = function () {
            var _this = this;
            angular.element(this.$window).on('resize', function () {
                _this.$timeout(function () {
                    if (_this.wasInDesktopView() && _this.isInMobileView()) {
                        _this.isNavOpen = false;
                    }
                    if (_this.wasInMobileView() && _this.isInDesktopView()) {
                        _this.isNavOpen = true;
                    }
                    _this.previousWidth = _this.$window.innerWidth;
                });
            });
            this.$rootScope.$on(Page.CLOSE_MAIN_NAV_EVENT, function () { return _this.isNavOpen = false; });
        };
        PageController.prototype.$onDestroy = function () {
            angular.element(this.$window).off('resize');
        };
        PageController.prototype.onNavToggle = function () {
            this.isNavOpen = !this.isNavOpen;
        };
        PageController.prototype.onTemplateChange = function (templateUrl) {
            this.templateUrl = templateUrl;
        };
        PageController.prototype.onSidebarItemClick = function () {
            if (this.isInMobileView()) {
                this.isNavOpen = false;
            }
        };
        PageController.prototype.wasInDesktopView = function () {
            return this.previousWidth >= this.WIDTH_LIMIT;
        };
        PageController.prototype.wasInMobileView = function () {
            return this.previousWidth < this.WIDTH_LIMIT;
        };
        PageController.prototype.isInDesktopView = function () {
            return this.$window.innerWidth >= this.WIDTH_LIMIT;
        };
        PageController.prototype.isInMobileView = function () {
            return this.$window.innerWidth < this.WIDTH_LIMIT;
        };
        return PageController;
    }());
    Page.pageComponent = {
        template: "\n      <div class=\"pf-c-background-image\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"pf-c-background-image__filter\" width=\"0\" height=\"0\">\n          <filter id=\"image_overlay\">\n            <feColorMatrix type=\"matrix\" values=\"1 0 0 0 0\n                    1 0 0 0 0\n                    1 0 0 0 0\n                    0 0 0 1 0\" />\n            <feComponentTransfer color-interpolation-filters=\"sRGB\" result=\"duotone\">\n              <feFuncR type=\"table\" tableValues=\"0.086274509803922 0.43921568627451\"></feFuncR>\n              <feFuncG type=\"table\" tableValues=\"0.086274509803922 0.43921568627451\"></feFuncG>\n              <feFuncB type=\"table\" tableValues=\"0.086274509803922 0.43921568627451\"></feFuncB>\n              <feFuncA type=\"table\" tableValues=\"0 1\"></feFuncA>\n            </feComponentTransfer>\n          </filter>\n        </svg>\n      </div>\n      <div class=\"pf-c-page\">\n        <page-header role=\"banner\" class=\"pf-c-page__header\" on-nav-toggle=\"$ctrl.onNavToggle()\"></page-header>\n        <page-sidebar class=\"pf-c-page__sidebar pf-m-dark\"\n          ng-class=\"{'pf-m-expanded': $ctrl.isNavOpen, 'pf-m-collapsed': !$ctrl.isNavOpen}\"\n          on-template-change=\"$ctrl.onTemplateChange(templateUrl)\"\n          on-item-click=\"$ctrl.onSidebarItemClick()\"></page-sidebar>\n        <page-main role=\"main\" class=\"pf-c-page__main\" template-url=\"{{$ctrl.templateUrl}}\"></page-main>\n      </div>\n      <about></about>\n    ",
        controller: PageController
    };
})(Page || (Page = {}));
/// <reference path="page-header/page-header.module.ts"/>
/// <reference path="page-main/page-main.module.ts"/>
/// <reference path="page-sidebar/page-sidebar.module.ts"/>
/// <reference path="page.component.ts"/>
var Page;
(function (Page) {
    Page.pageModule = angular
        .module('hawtio-page', [
        Page.pageHeaderModule,
        Page.pageMainModule,
        Page.pageSidebarModule
    ])
        .component('page', Page.pageComponent)
        .name;
})(Page || (Page = {}));
var Nav;
(function (Nav) {
    var AppLauncherController = /** @class */ (function () {
        function AppLauncherController() {
            this.isOpen = false;
        }
        AppLauncherController.prototype.toggle = function () {
            this.isOpen = !this.isOpen;
        };
        AppLauncherController.prototype.close = function () {
            this.isOpen = false;
        };
        return AppLauncherController;
    }());
    Nav.AppLauncherController = AppLauncherController;
    Nav.appLauncherComponent = {
        bindings: {
            items: '<',
            onChange: '&',
        },
        template: "\n      <div class=\"pf-c-app-launcher\">\n        <button id=\"app-launcher\" class=\"pf-c-app-launcher__toggle\" ng-click=\"$ctrl.toggle()\"\n          ng-blur=\"$ctrl.close()\">\n          <i class=\"fa fa-th\" aria-hidden=\"true\"></i>\n        </button>\n        <ul class=\"pf-c-app-launcher__menu\" aria-labelledby=\"app-launcher\" ng-show=\"$ctrl.isOpen\">\n          <li ng-repeat=\"item in $ctrl.items\">\n            <a class=\"pf-c-app-launcher__menu-item\" href=\"#\" ng-focus=\"$ctrl.onChange({item})\">{{item.label}}</a>\n          </li>\n        </ul>\n      </div>\n    ",
        controller: AppLauncherController
    };
})(Nav || (Nav = {}));
var Nav;
(function (Nav) {
    var ContextSelectorController = /** @class */ (function () {
        ContextSelectorController.$inject = ["$timeout"];
        function ContextSelectorController($timeout) {
            'ngInject';
            this.$timeout = $timeout;
            this.KEY_ARROW_DOWN = 40;
            this.KEY_ARROW_UP = 38;
            this.KEY_ESCAPE = 27;
            this.isOpen = false;
        }
        ContextSelectorController.prototype.$onInit = function () {
            this.setupCloseOnClickOutside();
        };
        ContextSelectorController.prototype.$onChanges = function () {
            this.reset();
        };
        ContextSelectorController.prototype.setupCloseOnClickOutside = function () {
            var _this = this;
            this.$timeout(function () {
                $('.pf-c-context-selector').click(function (event) { return event.stopPropagation(); });
                $('body').click(function (event) { return _this.$timeout(function () { return _this.reset(); }); });
            });
        };
        ContextSelectorController.prototype.getLabel = function () {
            return this.selectedItem ? this.selectedItem.label : this.label;
        };
        ContextSelectorController.prototype.toggle = function () {
            if (!this.isOpen) {
                this.isOpen = true;
                if (this.isItemSelected()) {
                    this.focusSelectedItem();
                }
                else {
                    this.focusSearchInput();
                }
            }
            else {
                this.reset();
            }
        };
        ContextSelectorController.prototype.reset = function () {
            this.isOpen = false;
            this.searchText = '';
            this.items.forEach(function (item) { return item.id = _.kebabCase(item.label); });
            this.filteredItems = this.items;
        };
        ContextSelectorController.prototype.onSearchKeyUp = function ($event) {
            switch ($event.keyCode) {
                case this.KEY_ARROW_DOWN:
                    this.focusFirstItem();
                    break;
                case this.KEY_ESCAPE:
                    this.reset();
                    break;
                default:
                    this.filterItems();
            }
        };
        ContextSelectorController.prototype.onItemKeyUp = function ($event) {
            var button = $event.target;
            switch ($event.keyCode) {
                case this.KEY_ARROW_DOWN:
                    this.focusNextItem(button);
                    break;
                case this.KEY_ARROW_UP:
                    this.isFirstItem(button) ? this.focusSearchInput() : this.focusPreviousItem(button);
                    break;
                case this.KEY_ESCAPE:
                    this.reset();
                    break;
            }
        };
        ContextSelectorController.prototype.filterItems = function () {
            var regExp = new RegExp(this.searchText, 'i');
            this.filteredItems = this.items.filter(function (selectorItem) { return regExp.test(selectorItem.label); });
        };
        ContextSelectorController.prototype.onItemClick = function (item) {
            this.selectedItem = item;
            this.reset();
            this.onChange({ item: item });
        };
        ContextSelectorController.prototype.isItemSelected = function () {
            return !!this.selectedItem;
        };
        ContextSelectorController.prototype.focusSelectedItem = function () {
            var _this = this;
            this.$timeout(function () { return $('#' + _this.selectedItem.id).focus(); }, 50);
        };
        ContextSelectorController.prototype.kebabCase = function (str) {
            return _.kebabCase(str);
        };
        ContextSelectorController.prototype.focusSearchInput = function () {
            this.$timeout(function () { return $('#contextSelectorSearchInput').focus(); });
        };
        ContextSelectorController.prototype.focusFirstItem = function () {
            this.$timeout(function () { return $('.pf-c-context-selector__menu-list > li:first-child').find('button').focus(); });
        };
        ContextSelectorController.prototype.focusPreviousItem = function (button) {
            this.$timeout(function () { return $(button).parent().prev().find('button').focus(); });
        };
        ContextSelectorController.prototype.focusNextItem = function (button) {
            this.$timeout(function () { return $(button).parent().next().find('button').focus(); });
        };
        ContextSelectorController.prototype.isFirstItem = function (button) {
            return $(button).parent().index() === 0;
        };
        return ContextSelectorController;
    }());
    Nav.ContextSelectorController = ContextSelectorController;
    Nav.contextSelectorComponent = {
        bindings: {
            label: '@',
            items: '<',
            onChange: '&',
        },
        template: "\n      <div class=\"pf-c-context-selector\" ng-class=\"{'pf-m-expanded': $ctrl.isOpen}\">\n        <button class=\"pf-c-context-selector__toggle\" ng-click=\"$ctrl.toggle()\">\n          <span class=\"pf-c-context-selector__toggle-text\">{{$ctrl.getLabel()}}</span>\n          <i class=\"fa fa-angle-down pf-c-context-selector__toggle-icon\" aria-hidden=\"true\"></i>\n        </button>\n        <div class=\"pf-c-context-selector__menu\" ng-show=\"$ctrl.isOpen\">\n          <div class=\"pf-c-context-selector__menu-input\">\n            <div class=\"pf-c-input-group\">\n              <input type=\"search\" id=\"contextSelectorSearchInput\" class=\"pf-c-form-control\"\n                name=\"contextSelectorSearchInput\" placeholder=\"Search\" ng-model=\"$ctrl.searchText\"\n                ng-keyup=\"$ctrl.onSearchKeyUp($event)\" ng-focus=\"$ctrl.onSearchFocus()\"\n                ng-blur=\"$ctrl.onSearchBlur()\">\n            </div>\n          </div>\n          <ul class=\"pf-c-context-selector__menu-list\">\n            <li ng-repeat=\"item in $ctrl.filteredItems track by item.id\">\n              <button id=\"{{item.id}}\" class=\"pf-c-context-selector__menu-list-item\"\n                ng-click=\"$ctrl.onItemClick(item)\" ng-keyup=\"$ctrl.onItemKeyUp($event)\"\n                ng-focus=\"$ctrl.onItemFocus()\" ng-blur=\"$ctrl.onItemBlur()\">{{item.label}}</button>\n            </li>\n          </ul>\n        </div>\n      </div>\n    ",
        controller: ContextSelectorController
    };
})(Nav || (Nav = {}));
var Nav;
(function (Nav) {
    var HawtioTab = /** @class */ (function () {
        function HawtioTab(label, path) {
            this.label = label;
            this.path = path;
            this.visible = true;
        }
        return HawtioTab;
    }());
    Nav.HawtioTab = HawtioTab;
})(Nav || (Nav = {}));
/// <reference path="hawtio-tab.ts"/>
var Nav;
(function (Nav) {
    var HawtioTabsController = /** @class */ (function () {
        HawtioTabsController.$inject = ["$document", "$timeout", "$location", "$rootScope", "configManager"];
        function HawtioTabsController($document, $timeout, $location, $rootScope, configManager) {
            'ngInject';
            this.$document = $document;
            this.$timeout = $timeout;
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.configManager = configManager;
        }
        HawtioTabsController.prototype.$onInit = function () {
            var _this = this;
            this.unregisterRouteChangeListener = this.$rootScope.$on('$routeChangeSuccess', function () {
                var tab = _.find(_this.tabs, function (tab) { return _.startsWith(_this.$location.path(), tab.path); });
                // a route change could potentially load the content of a different tab, e.g., via a link,
                // so activate the tab based on the current location
                if (tab) {
                    _this.activateTab(tab);
                }
            });
        };
        HawtioTabsController.prototype.$onDestroy = function () {
            this.unregisterRouteChangeListener();
        };
        HawtioTabsController.prototype.$onChanges = function (changesObj) {
            if (this.tabs) {
                this.discardDisabledTabs();
                this.adjustTabs();
                this.activateTab(changesObj.activeTab ? changesObj.activeTab.currentValue : null);
            }
        };
        HawtioTabsController.prototype.discardDisabledTabs = function () {
            var _this = this;
            this.tabs = this.tabs.filter(function (tab) { return _this.configManager.isRouteEnabled(tab.path); });
        };
        HawtioTabsController.prototype.activateTab = function (tab) {
            var _this = this;
            if (tab) {
                this.activeTab = tab;
            }
            else {
                tab = _.find(this.tabs, function (tab) { return _.startsWith(_this.$location.path(), tab.path); });
                if (tab) {
                    this.activeTab = tab;
                }
                else if (this.tabs.length > 0) {
                    this.activeTab = this.tabs[0];
                    this.$location.path(this.activeTab.path);
                }
            }
        };
        HawtioTabsController.prototype.adjustTabs = function () {
            var _this = this;
            this.adjustingTabs = true;
            // wait for the tabs to be rendered by AngularJS before calculating the widths
            this.$timeout(function () {
                var $ul = _this.$document.find('.hawtio-tabs');
                var $liTabs = $ul.find('.hawtio-tab');
                var $liDropdown = $ul.find('.dropdown');
                var availableWidth = $ul.width() - $liDropdown.width();
                var tabsWidth = 0;
                $liTabs.each(function (i, element) {
                    tabsWidth += element.clientWidth;
                    _this.tabs[i].visible = tabsWidth < availableWidth;
                });
                _this.adjustingTabs = false;
            });
        };
        Object.defineProperty(HawtioTabsController.prototype, "visibleTabs", {
            get: function () {
                return _.filter(this.tabs, { 'visible': true });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HawtioTabsController.prototype, "moreTabs", {
            get: function () {
                return _.filter(this.tabs, { 'visible': false });
            },
            enumerable: false,
            configurable: true
        });
        HawtioTabsController.prototype.onClick = function (tab) {
            this.activeTab = tab;
            this.onChange({ tab: tab });
        };
        return HawtioTabsController;
    }());
    Nav.HawtioTabsController = HawtioTabsController;
    Nav.hawtioTabsComponent = {
        bindings: {
            tabs: '<',
            activeTab: '<',
            onChange: '&',
        },
        template: "\n      <ul class=\"nav nav-tabs hawtio-tabs\" ng-if=\"$ctrl.tabs\">\n        <li ng-repeat=\"tab in $ctrl.visibleTabs track by tab.path\" class=\"hawtio-tab\"\n            ng-class=\"{invisible: $ctrl.adjustingTabs, active: tab === $ctrl.activeTab}\">\n          <a href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n        </li>\n        <li class=\"dropdown\" ng-class=\"{invisible: $ctrl.moreTabs.length === 0}\">\n          <a id=\"moreDropdown\" class=\"dropdown-toggle\" href=\"\" data-toggle=\"dropdown\">\n            More\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"moreDropdown\">\n            <li role=\"presentation\" ng-repeat=\"tab in $ctrl.moreTabs track by tab.label\">\n              <a role=\"menuitem\" tabindex=\"-1\" href=\"#\" ng-click=\"$ctrl.onClick(tab)\">{{tab.label}}</a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n    ",
        controller: HawtioTabsController
    };
})(Nav || (Nav = {}));
var Nav;
(function (Nav) {
    var HawtioTabsLayoutController = /** @class */ (function () {
        HawtioTabsLayoutController.$inject = ["$location"];
        function HawtioTabsLayoutController($location) {
            'ngInject';
            this.$location = $location;
        }
        HawtioTabsLayoutController.prototype.goto = function (tab) {
            this.$location.path(tab.path);
        };
        return HawtioTabsLayoutController;
    }());
    Nav.HawtioTabsLayoutController = HawtioTabsLayoutController;
    Nav.hawtioTabsLayoutComponent = {
        bindings: {
            tabs: '<'
        },
        template: "\n      <div class=\"nav-tabs-main\">\n        <hawtio-tabs tabs=\"$ctrl.tabs\" on-change=\"$ctrl.goto(tab)\"></hawtio-tabs>\n        <div ng-view></div>\n      </div>\n    ",
        controller: HawtioTabsLayoutController
    };
})(Nav || (Nav = {}));
var About;
(function (About) {
    About.SHOW_ABOUT_EVENT = "ABOUT_LINK_CLICK_EVENT";
})(About || (About = {}));
/// <reference path="../../about/about.constants.ts"/>
var Nav;
(function (Nav) {
    var HelpDropdownController = /** @class */ (function () {
        HelpDropdownController.$inject = ["$rootScope", "$location"];
        function HelpDropdownController($rootScope, $location) {
            'ngInject';
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.isOpen = false;
        }
        HelpDropdownController.prototype.toggle = function () {
            this.isOpen = !this.isOpen;
        };
        HelpDropdownController.prototype.close = function () {
            this.isOpen = false;
        };
        HelpDropdownController.prototype.onHelpClicked = function () {
            this.$location.path('/help');
        };
        HelpDropdownController.prototype.onAboutClicked = function () {
            this.$rootScope.$emit(About.SHOW_ABOUT_EVENT);
        };
        return HelpDropdownController;
    }());
    Nav.helpDropdownComponent = {
        template: "\n      <div class=\"pf-c-dropdown\">\n        <button id=\"helpDropdownMenu\" class=\"pf-c-dropdown__toggle pf-m-plain\" ng-click=\"$ctrl.toggle()\"\n          ng-blur=\"$ctrl.close()\">\n          <i class=\"pficon pficon-help\" aria-hidden=\"true\"></i>\n        </button>\n        <ul class=\"pf-c-dropdown__menu pf-m-align-right\" ng-show=\"$ctrl.isOpen\">\n          <li><a class=\"pf-c-dropdown__menu-item\" href=\"#\" ng-focus=\"$ctrl.onHelpClicked()\">Help</a></li>\n          <li><a class=\"pf-c-dropdown__menu-item\" href=\"#\" ng-focus=\"$ctrl.onAboutClicked()\">About</a></li>\n        </ul>\n      </div>\n    ",
        controller: HelpDropdownController
    };
})(Nav || (Nav = {}));
var Nav;
(function (Nav) {
    var UserDropdownController = /** @class */ (function () {
        UserDropdownController.$inject = ["$location", "userDetails"];
        function UserDropdownController($location, userDetails) {
            'ngInject';
            this.$location = $location;
            this.isOpen = false;
            this.userName = userDetails['fullName'];
        }
        UserDropdownController.prototype.toggle = function () {
            this.isOpen = !this.isOpen;
        };
        UserDropdownController.prototype.close = function () {
            this.isOpen = false;
        };
        UserDropdownController.prototype.onPreferencesClicked = function () {
            this.$location.path('/preferences');
        };
        return UserDropdownController;
    }());
    Nav.userDropdownComponent = {
        template: "\n      <div class=\"pf-c-dropdown\">\n        <button id=\"userDropdownMenu\" class=\"pf-c-dropdown__toggle pf-m-plain\" ng-click=\"$ctrl.toggle()\"\n          ng-blur=\"$ctrl.close()\">{{$ctrl.userName}}</button>\n        <ul class=\"pf-c-dropdown__menu pf-m-align-right\" ng-show=\"$ctrl.isOpen\">\n          <li><a class=\"pf-c-dropdown__menu-item\" href=\"#\" ng-focus=\"$ctrl.onPreferencesClicked()\">Preferences</a></li>\n          <span hawtio-extension name=\"hawtio-logout\"></span>\n        </ul>\n      </div>\n    ",
        controller: UserDropdownController
    };
})(Nav || (Nav = {}));
/// <reference path="app-launcher/app-launcher.component.ts"/>
/// <reference path="context-selector/context-selector.component.ts"/>
/// <reference path="hawtio-tabs/hawtio-tabs.component.ts"/>
/// <reference path="hawtio-tabs-layout/hawtio-tabs-layout.component.ts"/>
/// <reference path="help-dropdown/help-dropdown.component.ts"/>
/// <reference path="user-dropdown/user-dropdown.component.ts"/>
/// <reference path="main-nav/main-nav.service.ts"/>
var Nav;
(function (Nav) {
    Nav.navigationModule = angular
        .module('hawtio-navigation', [])
        .component('appLauncher', Nav.appLauncherComponent)
        .component('contextSelector', Nav.contextSelectorComponent)
        .component('hawtioTabs', Nav.hawtioTabsComponent)
        .component('hawtioTabsLayout', Nav.hawtioTabsLayoutComponent)
        .component('helpDropdown', Nav.helpDropdownComponent)
        .component('userDropdown', Nav.userDropdownComponent)
        .service('mainNavService', Nav.MainNavService)
        .name;
})(Nav || (Nav = {}));
var Core;
(function (Core) {
    var LoggingPreferencesService = /** @class */ (function () {
        LoggingPreferencesService.$inject = ["$window"];
        function LoggingPreferencesService($window) {
            'ngInject';
            this.$window = $window;
        }
        LoggingPreferencesService.prototype.getLogBuffer = function () {
            if (window.localStorage.getItem('logBuffer') !== null) {
                return parseInt(this.$window.localStorage.getItem('logBuffer'), 10);
            }
            else {
                return LoggingPreferencesService.DEFAULT_LOG_BUFFER_SIZE;
            }
        };
        LoggingPreferencesService.prototype.setLogBuffer = function (logBuffer) {
            this.$window.localStorage.setItem('logBuffer', logBuffer.toString());
        };
        LoggingPreferencesService.prototype.getGlobalLogLevel = function () {
            if (this.$window.localStorage.getItem('logLevel') !== null) {
                return JSON.parse(this.$window.localStorage.getItem('logLevel'));
            }
            else {
                return LoggingPreferencesService.DEFAULT_GLOBAL_LOG_LEVEL;
            }
        };
        LoggingPreferencesService.prototype.setGlobalLogLevel = function (logLevel) {
            this.$window.localStorage.setItem('logLevel', JSON.stringify(logLevel));
        };
        LoggingPreferencesService.prototype.getChildLoggers = function () {
            if (this.$window.localStorage.getItem('childLoggers') !== null) {
                return JSON.parse(this.$window.localStorage.getItem('childLoggers'));
            }
            else {
                return [];
            }
        };
        LoggingPreferencesService.prototype.getAvailableChildLoggers = function () {
            var allChildLoggers = _.values(Logger['loggers']).map(function (obj) { return obj['context']; });
            var childLoggers = this.getChildLoggers();
            var availableChildLoggers = allChildLoggers.filter(function (childLogger) { return !childLoggers.some(function (c) { return c.name === childLogger.name; }); });
            return _.sortBy(availableChildLoggers, 'name');
        };
        ;
        LoggingPreferencesService.prototype.addChildLogger = function (childLogger) {
            var childLoggers = this.getChildLoggers();
            childLoggers.push(childLogger);
            this.setChildLoggers(childLoggers);
        };
        LoggingPreferencesService.prototype.removeChildLogger = function (childLogger) {
            var childLoggers = this.getChildLoggers();
            _.remove(childLoggers, function (c) { return c.name === childLogger.name; });
            this.setChildLoggers(childLoggers);
            Logger.get(childLogger.name).setLevel(this.getGlobalLogLevel());
        };
        LoggingPreferencesService.prototype.setChildLoggers = function (childLoggers) {
            this.$window.localStorage.setItem('childLoggers', JSON.stringify(childLoggers));
        };
        LoggingPreferencesService.prototype.reconfigureLoggers = function () {
            Logger.setLevel(this.getGlobalLogLevel());
            this.getChildLoggers().forEach(function (childLogger) {
                Logger.get(childLogger.name).setLevel(childLogger.filterLevel);
            });
        };
        LoggingPreferencesService.DEFAULT_LOG_BUFFER_SIZE = 100;
        LoggingPreferencesService.DEFAULT_GLOBAL_LOG_LEVEL = Logger.INFO;
        return LoggingPreferencesService;
    }());
    Core.LoggingPreferencesService = LoggingPreferencesService;
})(Core || (Core = {}));
/// <reference path="logging-preferences.service.ts"/>
var Core;
(function (Core) {
    LoggingPreferencesController.$inject = ["$scope", "loggingPreferencesService"];
    function LoggingPreferencesController($scope, loggingPreferencesService) {
        'ngInject';
        // Initialize tooltips
        $('[data-toggle="tooltip"]').tooltip();
        $scope.logBuffer = loggingPreferencesService.getLogBuffer();
        $scope.logLevel = loggingPreferencesService.getGlobalLogLevel();
        $scope.childLoggers = loggingPreferencesService.getChildLoggers();
        $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        $scope.availableLogLevels = [Logger.OFF, Logger.ERROR, Logger.WARN, Logger.INFO, Logger.DEBUG];
        $scope.onLogBufferChange = function (logBuffer) {
            if (logBuffer !== null && logBuffer !== undefined) {
                loggingPreferencesService.setLogBuffer(logBuffer);
            }
        };
        $scope.onLogLevelChange = function (logLevel) {
            loggingPreferencesService.setGlobalLogLevel(logLevel);
            loggingPreferencesService.reconfigureLoggers();
        };
        $scope.addChildLogger = function (childLogger) {
            loggingPreferencesService.addChildLogger(childLogger);
            $scope.childLoggers = loggingPreferencesService.getChildLoggers();
            $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        };
        $scope.removeChildLogger = function (childLogger) {
            loggingPreferencesService.removeChildLogger(childLogger);
            $scope.childLoggers = loggingPreferencesService.getChildLoggers();
            $scope.availableChildLoggers = loggingPreferencesService.getAvailableChildLoggers();
        };
        $scope.onChildLoggersChange = function (childLoggers) {
            loggingPreferencesService.setChildLoggers(childLoggers);
            loggingPreferencesService.reconfigureLoggers();
        };
    }
    Core.LoggingPreferencesController = LoggingPreferencesController;
})(Core || (Core = {}));
/// <reference path="logging-preferences.controller.ts"/>
/// <reference path="logging-preferences.service.ts"/>
var Core;
(function (Core) {
    Core.loggingPreferencesModule = angular
        .module('hawtio-logging-preferences', [])
        .controller('PreferencesLoggingController', Core.LoggingPreferencesController)
        .service('loggingPreferencesService', Core.LoggingPreferencesService)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PreferencesService = /** @class */ (function () {
        PreferencesService.$inject = ["$window"];
        function PreferencesService($window) {
            'ngInject';
            this.$window = $window;
        }
        PreferencesService.prototype.saveLocationUrl = function (url) {
            this.$window.sessionStorage.setItem('lastUrl', url);
        };
        PreferencesService.prototype.restoreLocation = function ($location) {
            var url = this.$window.sessionStorage.getItem('lastUrl');
            $location.url(url);
        };
        /**
         * Binds a $location.search() property to a model on a scope; so that its initialised correctly on startup
         * and its then watched so as the model changes, the $location.search() is updated to reflect its new value
         * @method bindModelToSearchParam
         * @for Core
         * @static
         * @param {*} $scope
         * @param {ng.ILocationService} $location
         * @param {String} modelName
         * @param {String} paramName
         * @param {Object} initialValue
         */
        PreferencesService.prototype.bindModelToSearchParam = function ($scope, $location, modelName, paramName, initialValue, to, from) {
            if (!(modelName in $scope)) {
                $scope[modelName] = initialValue;
            }
            var toConverter = to || (function (value) { return value; });
            var fromConverter = from || (function (value) { return value; });
            function currentValue() {
                return fromConverter($location.search()[paramName] || initialValue);
            }
            var value = currentValue();
            this.pathSet($scope, modelName, value);
            $scope.$watch(modelName, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue !== undefined && newValue !== null) {
                        $location.search(paramName, toConverter(newValue));
                    }
                    else {
                        $location.search(paramName, '');
                    }
                }
            });
        };
        /**
         * Navigates the given set of paths in turn on the source object
         * and updates the last path value to the given newValue
         *
         * @method pathSet
         * @for Core
         * @static
         * @param {Object} object the start object to start navigating from
         * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
         * @param {Object} newValue the value to update
         * @return {*} the last step on the path which is updated
         */
        PreferencesService.prototype.pathSet = function (object, paths, newValue) {
            var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
            var value = object;
            var lastIndex = pathArray.length - 1;
            angular.forEach(pathArray, function (name, idx) {
                var next = value[name];
                if (idx >= lastIndex || !angular.isObject(next)) {
                    next = (idx < lastIndex) ? {} : newValue;
                    value[name] = next;
                }
                value = next;
            });
            return value;
        };
        return PreferencesService;
    }());
    Core.PreferencesService = PreferencesService;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PreferencesRegistry = /** @class */ (function () {
        function PreferencesRegistry() {
            this.tabs = {};
        }
        PreferencesRegistry.prototype.addTab = function (label, templateUrl, isValid) {
            if (isValid === void 0) { isValid = function () { return true; }; }
            this.tabs[label] = {
                label: label,
                templateUrl: templateUrl,
                get isValid() { return isValid(); },
            };
        };
        PreferencesRegistry.prototype.getTab = function (label) {
            return this.tabs[label];
        };
        PreferencesRegistry.prototype.getTabs = function () {
            return _.clone(this.tabs);
        };
        return PreferencesRegistry;
    }());
    Core.PreferencesRegistry = PreferencesRegistry;
})(Core || (Core = {}));
/// <reference path="../preferences.service.ts"/>
/// <reference path="../preferences-registry.ts"/>
var Core;
(function (Core) {
    PreferencesHomeController.$inject = ["$scope", "$location", "preferencesRegistry", "preferencesService"];
    function PreferencesHomeController($scope, $location, preferencesRegistry, preferencesService) {
        'ngInject';
        $scope.panels = _.values(preferencesRegistry.getTabs());
        var tabsFromPanels = function (tabs) { return tabs.sort(byLabel)
            .filter(function (panel) { return panel.isValid; })
            .map(function (panel) { return new Nav.HawtioTab(panel.label, panel.label); }); };
        $scope.tabs = tabsFromPanels($scope.panels);
        // Deep watch for async isValid attributes that may change depending on plugin runtimes
        $scope.$watch('panels', function (value) { return $scope.tabs = tabsFromPanels(value); }, true);
        // pick the first one as the default
        preferencesService.bindModelToSearchParam($scope, $location, 'pref', 'pref', $scope.tabs[0].label);
        $scope.setPanel = function (tab) { return $scope.pref = tab.label; };
        $scope.close = function () { return preferencesService.restoreLocation($location); };
        $scope.getPrefs = function (pref) {
            var panel = $scope.panels.find(function (panel) { return panel.label === pref; });
            if (panel) {
                return panel.templateUrl;
            }
            return undefined;
        };
        $scope.getTab = function (pref) { return _.find($scope.tabs, { label: pref }); };
        /**
         * Sort the preference by names (and ensure Reset is last).
         */
        function byLabel(a, b) {
            if ('Reset' == a.label) {
                return 1;
            }
            else if ('Reset' == b.label) {
                return -1;
            }
            return a.label.localeCompare(b.label);
        }
    }
    Core.PreferencesHomeController = PreferencesHomeController;
})(Core || (Core = {}));
/// <reference path="preferences-home.controller.ts"/>
var Core;
(function (Core) {
    Core.preferencesHomeModule = angular
        .module('hawtio-preferences-home', [])
        .controller('PreferencesHomeController', Core.PreferencesHomeController)
        .name;
})(Core || (Core = {}));
var Core;
(function (Core) {
    ResetPreferencesController.$inject = ["$scope", "$window"];
    var SHOW_ALERT = 'showPreferencesResetAlert';
    function ResetPreferencesController($scope, $window) {
        'ngInject';
        $scope.showAlert = !!$window.sessionStorage.getItem(SHOW_ALERT);
        $window.sessionStorage.removeItem(SHOW_ALERT);
        $scope.doReset = function () {
            Core.log.info('Resetting preferences');
            // Backup the storage K/V pairs that are not actual preferences.
            // Ideally, the preferences would be better organised under structured keys
            // that would be provided to the preferences registry, so that a local storage
            // complete clear operation and restore of hard-coded K/V pairs could be avoided.
            var jvmConnect = $window.localStorage.getItem('jvmConnect');
            var osAuthCreds = $window.localStorage.getItem('osAuthCreds');
            $window.localStorage.clear();
            $window.localStorage.setItem('jvmConnect', jvmConnect);
            $window.localStorage.setItem('osAuthCreds', osAuthCreds);
            $window.sessionStorage.setItem(SHOW_ALERT, 'true');
            $window.setTimeout(function () {
                $window.location.reload();
            }, 10);
        };
    }
    Core.ResetPreferencesController = ResetPreferencesController;
})(Core || (Core = {}));
/// <reference path="reset-preferences.controller.ts"/>
var Core;
(function (Core) {
    Core.resetPreferencesModule = angular
        .module('hawtio-preferences-menu-item', [])
        .controller('ResetPreferencesController', Core.ResetPreferencesController)
        .name;
})(Core || (Core = {}));
/// <reference path="../extension/hawtio-extension.ts"/>
/// <reference path="../help/help-registry.ts"/>
/// <reference path="preferences.service.ts"/>
var Core;
(function (Core) {
    configureRoutes.$inject = ["$routeProvider"];
    configureMenu.$inject = ["HawtioExtension", "$compile"];
    savePreviousLocationWhenOpeningPreferences.$inject = ["$rootScope", "preferencesService"];
    configureDocumentation.$inject = ["helpRegistry"];
    configurePreferencesPages.$inject = ["preferencesRegistry"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider.when('/preferences', {
            templateUrl: 'preferences/preferences-home/preferences-home.html',
            reloadOnSearch: false
        });
    }
    Core.configureRoutes = configureRoutes;
    function configureMenu(HawtioExtension, $compile) {
        'ngInject';
        HawtioExtension.add('hawtio-preferences', function ($scope) {
            var template = '<a ng-href="preferences">Preferences</a>';
            return $compile(template)($scope);
        });
    }
    Core.configureMenu = configureMenu;
    function savePreviousLocationWhenOpeningPreferences($rootScope, preferencesService) {
        'ngInject';
        $rootScope.$on("$locationChangeSuccess", function (event, newUrl, oldUrl) {
            if (newUrl.indexOf('/preferences') !== -1 && oldUrl.indexOf('/preferences') === -1) {
                var baseUrl = newUrl.substring(0, newUrl.indexOf('/preferences'));
                var url_1 = oldUrl.substring(baseUrl.length);
                preferencesService.saveLocationUrl(url_1);
            }
        });
    }
    Core.savePreviousLocationWhenOpeningPreferences = savePreviousLocationWhenOpeningPreferences;
    function configureDocumentation(helpRegistry) {
        'ngInject';
        helpRegistry.addUserDoc('preferences', 'preferences/help.md');
    }
    Core.configureDocumentation = configureDocumentation;
    function configurePreferencesPages(preferencesRegistry) {
        'ngInject';
        preferencesRegistry.addTab("Console Logs", 'preferences/logging-preferences/logging-preferences.html');
        preferencesRegistry.addTab("Reset", 'preferences/reset-preferences/reset-preferences.html');
    }
    Core.configurePreferencesPages = configurePreferencesPages;
})(Core || (Core = {}));
/// <reference path="logging-preferences/logging-preferences.module.ts"/>
/// <reference path="preferences-home/preferences-home.module.ts"/>
/// <reference path="reset-preferences/reset-preferences.module.ts"/>
/// <reference path="preferences.config.ts"/>
/// <reference path="preferences.service.ts"/>
/// <reference path="preferences-registry.ts"/>
var Core;
(function (Core) {
    Core.preferencesModule = angular
        .module('hawtio-preferences', [
        'ng',
        'ngRoute',
        'ngSanitize',
        Core.loggingPreferencesModule,
        Core.preferencesHomeModule,
        Core.resetPreferencesModule
    ])
        .config(Core.configureRoutes)
        .run(Core.configureMenu)
        .run(Core.savePreviousLocationWhenOpeningPreferences)
        .run(Core.configureDocumentation)
        .run(Core.configurePreferencesPages)
        .service('preferencesService', Core.PreferencesService)
        .service('preferencesRegistry', Core.PreferencesRegistry)
        .name;
})(Core || (Core = {}));
var Shared;
(function (Shared) {
    var HawtioLoadingController = /** @class */ (function () {
        HawtioLoadingController.$inject = ["$timeout"];
        function HawtioLoadingController($timeout) {
            'ngInject';
            this.$timeout = $timeout;
            this.loading = true;
            this.show = false;
        }
        HawtioLoadingController.prototype.$onInit = function () {
            var _this = this;
            this.$timeout(function () { return _this.show = true; }, 1000);
        };
        return HawtioLoadingController;
    }());
    Shared.HawtioLoadingController = HawtioLoadingController;
    Shared.hawtioLoadingComponent = {
        transclude: true,
        bindings: {
            loading: '<'
        },
        template: "\n      <div ng-if=\"$ctrl.loading\">\n        <div class=\"loading-centered\" ng-show=\"$ctrl.show\">\n          <div class=\"spinner spinner-lg\"></div>\n          <div class=\"loading-label\">Loading...</div>\n        </div>\n      </div>\n      <div class=\"loading-content\" ng-if=\"!$ctrl.loading\" ng-transclude></div>\n    ",
        controller: HawtioLoadingController
    };
})(Shared || (Shared = {}));
var Shared;
(function (Shared) {
    Shared.hawtioActionBarComponent = {
        transclude: true,
        template: "\n      <div class=\"container-fluid\">\n        <div class=\"row toolbar-pf\">\n          <div class=\"col-sm-12\">\n            <form class=\"toolbar-pf-actions\">\n              <div class=\"form-group\" ng-transclude>\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\n    "
    };
})(Shared || (Shared = {}));
/// <reference path="loading/loading.component.ts"/>
/// <reference path="action-bar/action-bar.component.ts"/>
var Shared;
(function (Shared) {
    Shared.sharedModule = angular
        .module('hawtio-shared', [])
        .component('hawtioActionBar', Shared.hawtioActionBarComponent)
        .component('hawtioLoading', Shared.hawtioLoadingComponent)
        .name;
})(Shared || (Shared = {}));
var Core;
(function (Core) {
    templateCacheConfig.$inject = ["$provide"];
    var pluginName = 'hawtio-core-template-cache';
    var log = Logger.get(pluginName);
    Core.templateCacheModule = angular
        .module(pluginName, [])
        .config(templateCacheConfig)
        .name;
    function templateCacheConfig($provide) {
        'ngInject';
        // extend template cache a bit so we can avoid fetching templates from the
        // server
        $provide.decorator('$templateCache', ['$delegate', function ($delegate) {
                var oldPut = $delegate.put;
                $delegate.watches = {};
                $delegate.put = function (id, template) {
                    log.debug("Adding template:", id); //, " with content: ", template);
                    oldPut(id, template);
                    if (id in $delegate.watches) {
                        log.debug("Found watches for id:", id);
                        $delegate.watches[id].forEach(function (func) {
                            func(template);
                        });
                        log.debug("Removing watches for id:", id);
                        delete $delegate.watches[id];
                    }
                };
                var oldGet = $delegate.get;
                $delegate.get = function (id) {
                    var answer = oldGet(id);
                    log.debug("Getting template:", id); //, " returning: ", answer);
                    return answer;
                };
                return $delegate;
            }]);
        // extend templateRequest so we can prevent it from requesting templates, as
        // we have 'em all in $templateCache
        $provide.decorator('$templateRequest', ['$rootScope', '$timeout', '$q', '$templateCache', '$delegate', function ($rootScope, $timeout, $q, $templateCache, $delegate) {
                var fn = function (url, ignore) {
                    log.debug("request for template at:", url);
                    var answer = $templateCache.get(url);
                    var deferred = $q.defer();
                    if (!angular.isDefined(answer)) {
                        log.debug("No template in cache for URL:", url);
                        if ('watches' in $templateCache) {
                            log.debug("Adding watch to $templateCache for url:", url);
                            if (!$templateCache.watches[url]) {
                                $templateCache.watches[url] = [];
                            }
                            $templateCache.watches[url].push(function (template) {
                                log.debug("Resolving watch on template:", url);
                                deferred.resolve(template);
                            });
                            return deferred.promise;
                        }
                        else {
                            // Guess we'll just let the real templateRequest service handle it
                            return $delegate(url, ignore);
                        }
                    }
                    else {
                        log.debug("Found template for URL:", url);
                        $timeout(function () {
                            deferred.resolve(answer);
                        }, 1);
                        return deferred.promise;
                    }
                };
                fn['totalPendingRequests'] = 0;
                return fn;
            }]);
    }
})(Core || (Core = {}));
/// <reference path="about/about.module.ts"/>
/// <reference path="auth/auth.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/core.module.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="event-services/event-services.module.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="init/init.module.ts"/>
/// <reference path="page/page.module.ts"/>
/// <reference path="navigation/navigation.module.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="shared/shared.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>
/// <reference path="app.config.ts"/>
/// <reference path="app.component.ts"/>
var App;
(function (App) {
    App.appModule = angular
        .module('hawtio', [
        'ng',
        'ngRoute',
        'ngSanitize',
        'patternfly',
        'patternfly.modals',
        'patternfly.table',
        'patternfly.toolbars',
        About.aboutModule,
        Core.authModule,
        Core.configModule,
        Core.coreModule,
        Core.eventServicesModule,
        Core.hawtioExtensionModule,
        Core.preferencesModule,
        Core.templateCacheModule,
        Help.helpModule,
        Init.initModule,
        Page.pageModule,
        Nav.navigationModule,
        Shared.sharedModule
    ])
        .run(App.configureAboutPage)
        .component('hawtioApp', App.appComponent)
        .name;
    hawtioPluginLoader
        .addModule(App.appModule)
        .registerPreBootstrapTask({
        name: 'ConfigLoader',
        task: Core.configLoader
    });
})(App || (App = {}));
var Page;
(function (Page) {
    Page.CLOSE_MAIN_NAV_EVENT = "CLOSE_MAIN_NAV_EVENT";
})(Page || (Page = {}));
var ArrayHelpers;
(function (ArrayHelpers) {
    /**
     * Removes elements in the target array based on the new collection, returns true if
     * any changes were made
     */
    function removeElements(collection, newCollection, index) {
        if (index === void 0) { index = 'id'; }
        var oldLength = collection.length;
        _.remove(collection, function (item) { return !_.some(newCollection, function (c) { return c[index] === item[index]; }); });
        return collection.length !== oldLength;
    }
    ArrayHelpers.removeElements = removeElements;
    /**
     * Changes the existing collection to match the new collection to avoid re-assigning
     * the array pointer, returns true if the array size has changed
     */
    function sync(collection, newCollection, index) {
        if (index === void 0) { index = 'id'; }
        var answer = removeElements(collection, newCollection, index);
        if (newCollection) {
            newCollection.forEach(function (item) {
                var oldItem = _.find(collection, function (c) { return c[index] === item[index]; });
                if (!oldItem) {
                    answer = true;
                    collection.push(item);
                }
                else {
                    if (item !== oldItem) {
                        angular.copy(item, oldItem);
                        answer = true;
                    }
                }
            });
        }
        return answer;
    }
    ArrayHelpers.sync = sync;
})(ArrayHelpers || (ArrayHelpers = {}));
var StringHelpers;
(function (StringHelpers) {
    var dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:/i;
    function isDate(str) {
        if (!angular.isString(str)) {
            // we only deal with strings
            return false;
        }
        return dateRegex.test(str);
    }
    StringHelpers.isDate = isDate;
    /**
     * Convert a string into a bunch of '*' of the same length
     * @param str
     * @returns {string}
     */
    function obfusicate(str) {
        if (!angular.isString(str)) {
            // return null so we don't show any old random non-string thing
            return null;
        }
        return str.split('').map(function (c) { return '*'; }).join('');
    }
    StringHelpers.obfusicate = obfusicate;
    /**
     * Simple toString that obscures any field called 'password'
     * @param obj
     * @returns {string}
     */
    function toString(obj) {
        if (!obj) {
            return '{ null }';
        }
        var answer = [];
        angular.forEach(obj, function (value, key) {
            var val = value;
            if (('' + key).toLowerCase() === 'password') {
                val = StringHelpers.obfusicate(value);
            }
            else if (angular.isObject(val)) {
                val = toString(val);
            }
            answer.push(key + ': ' + val);
        });
        return '{ ' + answer.join(', ') + ' }';
    }
    StringHelpers.toString = toString;
})(StringHelpers || (StringHelpers = {}));
/// <reference path="baseHelpers.ts"/>
var UrlHelpers;
(function (UrlHelpers) {
    var log = Logger.get("hawtio-core-utils-url-helpers");
    /**
     * Returns the URL without the starting '#' if it's there
     * @param url
     * @returns {string}
     */
    function noHash(url) {
        if (url && _.startsWith(url, '#')) {
            return url.substring(1);
        }
        else {
            return url;
        }
    }
    UrlHelpers.noHash = noHash;
    function extractPath(url) {
        if (url.indexOf('?') !== -1) {
            return url.split('?')[0];
        }
        else {
            return url;
        }
    }
    UrlHelpers.extractPath = extractPath;
    /**
     * Returns whether or not the context is in the supplied URL.  If the search string starts/ends with '/' then the entire URL is checked.  If the search string doesn't start with '/' then the search string is compared against the end of the URL.  If the search string starts with '/' but doesn't end with '/' then the start of the URL is checked, excluding any '#'
     * @param url
     * @param thingICareAbout
     * @returns {boolean}
     */
    function contextActive(url, thingICareAbout) {
        var cleanUrl = extractPath(url);
        if (_.endsWith(thingICareAbout, '/') && _.startsWith(thingICareAbout, "/")) {
            return cleanUrl.indexOf(thingICareAbout) > -1;
        }
        if (_.startsWith(thingICareAbout, "/")) {
            return _.startsWith(noHash(cleanUrl), thingICareAbout);
        }
        return _.endsWith(cleanUrl, thingICareAbout);
    }
    UrlHelpers.contextActive = contextActive;
    /**
     * Joins the supplied strings together using '/', stripping any leading/ending '/'
     * from the supplied strings if needed, except the first and last string
     * @returns {string}
     */
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var tmp = [];
        var length = paths.length - 1;
        paths.forEach(function (path, index) {
            if (Core.isBlank(path)) {
                return;
            }
            if (path === '/') {
                tmp.push('');
                return;
            }
            if (index !== 0 && path.match(/^\//)) {
                path = path.slice(1);
            }
            if (index !== length && path.match(/\/$/)) {
                path = path.slice(0, path.length - 1);
            }
            if (!Core.isBlank(path)) {
                tmp.push(path);
            }
        });
        var rc = tmp.join('/');
        return rc;
    }
    UrlHelpers.join = join;
    function parseQueryString(text) {
        var uri = new URI(text);
        return URI.parseQuery(uri.query());
    }
    UrlHelpers.parseQueryString = parseQueryString;
    /**
     * Apply a proxy to the supplied URL if the jolokiaUrl is using the proxy, or if the URL is for a a different host/port
     * @param jolokiaUrl
     * @param url
     * @returns {*}
     */
    function maybeProxy(jolokiaUrl, url) {
        if (jolokiaUrl && _.startsWith(jolokiaUrl, 'proxy/')) {
            log.debug("Jolokia URL is proxied, applying proxy to:", url);
            return join('proxy', url);
        }
        var origin = window.location['origin'];
        if (url && (_.startsWith(url, 'http') && !_.startsWith(url, origin))) {
            log.debug("Url doesn't match page origin:", origin, "applying proxy to:", url);
            return join('proxy', url);
        }
        log.debug("No need to proxy:", url);
        return url;
    }
    UrlHelpers.maybeProxy = maybeProxy;
    /**
     * Escape any colons in the URL for ng-resource, mostly useful for handling proxified URLs
     * @param url
     * @returns {*}
     */
    function escapeColons(url) {
        var answer = url;
        if (_.startsWith(url, 'proxy')) {
            answer = url.replace(/:/g, '\\:');
        }
        else {
            answer = url.replace(/:([^\/])/, '\\:$1');
        }
        return answer;
    }
    UrlHelpers.escapeColons = escapeColons;
})(UrlHelpers || (UrlHelpers = {}));
/// <reference path="stringHelpers.ts"/>
/// <reference path="urlHelpers.ts"/>
var Core;
(function (Core) {
    var _urlPrefix = null;
    /**
     * Private method to support testing.
     *
     * @private
     */
    function _resetUrlPrefix() {
        _urlPrefix = null;
    }
    Core._resetUrlPrefix = _resetUrlPrefix;
    /**
     * Prefixes absolute URLs with current window.location.pathname
     *
     * @param path
     * @returns {string}
     */
    function url(path) {
        if (path) {
            if (_.startsWith(path, "/")) {
                if (!_urlPrefix) {
                    // lets discover the base url via the base html element
                    _urlPrefix = $('base').attr('href') || "";
                    if (_.endsWith(_urlPrefix, '/')) {
                        _urlPrefix = _urlPrefix.substring(0, _urlPrefix.length - 1);
                    }
                }
                if (_urlPrefix) {
                    return _urlPrefix + path;
                }
            }
        }
        return path;
    }
    Core.url = url;
    /**
     * Returns location of the global window
     *
     * @returns {string}
     */
    function windowLocation() {
        return window.location;
    }
    Core.windowLocation = windowLocation;
    function unescapeHTML(str) {
        var txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }
    Core.unescapeHTML = unescapeHTML;
    /**
     * Trims the leading prefix from a string if its present
     * @method trimLeading
     * @for Core
     * @static
     * @param {String} text
     * @param {String} prefix
     * @return {String}
     */
    function trimLeading(text, prefix) {
        if (text && prefix) {
            if (_.startsWith(text, prefix) || text.indexOf(prefix) === 0) {
                return text.substring(prefix.length);
            }
        }
        return text;
    }
    Core.trimLeading = trimLeading;
    /**
     * Trims the trailing postfix from a string if its present
     * @method trimTrailing
     * @for Core
     * @static
     * @param {String} trim
     * @param {String} postfix
     * @return {String}
     */
    function trimTrailing(text, postfix) {
        if (text && postfix) {
            if (_.endsWith(text, postfix)) {
                return text.substring(0, text.length - postfix.length);
            }
        }
        return text;
    }
    Core.trimTrailing = trimTrailing;
    /**
     * Ensure our main app container takes up at least the viewport
     * height
     */
    function adjustHeight() {
        var windowHeight = $(window).height();
        var headerHeight = $("#main-nav").height();
        var containerHeight = windowHeight - headerHeight;
        $("#main").css("min-height", "" + containerHeight + "px");
    }
    Core.adjustHeight = adjustHeight;
    function isChromeApp() {
        var answer = false;
        try {
            answer = (chrome && chrome.app && chrome.extension) ? true : false;
        }
        catch (e) {
            answer = false;
        }
        //log.info("isChromeApp is: " + answer);
        return answer;
    }
    Core.isChromeApp = isChromeApp;
    /**
     * Adds the specified CSS file to the document's head, handy
     * for external plugins that might bring along their own CSS
     *
     * @param path
     */
    function addCSS(path) {
        if ('createStyleSheet' in document) {
            // IE9
            document.createStyleSheet(path);
        }
        else {
            // Everyone else
            var link = $("<link>");
            $("head").append(link);
            link.attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: path
            });
        }
    }
    Core.addCSS = addCSS;
    var dummyStorage = {};
    /**
     * Wrapper to get the window local storage object
     *
     * @returns {WindowLocalStorage}
     */
    function getLocalStorage() {
        // TODO Create correct implementation of windowLocalStorage
        var storage = window.localStorage || (function () {
            return dummyStorage;
        })();
        return storage;
    }
    Core.getLocalStorage = getLocalStorage;
    /**
     * If the value is not an array then wrap it in one
     *
     * @method asArray
     * @for Core
     * @static
     * @param {any} value
     * @return {Array}
     */
    function asArray(value) {
        return angular.isArray(value) ? value : [value];
    }
    Core.asArray = asArray;
    /**
     * Ensure whatever value is passed in is converted to a boolean
     *
     * In the branding module for now as it's needed before bootstrap
     *
     * @method parseBooleanValue
     * @for Core
     * @param {any} value
     * @param {Boolean} defaultValue default value to use if value is not defined
     * @return {Boolean}
     */
    function parseBooleanValue(value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        if (!angular.isDefined(value) || !value) {
            return defaultValue;
        }
        if (value.constructor === Boolean) {
            return value;
        }
        if (angular.isString(value)) {
            switch (value.toLowerCase()) {
                case "true":
                case "1":
                case "yes":
                    return true;
                default:
                    return false;
            }
        }
        if (angular.isNumber(value)) {
            return value !== 0;
        }
        throw new Error("Can't convert value " + value + " to boolean");
    }
    Core.parseBooleanValue = parseBooleanValue;
    function toString(value) {
        if (angular.isNumber(value)) {
            return numberToString(value);
        }
        else {
            return angular.toJson(value, true);
        }
    }
    Core.toString = toString;
    /**
     * Converts boolean value to string "true" or "false"
     *
     * @param value
     * @returns {string}
     */
    function booleanToString(value) {
        return "" + value;
    }
    Core.booleanToString = booleanToString;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseIntValue(value, description) {
        if (description === void 0) { description = "integer"; }
        if (angular.isString(value)) {
            try {
                return parseInt(value);
            }
            catch (e) {
                console.log("Failed to parse " + description + " with text '" + value + "'");
            }
        }
        else if (angular.isNumber(value)) {
            return value;
        }
        return null;
    }
    Core.parseIntValue = parseIntValue;
    /**
     * Formats numbers as Strings.
     *
     * @param value
     * @returns {string}
     */
    function numberToString(value) {
        return "" + value;
    }
    Core.numberToString = numberToString;
    /**
     * object to integer converter
     *
     * @param value
     * @param description
     * @returns {*}
     */
    function parseFloatValue(value, description) {
        if (description === void 0) { description = "float"; }
        if (angular.isString(value)) {
            try {
                return parseFloat(value);
            }
            catch (e) {
                console.log("Failed to parse " + description + " with text '" + value + "'");
            }
        }
        else if (angular.isNumber(value)) {
            return value;
        }
        return null;
    }
    Core.parseFloatValue = parseFloatValue;
    /**
     * Navigates the given set of paths in turn on the source object
     * and returns the last most value of the path or null if it could not be found.
     *
     * @method pathGet
     * @for Core
     * @static
     * @param {Object} object the start object to start navigating from
     * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
     * @return {*} the last step on the path which is updated
     */
    function pathGet(object, paths) {
        var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
        var value = object;
        angular.forEach(pathArray, function (name) {
            if (value) {
                try {
                    value = value[name];
                }
                catch (e) {
                    // ignore errors
                    return null;
                }
            }
            else {
                return null;
            }
        });
        return value;
    }
    Core.pathGet = pathGet;
    /**
     * Navigates the given set of paths in turn on the source object
     * and updates the last path value to the given newValue
     *
     * @method pathSet
     * @for Core
     * @static
     * @param {Object} object the start object to start navigating from
     * @param {Array} paths an array of path names to navigate or a string of dot separated paths to navigate
     * @param {Object} newValue the value to update
     * @return {*} the last step on the path which is updated
     */
    function pathSet(object, paths, newValue) {
        var pathArray = (angular.isArray(paths)) ? paths : (paths || "").split(".");
        var value = object;
        var lastIndex = pathArray.length - 1;
        angular.forEach(pathArray, function (name, idx) {
            var next = value[name];
            if (idx >= lastIndex || !angular.isObject(next)) {
                next = (idx < lastIndex) ? {} : newValue;
                value[name] = next;
            }
            value = next;
        });
        return value;
    }
    Core.pathSet = pathSet;
    function getPhase($scope) {
        if ($scope.$$phase) {
            return $scope.$$phase;
        }
        if (HawtioCore.injector) {
            var $rootScope = HawtioCore.injector.get('$rootScope');
            if ($rootScope) {
                return $rootScope.$$phase;
            }
        }
    }
    /**
     * Performs a $scope.$apply() if not in a digest right now otherwise it will fire a digest later
     *
     * @method $applyNowOrLater
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $applyNowOrLater($scope) {
        if (getPhase($scope)) {
            setTimeout(function () {
                Core.$apply($scope);
            }, 50);
        }
        else {
            $scope.$apply();
        }
    }
    Core.$applyNowOrLater = $applyNowOrLater;
    /**
     * Performs a $scope.$apply() after the given timeout period
     *
     * @method $applyLater
     * @for Core
     * @static
     * @param {*} $scope
     * @param {Integer} timeout
     */
    function $applyLater($scope, timeout) {
        if (timeout === void 0) { timeout = 50; }
        setTimeout(function () {
            Core.$apply($scope);
        }, timeout);
    }
    Core.$applyLater = $applyLater;
    /**
     * Performs a $scope.$apply() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $apply($scope) {
        var phase = getPhase($scope);
        if (!phase) {
            $scope.$apply();
        }
    }
    Core.$apply = $apply;
    /**
     * Performs a $scope.$digest() if not in a digest or apply phase on the given scope
     *
     * @method $apply
     * @for Core
     * @static
     * @param {*} $scope
     */
    function $digest($scope) {
        var phase = getPhase($scope);
        if (!phase) {
            $scope.$digest();
        }
    }
    Core.$digest = $digest;
    /**
     * Look up a list of child element names or lazily create them.
     *
     * Useful for example to get the <tbody> <tr> element from a <table> lazily creating one
     * if not present.
     *
     * Usage: var trElement = getOrCreateElements(tableElement, ["tbody", "tr"])
     * @method getOrCreateElements
     * @for Core
     * @static
     * @param {Object} domElement
     * @param {Array} arrayOfElementNames
     * @return {Object}
     */
    function getOrCreateElements(domElement, arrayOfElementNames) {
        var element = domElement;
        angular.forEach(arrayOfElementNames, function (name) {
            if (element) {
                var children = $(element).children(name);
                if (!children || !children.length) {
                    $("<" + name + "></" + name + ">").appendTo(element);
                    children = $(element).children(name);
                }
                element = children;
            }
        });
        return element;
    }
    Core.getOrCreateElements = getOrCreateElements;
    var _escapeHtmlChars = {
        "#": "&#35;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
    };
    /**
     * static unescapeHtml
     *
     * @param str
     * @returns {any}
     */
    function unescapeHtml(str) {
        angular.forEach(_escapeHtmlChars, function (value, key) {
            var regex = new RegExp(value, "g");
            str = str.replace(regex, key);
        });
        str = str.replace(/&gt;/g, ">");
        return str;
    }
    Core.unescapeHtml = unescapeHtml;
    /**
     * static escapeHtml method
     *
     * @param str
     * @returns {*}
     */
    function escapeHtml(str) {
        if (angular.isString(str)) {
            var newStr = "";
            for (var i = 0; i < str.length; i++) {
                var ch = str.charAt(i);
                ch = _escapeHtmlChars[ch] || ch;
                newStr += ch;
            }
            return newStr;
        }
        else {
            return str;
        }
    }
    Core.escapeHtml = escapeHtml;
    /**
     * Returns true if the string is either null or empty
     *
     * @method isBlank
     * @for Core
     * @static
     * @param {String} str
     * @return {Boolean}
     */
    function isBlank(str) {
        if (str === undefined || str === null) {
            return true;
        }
        if (angular.isString(str)) {
            return str.trim().length === 0;
        }
        else {
            // TODO - not undefined but also not a string...
            return false;
        }
    }
    Core.isBlank = isBlank;
    /**
     * removes all quotes/apostrophes from beginning and end of string
     *
     * @param text
     * @returns {string}
     */
    function trimQuotes(text) {
        var quotes = '\'"';
        var answer = _.trimStart(text, quotes);
        if (text && answer.length < text.length) {
            return _.trimEnd(answer, quotes);
        }
        else {
            return text;
        }
    }
    Core.trimQuotes = trimQuotes;
    /**
     * Converts camel-case and dash-separated strings into Human readable forms
     *
     * @param value
     * @returns {*}
     */
    function humanizeValue(value) {
        if (value) {
            var text = value + '';
            if (Core.isBlank(text)) {
                return text;
            }
            try {
                text = _.snakeCase(text);
                text = _.capitalize(text.split('_').join(' '));
            }
            catch (e) {
                // ignore
            }
            return trimQuotes(text);
        }
        return value;
    }
    Core.humanizeValue = humanizeValue;
})(Core || (Core = {}));
var HawtioCompile;
(function (HawtioCompile) {
    var pluginName = 'hawtio-core-compile';
    var log = Logger.get(pluginName);
    HawtioCompile._module = angular
        .module(pluginName, [])
        .run(function () {
        log.debug("Module loaded");
    })
        .directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                scope.$watch(function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                }, function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                });
            };
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(HawtioCompile || (HawtioCompile = {}));
var ControllerHelpers;
(function (ControllerHelpers) {
    var log = Logger.get("hawtio-core-utils-controller-helpers");
    function createClassSelector(config) {
        return function (selector, model) {
            if (selector === model && selector in config) {
                return config[selector];
            }
            return '';
        };
    }
    ControllerHelpers.createClassSelector = createClassSelector;
    function createValueClassSelector(config) {
        return function (model) {
            if (model in config) {
                return config[model];
            }
            else {
                return '';
            }
        };
    }
    ControllerHelpers.createValueClassSelector = createValueClassSelector;
    /**
     * Binds a $location.search() property to a model on a scope; so that its initialised correctly on startup
     * and its then watched so as the model changes, the $location.search() is updated to reflect its new value
     * @method bindModelToSearchParam
     * @for Core
     * @static
     * @param {*} $scope
     * @param {ng.ILocationService} $location
     * @param {String} modelName
     * @param {String} paramName
     * @param {Object} initialValue
     */
    function bindModelToSearchParam($scope, $location, modelName, paramName, initialValue, to, from) {
        if (!(modelName in $scope)) {
            $scope[modelName] = initialValue;
        }
        var toConverter = to || Core.doNothing;
        var fromConverter = from || Core.doNothing;
        function currentValue() {
            return fromConverter($location.search()[paramName] || initialValue);
        }
        var value = currentValue();
        Core.pathSet($scope, modelName, value);
        $scope.$watch(modelName, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (newValue !== undefined && newValue !== null) {
                    $location.search(paramName, toConverter(newValue));
                }
                else {
                    $location.search(paramName, '');
                }
            }
        });
    }
    ControllerHelpers.bindModelToSearchParam = bindModelToSearchParam;
    /**
     * For controllers where reloading is disabled via "reloadOnSearch: false" on the registration; lets pick which
     * query parameters need to change to force the reload. We default to the JMX selection parameter 'nid'
     * @method reloadWhenParametersChange
     * @for Core
     * @static
     * @param {Object} $route
     * @param {*} $scope
     * @param {ng.ILocationService} $location
     * @param {string[]} parameters
     */
    function reloadWhenParametersChange($route, $scope, $location, parameters) {
        if (parameters === void 0) { parameters = ["nid"]; }
        var initial = angular.copy($location.search());
        $scope.$on('$routeUpdate', function () {
            // lets check if any of the parameters changed
            var current = $location.search();
            var changed = [];
            angular.forEach(parameters, function (param) {
                if (current[param] !== initial[param]) {
                    changed.push(param);
                }
            });
            if (changed.length) {
                log.debug("Reloading page due to change to parameters:", changed);
                $route.reload();
            }
        });
    }
    ControllerHelpers.reloadWhenParametersChange = reloadWhenParametersChange;
})(ControllerHelpers || (ControllerHelpers = {}));
/// <reference path="baseHelpers.ts"/>
/// <reference path="controllerHelpers.ts"/>
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-utils");
    Core.lazyLoaders = {};
    Core.numberTypeNames = {
        'byte': true,
        'short': true,
        'int': true,
        'long': true,
        'float': true,
        'double': true,
        'java.lang.byte': true,
        'java.lang.short': true,
        'java.lang.integer': true,
        'java.lang.long': true,
        'java.lang.float': true,
        'java.lang.double': true
    };
    /**
     * Returns the number of lines in the given text
     *
     * @method lineCount
     * @static
     * @param {String} value
     * @return {Number}
     *
     */
    function lineCount(value) {
        var rows = 0;
        if (value) {
            rows = 1;
            value.toString().each(/\n/, function () { return rows++; });
        }
        return rows;
    }
    Core.lineCount = lineCount;
    function safeNull(value) {
        if (typeof value === 'boolean') {
            return value + '';
        }
        else if (typeof value === 'number') {
            // return numbers as-is
            return value + '';
        }
        if (value) {
            return value;
        }
        else {
            return "";
        }
    }
    Core.safeNull = safeNull;
    function safeNullAsString(value, type) {
        if (typeof value === 'boolean') {
            return "" + value;
        }
        else if (typeof value === 'number') {
            // return numbers as-is
            return "" + value;
        }
        else if (typeof value === 'string') {
            // its a string
            return "" + value;
        }
        else if (type === 'javax.management.openmbean.CompositeData' || type === '[Ljavax.management.openmbean.CompositeData;' || type === 'java.util.Map') {
            // composite data or composite data array, we just display as json
            // use json representation
            var data = angular.toJson(value, true);
            return data;
        }
        else if (type === 'javax.management.ObjectName') {
            return "" + (value == null ? "" : value.canonicalName);
        }
        else if (type === 'javax.management.openmbean.TabularData') {
            // tabular data is a key/value structure so loop each field and convert to array we can
            // turn into a String
            var arr = [];
            for (var key in value) {
                var val = value[key];
                var line = "" + key + "=" + val;
                arr.push(line);
            }
            // sort array so the values is listed nicely
            arr = _.sortBy(arr, function (row) { return row.toString(); });
            return arr.join("\n");
        }
        else if (angular.isArray(value)) {
            // join array with new line, and do not sort as the order in the array may matter
            return value.join("\n");
        }
        else if (value) {
            // force as string
            return "" + value;
        }
        else {
            return "";
        }
    }
    Core.safeNullAsString = safeNullAsString;
    /**
     * Converts the given value to an array of query arguments.
     *
     * If the value is null an empty array is returned.
     * If the value is a non empty string then the string is split by commas
     *
     * @method toSearchArgumentArray
     * @static
     * @param {*} value
     * @return {String[]}
     *
     */
    function toSearchArgumentArray(value) {
        if (value) {
            if (angular.isArray(value))
                return value;
            if (angular.isString(value))
                return value.split(',');
        }
        return [];
    }
    Core.toSearchArgumentArray = toSearchArgumentArray;
    function folderMatchesPatterns(node, patterns) {
        if (node) {
            var folderNames_1 = node.folderNames;
            if (folderNames_1) {
                return patterns.any(function (ignorePaths) {
                    for (var i = 0; i < ignorePaths.length; i++) {
                        var folderName = folderNames_1[i];
                        var ignorePath = ignorePaths[i];
                        if (!folderName)
                            return false;
                        var idx = ignorePath.indexOf(folderName);
                        if (idx < 0) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
        return false;
    }
    Core.folderMatchesPatterns = folderMatchesPatterns;
    function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e) {
            return false;
        }
    }
    Core.supportsLocalStorage = supportsLocalStorage;
    function isNumberTypeName(typeName) {
        if (typeName) {
            var text = typeName.toString().toLowerCase();
            var flag = Core.numberTypeNames[text];
            return flag;
        }
        return false;
    }
    Core.isNumberTypeName = isNumberTypeName;
    function escapeDots(text) {
        return text.replace(/\./g, '-');
    }
    Core.escapeDots = escapeDots;
    /**
     * Escapes all dots and 'span' text in the css style names to avoid clashing with bootstrap stuff
     *
     * @method escapeTreeCssStyles
     * @static
     * @param {String} text
     * @return {String}
     */
    function escapeTreeCssStyles(text) {
        return escapeDots(text).replace(/span/g, 'sp-an');
    }
    Core.escapeTreeCssStyles = escapeTreeCssStyles;
    function showLogPanel() {
        var log = $("#log-panel");
        var body = $('body');
        localStorage['showLog'] = 'true';
        log.css({ 'bottom': '50%' });
        body.css({
            'overflow-y': 'hidden'
        });
    }
    Core.showLogPanel = showLogPanel;
    /**
     * Returns the CSS class for a log level based on if its info, warn, error etc.
     *
     * @method logLevelClass
     * @static
     * @param {String} level
     * @return {String}
     */
    function logLevelClass(level) {
        if (level) {
            var first = level[0];
            if (first === 'w' || first === "W") {
                return "warning";
            }
            else if (first === 'e' || first === "E") {
                return "error";
            }
            else if (first === 'i' || first === "I") {
                return "info";
            }
            else if (first === 'd' || first === "D") {
                // we have no debug css style
                return "";
            }
        }
        return "";
    }
    Core.logLevelClass = logLevelClass;
    function toPath(hashUrl) {
        if (Core.isBlank(hashUrl)) {
            return hashUrl;
        }
        if (_.startsWith(hashUrl, "#")) {
            return hashUrl.substring(1);
        }
        else {
            return hashUrl;
        }
    }
    Core.toPath = toPath;
    /**
     * Creates a link by appending the current $location.search() hash to the given href link,
     * removing any required parameters from the link
     * @method createHref
     * @for Core
     * @static
     * @param {ng.ILocationService} $location
     * @param {String} href the link to have any $location.search() hash parameters appended
     * @param {Array} removeParams any parameters to be removed from the $location.search()
     * @return {Object} the link with any $location.search() parameters added
     */
    function createHref($location, href, removeParams) {
        if (removeParams === void 0) { removeParams = null; }
        var hashMap = angular.copy($location.search());
        // lets remove any top level nav bar related hash searches
        if (removeParams) {
            angular.forEach(removeParams, function (param) { return delete hashMap[param]; });
        }
        var hash = Core.hashToString(hashMap);
        if (hash) {
            var prefix = (href.indexOf("?") >= 0) ? "&" : "?";
            href += prefix + hash;
        }
        return href;
    }
    Core.createHref = createHref;
    /**
     * Turns the given search hash into a URI style query string
     * @method hashToString
     * @for Core
     * @static
     * @param {Object} hash
     * @return {String}
     */
    function hashToString(hash) {
        var keyValuePairs = [];
        angular.forEach(hash, function (value, key) {
            keyValuePairs.push(key + "=" + value);
        });
        var params = keyValuePairs.join("&");
        return encodeURI(params);
    }
    Core.hashToString = hashToString;
    /**
     * Parses the given string of x=y&bar=foo into a hash
     * @method stringToHash
     * @for Core
     * @static
     * @param {String} hashAsString
     * @return {Object}
     */
    function stringToHash(hashAsString) {
        var entries = {};
        if (hashAsString) {
            var text = decodeURI(hashAsString);
            var items = text.split('&');
            angular.forEach(items, function (item) {
                var kv = item.split('=');
                var key = kv[0];
                var value = kv[1] || key;
                entries[key] = value;
            });
        }
        return entries;
    }
    Core.stringToHash = stringToHash;
    /**
     * Converts the given XML node to a string representation of the XML
     * @method xmlNodeToString
     * @for Core
     * @static
     * @param {Object} xmlNode
     * @return {Object}
     */
    function xmlNodeToString(xmlNode) {
        try {
            // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
            return (new XMLSerializer()).serializeToString(xmlNode);
        }
        catch (e) {
            try {
                // Internet Explorer.
                return xmlNode.xml;
            }
            catch (e) {
                //Other browsers without XML Serializer
                console.log('WARNING: XMLSerializer not supported');
            }
        }
        return false;
    }
    Core.xmlNodeToString = xmlNodeToString;
    /**
     * Returns true if the given DOM node is a text node
     * @method isTextNode
     * @for Core
     * @static
     * @param {Object} node
     * @return {Boolean}
     */
    function isTextNode(node) {
        return node && node.nodeType === 3;
    }
    Core.isTextNode = isTextNode;
    /**
     * Returns the lowercase file extension of the given file name or returns the empty
     * string if the file does not have an extension
     * @method fileExtension
     * @for Core
     * @static
     * @param {String} name
     * @param {String} defaultValue
     * @return {String}
     */
    function fileExtension(name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        var extension = defaultValue;
        if (name) {
            var idx = name.lastIndexOf(".");
            if (idx > 0) {
                extension = name.substring(idx + 1, name.length).toLowerCase();
            }
        }
        return extension;
    }
    Core.fileExtension = fileExtension;
    function getUUID() {
        var d = new Date();
        var ms = (d.getTime() * 1000) + d.getUTCMilliseconds();
        var random = Math.floor((1 + Math.random()) * 0x10000);
        return ms.toString(16) + random.toString(16);
    }
    Core.getUUID = getUUID;
    var _versionRegex = /[^\d]*(\d+)\.(\d+)(\.(\d+))?.*/;
    /**
     * Parses some text of the form "xxxx2.3.4xxxx"
     * to extract the version numbers as an array of numbers then returns an array of 2 or 3 numbers.
     *
     * Characters before the first digit are ignored as are characters after the last digit.
     * @method parseVersionNumbers
     * @for Core
     * @static
     * @param {String} text a maven like string containing a dash then numbers separated by dots
     * @return {Array}
     */
    function parseVersionNumbers(text) {
        if (text) {
            var m = text.match(_versionRegex);
            if (m && m.length > 4) {
                var m1 = m[1];
                var m2 = m[2];
                var m4 = m[4];
                if (angular.isDefined(m4)) {
                    return [parseInt(m1), parseInt(m2), parseInt(m4)];
                }
                else if (angular.isDefined(m2)) {
                    return [parseInt(m1), parseInt(m2)];
                }
                else if (angular.isDefined(m1)) {
                    return [parseInt(m1)];
                }
            }
        }
        return null;
    }
    Core.parseVersionNumbers = parseVersionNumbers;
    /**
     * Converts a version string with numbers and dots of the form "123.456.790" into a string
     * which is sortable as a string, by left padding each string between the dots to at least 4 characters
     * so things just sort as a string.
     *
     * @param text
     * @return {string} the sortable version string
     */
    function versionToSortableString(version, maxDigitsBetweenDots) {
        if (maxDigitsBetweenDots === void 0) { maxDigitsBetweenDots = 4; }
        return (version || "").split(".").map(function (x) {
            var length = x.length;
            return (length >= maxDigitsBetweenDots)
                ? x : _.padStart(x, maxDigitsBetweenDots - length, ' ');
        }).join(".");
    }
    Core.versionToSortableString = versionToSortableString;
    function time(message, fn) {
        var start = new Date().getTime();
        var answer = fn();
        var elapsed = new Date().getTime() - start;
        console.log(message + " " + elapsed);
        return answer;
    }
    Core.time = time;
    /**
     * Compares the 2 version arrays and returns -1 if v1 is less than v2 or 0 if they are equal or 1 if v1 is greater than v2
     * @method compareVersionNumberArrays
     * @for Core
     * @static
     * @param {Array} v1 an array of version numbers with the most significant version first (major, minor, patch).
     * @param {Array} v2
     * @return {Number}
     */
    function compareVersionNumberArrays(v1, v2) {
        if (v1 && !v2) {
            return 1;
        }
        if (!v1 && v2) {
            return -1;
        }
        if (v1 === v2) {
            return 0;
        }
        for (var i = 0; i < v1.length; i++) {
            var n1 = v1[i];
            if (i >= v2.length) {
                return 1;
            }
            var n2 = v2[i];
            if (!angular.isDefined(n1)) {
                return -1;
            }
            if (!angular.isDefined(n2)) {
                return 1;
            }
            if (n1 > n2) {
                return 1;
            }
            else if (n1 < n2) {
                return -1;
            }
        }
        return 0;
    }
    Core.compareVersionNumberArrays = compareVersionNumberArrays;
    /**
     * Helper function which converts objects into tables of key/value properties and
     * lists into a <ul> for each value.
     * @method valueToHtml
     * @for Core
     * @static
     * @param {any} value
     * @return {String}
     */
    function valueToHtml(value) {
        if (angular.isArray(value)) {
            var size = value.length;
            if (!size) {
                return "";
            }
            else if (size === 1) {
                return valueToHtml(value[0]);
            }
            else {
                var buffer_1 = "<ul>";
                angular.forEach(value, function (childValue) {
                    buffer_1 += "<li>" + valueToHtml(childValue) + "</li>";
                });
                return buffer_1 + "</ul>";
            }
        }
        else if (angular.isObject(value)) {
            var buffer_2 = "<table>";
            angular.forEach(value, function (childValue, key) {
                buffer_2 += "<tr><td>" + key + "</td><td>" + valueToHtml(childValue) + "</td></tr>";
            });
            return buffer_2 + "</table>";
        }
        else if (angular.isString(value)) {
            var uriPrefixes = ["http://", "https://", "file://", "mailto:"];
            var answer_1 = value;
            angular.forEach(uriPrefixes, function (prefix) {
                if (_.startsWith(answer_1, prefix)) {
                    answer_1 = "<a href='" + value + "'>" + value + "</a>";
                }
            });
            return answer_1;
        }
        return value;
    }
    Core.valueToHtml = valueToHtml;
    /**
     * If the string starts and ends with [] {} then try parse as JSON and return the parsed content or return null
     * if it does not appear to be JSON
     * @method tryParseJson
     * @for Core
     * @static
     * @param {String} text
     * @return {Object}
     */
    function tryParseJson(text) {
        text = _.trim(text);
        if ((_.startsWith(text, "[") && _.endsWith(text, "]")) || (_.startsWith(text, "{") && _.endsWith(text, "}"))) {
            try {
                return JSON.parse(text);
            }
            catch (e) {
                // ignore
            }
        }
        return null;
    }
    Core.tryParseJson = tryParseJson;
    /**
     * Given values (n, "person") will return either "1 person" or "2 people" depending on if a plural
     * is required using the String.pluralize() function from sugarjs
     * @method maybePlural
     * @for Core
     * @static
     * @param {Number} count
     * @param {String} word
     * @return {String}
     */
    function maybePlural(count, word) {
        /* TODO - will need to find another dependency for this
        if (word.pluralize) {
          let pluralWord = (count === 1) ? word : word.pluralize();
          return "" + count + " " + pluralWord;
        } else {
        */
        var pluralWord = (count === 1) ? word : word + 's';
        return "" + count + " " + pluralWord;
        //}
    }
    Core.maybePlural = maybePlural;
    /**
     * given a JMX ObjectName of the form <code>domain:key=value,another=something</code> then return the object
     * <code>{key: "value", another: "something"}</code>
     * @method objectNameProperties
     * @for Core
     * @static
     * @param {String} name
     * @return {Object}
     */
    function objectNameProperties(objectName) {
        var entries = {};
        if (objectName) {
            var idx = objectName.indexOf(":");
            if (idx > 0) {
                var path = objectName.substring(idx + 1);
                var items = path.split(',');
                angular.forEach(items, function (item) {
                    var kv = item.split('=');
                    var key = kv[0];
                    var value = kv[1] || key;
                    entries[key] = value;
                });
            }
        }
        return entries;
    }
    Core.objectNameProperties = objectNameProperties;
    /*
    export function setPageTitle($document, title:Core.PageTitle) {
      $document.attr('title', title.getTitleWithSeparator(' '));
    }
  
    export function setPageTitleWithTab($document, title:Core.PageTitle, tab:string) {
      $document.attr('title', title.getTitleWithSeparator(' ') + " " + tab);
    }
    */
    /**
     * Removes dodgy characters from a value such as '/' or '.' so that it can be used as a DOM ID value
     * and used in jQuery / CSS selectors
     * @method toSafeDomID
     * @for Core
     * @static
     * @param {String} text
     * @return {String}
     */
    function toSafeDomID(text) {
        return text ? text.replace(/(\/|\.)/g, "_") : text;
    }
    Core.toSafeDomID = toSafeDomID;
    /**
     * Invokes the given function on each leaf node in the array of folders
     * @method forEachLeafFolder
     * @for Core
     * @static
     * @param {Array[Folder]} folders
     * @param {Function} fn
     */
    function forEachLeafFolder(folders, fn) {
        angular.forEach(folders, function (folder) {
            var children = folder["children"];
            if (angular.isArray(children) && children.length > 0) {
                forEachLeafFolder(children, fn);
            }
            else {
                fn(folder);
            }
        });
    }
    Core.forEachLeafFolder = forEachLeafFolder;
    function extractHashURL(url) {
        var parts = url.split('#');
        if (parts.length === 0) {
            return url;
        }
        var answer = parts[1];
        if (parts.length > 1) {
            var remaining = parts.slice(2);
            remaining.forEach(function (part) {
                answer = answer + "#" + part;
            });
        }
        return answer;
    }
    Core.extractHashURL = extractHashURL;
    var httpRegex = new RegExp('^(https?):\/\/(([^:/?#]*)(?::([0-9]+))?)');
    /**
     * Breaks a URL up into a nice object
     * @method parseUrl
     * @for Core
     * @static
     * @param url
     * @returns object
     */
    function parseUrl(url) {
        if (Core.isBlank(url)) {
            return null;
        }
        var matches = url.match(httpRegex);
        if (matches === null) {
            return null;
        }
        //log.debug("matches: ", matches);
        var scheme = matches[1];
        var host = matches[3];
        var port = matches[4];
        var parts = null;
        if (!Core.isBlank(port)) {
            parts = url.split(port);
        }
        else {
            parts = url.split(host);
        }
        // make sure we use port as a number
        var portNum = Core.parseIntValue(port);
        var path = parts[1];
        if (path && _.startsWith(path, '/')) {
            path = path.slice(1, path.length);
        }
        //log.debug("parts: ", parts);
        return {
            scheme: scheme,
            host: host,
            port: portNum,
            path: path
        };
    }
    Core.parseUrl = parseUrl;
    function getDocHeight() {
        var D = document;
        return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
    }
    Core.getDocHeight = getDocHeight;
    /**
     * If a URL is external to the current web application, then
     * replace the URL with the proxy servlet URL
     * @method useProxyIfExternal
     * @for Core
     * @static
     * @param {String} connectUrl
     * @return {String}
     */
    function useProxyIfExternal(connectUrl) {
        if (Core.isChromeApp()) {
            return connectUrl;
        }
        var host = window.location.host;
        if (!_.startsWith(connectUrl, "http://" + host + "/") && !_.startsWith(connectUrl, "https://" + host + "/")) {
            // lets remove the http stuff
            var idx = connectUrl.indexOf("://");
            if (idx > 0) {
                connectUrl = connectUrl.substring(idx + 3);
            }
            // lets replace the : with a /
            connectUrl = connectUrl.replace(":", "/");
            connectUrl = Core.trimLeading(connectUrl, "/");
            connectUrl = Core.trimTrailing(connectUrl, "/");
            connectUrl = Core.url("/proxy/" + connectUrl);
        }
        return connectUrl;
    }
    Core.useProxyIfExternal = useProxyIfExternal;
    /*
    export function checkInjectorLoaded() {
      // TODO sometimes the injector is not yet initialised; so lets try initialise it here just in case
      if (!Core.injector) {
        Core.injector = angular.element(document.documentElement).injector();
      }
    }
    */
    /**
     * Extracts the url of the target, eg usually http://localhost:port, but if we use fabric to proxy to another host,
     * then we return the url that we proxied too (eg the real target)
     *
     * @param {ng.ILocationService} $location
     * @param {String} scheme to force use a specific scheme, otherwise the scheme from location is used
     * @param {Number} port to force use a specific port number, otherwise the port from location is used
     */
    function extractTargetUrl($location, scheme, port) {
        if (angular.isUndefined(scheme)) {
            scheme = $location.scheme();
        }
        var host = $location.host();
        //  $location.search()['url']; does not work for some strange reason
        // let qUrl = $location.search()['url'];
        // if its a proxy request using hawtio-proxy servlet, then the url parameter
        // has the actual host/port
        var qUrl = $location.absUrl();
        var idx = qUrl.indexOf("url=");
        if (idx > 0) {
            qUrl = qUrl.substr(idx + 4);
            var value = decodeURIComponent(qUrl);
            if (value) {
                idx = value.indexOf("/proxy/");
                // after proxy we have host and optional port (if port is not 80)
                if (idx > 0) {
                    value = value.substr(idx + 7);
                    // if the path has http:// or some other scheme in it lets trim that off
                    idx = value.indexOf("://");
                    if (idx > 0) {
                        value = value.substr(idx + 3);
                    }
                    var data = value.split("/");
                    if (data.length >= 1) {
                        host = data[0];
                    }
                    if (angular.isUndefined(port) && data.length >= 2) {
                        var qPort = Core.parseIntValue(data[1], "port number");
                        if (qPort) {
                            port = qPort;
                        }
                    }
                }
            }
        }
        if (angular.isUndefined(port)) {
            port = $location.port();
        }
        var url = scheme + "://" + host;
        if (port != 80) {
            url += ":" + port;
        }
        return url;
    }
    Core.extractTargetUrl = extractTargetUrl;
    /**
     * Returns true if the $location is from the hawtio proxy
     */
    function isProxyUrl($location) {
        var url = $location.url();
        return url.indexOf('/hawtio/proxy/') > 0;
    }
    Core.isProxyUrl = isProxyUrl;
    /**
     * handy do nothing converter for the below function
     **/
    function doNothing(value) { return value; }
    Core.doNothing = doNothing;
    // moved these into their own helper file
    Core.bindModelToSearchParam = ControllerHelpers.bindModelToSearchParam;
    Core.reloadWhenParametersChange = ControllerHelpers.reloadWhenParametersChange;
    /**
     * Returns a new function which ensures that the delegate function is only invoked at most once
     * within the given number of millseconds
     * @method throttled
     * @for Core
     * @static
     * @param {Function} fn the function to be invoked at most once within the given number of millis
     * @param {Number} millis the time window during which this function should only be called at most once
     * @return {Object}
     */
    function throttled(fn, millis) {
        var nextInvokeTime = 0;
        var lastAnswer = null;
        return function () {
            var now = Date.now();
            if (nextInvokeTime < now) {
                nextInvokeTime = now + millis;
                lastAnswer = fn();
            }
            else {
                //log.debug("Not invoking function as we did call " + (now - (nextInvokeTime - millis)) + " ms ago");
            }
            return lastAnswer;
        };
    }
    Core.throttled = throttled;
    /**
     * Attempts to parse the given JSON text and returns the JSON object structure or null.
     *Bad JSON is logged at info level.
     *
     * @param text a JSON formatted string
     * @param message description of the thing being parsed logged if its invalid
     */
    function parseJsonText(text, message) {
        if (message === void 0) { message = "JSON"; }
        var answer = null;
        try {
            answer = angular.fromJson(text);
        }
        catch (e) {
            log.info("Failed to parse " + message + " from: " + text + ". " + e);
        }
        return answer;
    }
    Core.parseJsonText = parseJsonText;
    /**
     * Returns the humanized markup of the given value
     */
    function humanizeValueHtml(value) {
        var formattedValue = "";
        if (value === true) {
            formattedValue = '<i class="icon-check"></i>';
        }
        else if (value === false) {
            formattedValue = '<i class="icon-check-empty"></i>';
        }
        else {
            formattedValue = Core.humanizeValue(value);
        }
        return formattedValue;
    }
    Core.humanizeValueHtml = humanizeValueHtml;
    /**
     * Gets a query value from the given url
     *
     * @param url  url
     * @param parameterName the uri parameter value to get
     * @returns {*}
     */
    function getQueryParameterValue(url, parameterName) {
        var parts;
        var query = (url || '').split('?');
        if (query && query.length > 0) {
            parts = query[1];
        }
        else {
            parts = '';
        }
        var vars = parts.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == parameterName) {
                return decodeURIComponent(pair[1]);
            }
        }
        // not found
        return null;
    }
    Core.getQueryParameterValue = getQueryParameterValue;
    /**
     * Takes a value in ms and returns a human readable
     * duration
     * @param value
     */
    function humanizeMilliseconds(value) {
        if (!angular.isNumber(value)) {
            return "XXX";
        }
        var seconds = value / 1000;
        var years = Math.floor(seconds / 31536000);
        if (years) {
            return maybePlural(years, "year");
        }
        var days = Math.floor((seconds %= 31536000) / 86400);
        if (days) {
            return maybePlural(days, "day");
        }
        var hours = Math.floor((seconds %= 86400) / 3600);
        if (hours) {
            return maybePlural(hours, 'hour');
        }
        var minutes = Math.floor((seconds %= 3600) / 60);
        if (minutes) {
            return maybePlural(minutes, 'minute');
        }
        seconds = Math.floor(seconds % 60);
        if (seconds) {
            return maybePlural(seconds, 'second');
        }
        return value + " ms";
    }
    Core.humanizeMilliseconds = humanizeMilliseconds;
    /*
      export function storeConnectionRegex(regexs, name, json) {
        if (!regexs.any((r) => { r['name'] === name })) {
          let regex:string = '';
  
          if (json['useProxy']) {
            regex = '/hawtio/proxy/';
          } else {
            regex = '//';
          }
          regex += json['host'] + ':' + json['port'] + '/' + json['path'];
          regexs.push({
            name: name,
            regex: regex.escapeURL(true),
            color: UI.colors.sample()
          });
          writeRegexs(regexs);
        }
      }
    */
    function getRegexs() {
        var regexs = [];
        try {
            regexs = angular.fromJson(localStorage['regexs']);
        }
        catch (e) {
            // corrupted config
            delete localStorage['regexs'];
        }
        return regexs;
    }
    Core.getRegexs = getRegexs;
    function removeRegex(name) {
        var regexs = Core.getRegexs();
        var hasFunc = function (r) { return r['name'] === name; };
        if (regexs.any(hasFunc)) {
            regexs = regexs.exclude(hasFunc);
            Core.writeRegexs(regexs);
        }
    }
    Core.removeRegex = removeRegex;
    function writeRegexs(regexs) {
        localStorage['regexs'] = angular.toJson(regexs);
    }
    Core.writeRegexs = writeRegexs;
    function maskPassword(value) {
        if (value) {
            var text = '' + value;
            // we use the same patterns as in Apache Camel in its
            // org.apache.camel.util.URISupport.sanitizeUri
            var userInfoPattern = "(.*://.*:)(.*)(@)";
            value = value.replace(new RegExp(userInfoPattern, 'i'), "$1xxxxxx$3");
        }
        return value;
    }
    Core.maskPassword = maskPassword;
    /**
     * Match the given filter against the text, ignoring any case.
     * <p/>
     * This operation will regard as a match if either filter or text is null/undefined.
     * As its used for filtering out, unmatched.
     * <p/>
     *
     * @param text   the text
     * @param filter the filter
     * @return true if matched, false if not.
     */
    function matchFilterIgnoreCase(text, filter) {
        if (angular.isUndefined(text) || angular.isUndefined(filter)) {
            return true;
        }
        if (text == null || filter == null) {
            return true;
        }
        text = text.toString().trim().toLowerCase();
        filter = filter.toString().trim().toLowerCase();
        if (text.length === 0 || filter.length === 0) {
            return true;
        }
        // there can be more tokens separated by comma
        var tokens = filter.split(",");
        // filter out empty tokens, and make sure its trimmed
        tokens = tokens.filter(function (t) {
            return t.length > 0;
        }).map(function (t) {
            return t.trim();
        });
        // match if any of the tokens matches the text
        var answer = tokens.some(function (t) {
            var bool = text.indexOf(t) > -1;
            return bool;
        });
        return answer;
    }
    Core.matchFilterIgnoreCase = matchFilterIgnoreCase;
})(Core || (Core = {}));
/// <reference path="coreHelpers.ts" />
var CoreFilters;
(function (CoreFilters) {
    var pluginName = 'hawtio-core-filters';
    var _module = angular.module(pluginName, []);
    _module.filter("valueToHtml", function () { return Core.valueToHtml; });
    _module.filter('humanize', function () { return Core.humanizeValue; });
    _module.filter('humanizeMs', function () { return Core.humanizeMilliseconds; });
    _module.filter('maskPassword', function () { return Core.maskPassword; });
    // relativeTime was the first humanize filter for dates,
    // let's maybe also add a 'humanizeDate' filter to match
    // up with 'humanizeDuration'
    var relativeTimeFunc = function (date) {
        return humandate.relativeTime(date);
    };
    // Turn a date into a relative time from right now
    _module.filter('relativeTime', function () {
        return relativeTimeFunc;
    });
    _module.filter('humanizeDate', function () {
        return relativeTimeFunc;
    });
    // Output a duration in milliseconds in a human-readable format
    _module.filter('humanizeDuration', function () {
        return function (duration) {
            return humanizeDuration(duration, { round: true });
        };
    });
    hawtioPluginLoader.addModule(pluginName);
})(CoreFilters || (CoreFilters = {}));
/// <reference path="baseHelpers.ts"/>
var FilterHelpers;
(function (FilterHelpers) {
    FilterHelpers.log = Logger.get("hawtio-core-utils-filter-helpers");
    function search(object, filter, maxDepth, and) {
        if (maxDepth === void 0) { maxDepth = -1; }
        if (and === void 0) { and = true; }
        var f = filter.split(" ");
        var matches = _.filter(f, function (f) { return searchObject(object, f, maxDepth); });
        if (and) {
            return matches.length === f.length;
        }
        else {
            return matches.length > 0;
        }
    }
    FilterHelpers.search = search;
    /**
     * Tests if an object contains the text in "filter".  The function
     * only checks the values in an object and ignores keys altogether,
     * can also work with strings/numbers/arrays
     * @param object
     * @param filter
     * @returns {boolean}
     */
    function searchObject(object, filter, maxDepth, depth) {
        if (maxDepth === void 0) { maxDepth = -1; }
        if (depth === void 0) { depth = 0; }
        // avoid inifinite recursion...
        if ((maxDepth > 0 && depth >= maxDepth) || depth > 50) {
            return false;
        }
        var f = filter.toLowerCase();
        var answer = false;
        if (angular.isString(object)) {
            answer = object.toLowerCase().indexOf(f) !== -1;
        }
        else if (angular.isNumber(object)) {
            answer = ("" + object).toLowerCase().indexOf(f) !== -1;
        }
        else if (angular.isArray(object)) {
            answer = _.some(object, function (item) { return searchObject(item, f, maxDepth, depth + 1); });
        }
        else if (angular.isObject(object)) {
            answer = searchObject(_.values(object), f, maxDepth, depth);
        }
        return answer;
    }
    FilterHelpers.searchObject = searchObject;
})(FilterHelpers || (FilterHelpers = {}));
var Core;
(function (Core) {
    // interfaces that represent the response from 'list', 
    // TODO should maybe put most of this in jolokia-1.0.d.ts
    // helper functions
    function operationToString(name, args) {
        if (!args || args.length === 0) {
            return name + '()';
        }
        else {
            return name + '(' + args.map(function (arg) {
                if (angular.isString(arg)) {
                    arg = angular.fromJson(arg);
                }
                return arg.type;
            }).join(',') + ')';
        }
    }
    Core.operationToString = operationToString;
})(Core || (Core = {}));
var Log;
(function (Log) {
    var _stackRegex = /\s*at\s+([\w\.$_]+(\.([\w$_]+))*)\((.*)?:(\d+)\).*\[(.*)\]/;
    function formatStackTrace(exception) {
        if (!exception) {
            return '';
        }
        // turn exception into an array
        if (!angular.isArray(exception) && angular.isString(exception)) {
            exception = exception.split('\n');
        }
        if (!angular.isArray(exception)) {
            return '';
        }
        var answer = '<ul class="unstyled">\n';
        exception.forEach(function (line) { return answer += "<li>" + Log.formatStackLine(line) + "</li>\n"; });
        answer += "</ul>\n";
        return answer;
    }
    Log.formatStackTrace = formatStackTrace;
    function formatStackLine(line) {
        var match = _stackRegex.exec(line);
        if (match && match.length > 6) {
            var classAndMethod = match[1];
            var fileName = match[4];
            var line = match[5];
            var mvnCoords = match[6];
            // we can ignore line if its not present...
            if (classAndMethod && fileName && mvnCoords) {
                var className = classAndMethod;
                var idx = classAndMethod.lastIndexOf('.');
                if (idx > 0) {
                    className = classAndMethod.substring(0, idx);
                }
                var link = "#/source/view/" + mvnCoords + "/class/" + className + "/" + fileName;
                if (angular.isDefined(line)) {
                    link += "?line=" + line;
                }
                /*
                        console.log("classAndMethod: " + classAndMethod);
                        console.log("fileName: " + fileName);
                        console.log("line: " + line);
                        console.log("mvnCoords: " + mvnCoords);
                        console.log("Matched " + JSON.stringify(match));
                */
                return "<div class='stack-line'>  at <a href='" + link + "'>" + classAndMethod + "</a>(<span class='fileName'>" + fileName + "</span>:<span class='lineNumber'>" + line + "</span>)[<span class='mavenCoords'>" + mvnCoords + "</span>]</div>";
            }
        }
        var bold = true;
        if (line) {
            line = _.trim(line);
            if (_.startsWith(line, 'at')) {
                line = '  ' + line;
                bold = false;
            }
        }
        if (bold) {
            return '<pre class="stack-line bold">' + line + '</pre>';
        }
        else {
            return '<pre class="stack-line">' + line + '</pre>';
        }
    }
    Log.formatStackLine = formatStackLine;
})(Log || (Log = {}));
/**
 * Module that provides functions related to working with javascript objects
 */
var ObjectHelpers;
(function (ObjectHelpers) {
    /**
     * Convert an array of 'things' to an object, using 'index' as the attribute name for that value
     * @param arr
     * @param index
     * @param decorator
     */
    function toMap(arr, index, decorator) {
        if (!arr || arr.length === 0) {
            return {};
        }
        var answer = {};
        arr.forEach(function (item) {
            if (angular.isObject(item)) {
                answer[item[index]] = item;
                if (angular.isFunction(decorator)) {
                    decorator(item);
                }
            }
        });
        return answer;
    }
    ObjectHelpers.toMap = toMap;
})(ObjectHelpers || (ObjectHelpers = {}));
/// <reference path="urlHelpers.ts"/>
var PluginHelpers;
(function (PluginHelpers) {
    // creates a nice little shortcut function that plugins can use to easily
    // prefix controllers with the plugin name, helps avoid redundancy and typos
    function createControllerFunction(_module, pluginName) {
        return function (name, inlineAnnotatedConstructor) {
            return _module.controller(pluginName + '.' + name, inlineAnnotatedConstructor);
        };
    }
    PluginHelpers.createControllerFunction = createControllerFunction;
    // shorthand function to create a configuration for a route, saves a bit
    // of typing
    function createRoutingFunction(templateUrl) {
        return function (templateName, reloadOnSearch) {
            if (reloadOnSearch === void 0) { reloadOnSearch = true; }
            return {
                templateUrl: UrlHelpers.join(templateUrl, templateName),
                reloadOnSearch: reloadOnSearch
            };
        };
    }
    PluginHelpers.createRoutingFunction = createRoutingFunction;
})(PluginHelpers || (PluginHelpers = {}));
var Core;
(function (Core) {
    var log = Logger.get("hawtio-core-utils");
    /**
    * Parsers the given value as JSON if it is define
    */
    function parsePreferencesJson(value, key) {
        var answer = null;
        if (angular.isDefined(value)) {
            answer = Core.parseJsonText(value, "localStorage for " + key);
        }
        return answer;
    }
    Core.parsePreferencesJson = parsePreferencesJson;
    function initPreferenceScope($scope, localStorage, defaults) {
        angular.forEach(defaults, function (_default, key) {
            $scope[key] = _default['value'];
            var converter = _default['converter'];
            var formatter = _default['formatter'];
            if (!formatter) {
                formatter = function (value) { return value; };
            }
            if (!converter) {
                converter = function (value) { return value; };
            }
            if (key in localStorage) {
                var value = converter(localStorage[key]);
                log.debug("from local storage, setting ", key, " to ", value);
                $scope[key] = value;
            }
            else {
                var value = _default['value'];
                log.debug("from default, setting ", key, " to ", value);
                localStorage[key] = value;
            }
            var watchFunc = _default['override'];
            if (!watchFunc) {
                watchFunc = function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== null && newValue !== undefined) {
                        if (angular.isFunction(_default['pre'])) {
                            _default.pre(newValue);
                        }
                        var value = formatter(newValue);
                        log.debug("to local storage, setting ", key, " to ", value);
                        localStorage[key] = value;
                        if (angular.isFunction(_default['post'])) {
                            _default.post(newValue);
                        }
                    }
                };
            }
            if (_default['compareAsObject']) {
                $scope.$watch(key, watchFunc, true);
            }
            else {
                $scope.$watch(key, watchFunc);
            }
        });
    }
    Core.initPreferenceScope = initPreferenceScope;
    /**
     * Returns true if there is no validFn defined or if its defined
     * then the function returns true.
     *
     * @method isValidFunction
     * @for Perspective
     * @param {Core.Workspace} workspace
     * @param {Function} validFn
     * @param {string} perspectiveId
     * @return {boolean}
     */
    function isValidFunction(workspace, validFn, perspectiveId) {
        return !validFn || validFn(workspace, perspectiveId);
    }
    Core.isValidFunction = isValidFunction;
})(Core || (Core = {}));
/// <reference path="baseHelpers.ts"/>
var SelectionHelpers;
(function (SelectionHelpers) {
    var log = Logger.get("hawtio-core-utils-selection-helpers");
    // these functions deal with adding/using a 'selected' item on a group of objects
    function selectNone(group) {
        group.forEach(function (item) { item['selected'] = false; });
    }
    SelectionHelpers.selectNone = selectNone;
    function selectAll(group, filter) {
        group.forEach(function (item) {
            if (!filter) {
                item['selected'] = true;
            }
            else {
                if (filter(item)) {
                    item['selected'] = true;
                }
            }
        });
    }
    SelectionHelpers.selectAll = selectAll;
    function toggleSelection(item) {
        item['selected'] = !item['selected'];
    }
    SelectionHelpers.toggleSelection = toggleSelection;
    function selectOne(group, item) {
        selectNone(group);
        toggleSelection(item);
    }
    SelectionHelpers.selectOne = selectOne;
    function sync(selections, group, index) {
        group.forEach(function (item) {
            item['selected'] = _.some(selections, function (selection) { return selection[index] === item[index]; });
        });
        return _.filter(group, function (item) { return item['selected']; });
    }
    SelectionHelpers.sync = sync;
    function select(group, item, $event) {
        var ctrlKey = $event.ctrlKey;
        if (!ctrlKey) {
            if (item['selected']) {
                toggleSelection(item);
            }
            else {
                selectOne(group, item);
            }
        }
        else {
            toggleSelection(item);
        }
    }
    SelectionHelpers.select = select;
    function isSelected(item, yes, no) {
        return maybe(item['selected'], yes, no);
    }
    SelectionHelpers.isSelected = isSelected;
    // these functions deal with using a separate selection array
    function clearGroup(group) {
        group.length = 0;
    }
    SelectionHelpers.clearGroup = clearGroup;
    function toggleSelectionFromGroup(group, item, search) {
        var searchMethod = search || _.matches(item);
        if (_.some(group, searchMethod)) {
            _.remove(group, searchMethod);
        }
        else {
            group.push(item);
        }
    }
    SelectionHelpers.toggleSelectionFromGroup = toggleSelectionFromGroup;
    function stringOrBoolean(str, answer) {
        if (angular.isDefined(str)) {
            return str;
        }
        else {
            return answer;
        }
    }
    function nope(str) {
        return stringOrBoolean(str, false);
    }
    function yup(str) {
        return stringOrBoolean(str, true);
    }
    function maybe(answer, yes, no) {
        if (answer) {
            return yup(yes);
        }
        else {
            return nope(no);
        }
    }
    function isInGroup(group, item, yes, no, search) {
        if (!group) {
            return nope(no);
        }
        var searchMethod = search || _.matches(item);
        return maybe(_.some(group, searchMethod), yes, no);
    }
    SelectionHelpers.isInGroup = isInGroup;
    function filterByGroup(group, item, yes, no, search) {
        if (group.length === 0) {
            return yup(yes);
        }
        var searchMethod = search || item;
        if (angular.isArray(item)) {
            return maybe(_.intersection(group, item).length === group.length, yes, no);
        }
        else {
            return maybe(group.any(searchMethod), yes, no);
        }
    }
    SelectionHelpers.filterByGroup = filterByGroup;
    function syncGroupSelection(group, collection, attribute) {
        var newGroup = [];
        if (attribute) {
            group.forEach(function (groupItem) {
                var first = _.find(collection, function (collectionItem) {
                    return groupItem[attribute] === collectionItem[attribute];
                });
                if (first) {
                    newGroup.push(first);
                }
            });
        }
        else {
            group.forEach(function (groupItem) {
                var first = _.find(collection, function (collectionItem) {
                    return _.isEqual(groupItem, collectionItem);
                });
                if (first) {
                    newGroup.push(first);
                }
            });
        }
        clearGroup(group);
        group.push.apply(group, newGroup);
    }
    SelectionHelpers.syncGroupSelection = syncGroupSelection;
    function decorate($scope) {
        $scope.selectNone = selectNone;
        $scope.selectAll = selectAll;
        $scope.toggleSelection = toggleSelection;
        $scope.selectOne = selectOne;
        $scope.select = select;
        $scope.clearGroup = clearGroup;
        $scope.toggleSelectionFromGroup = toggleSelectionFromGroup;
        $scope.isInGroup = isInGroup;
        $scope.viewOnly = false; // true=disable checkmarks
        $scope.filterByGroup = filterByGroup;
    }
    SelectionHelpers.decorate = decorate;
})(SelectionHelpers || (SelectionHelpers = {}));
/// <reference path="coreHelpers.ts"/>
/// <reference path="controllerHelpers.ts"/>
var StorageHelpers;
(function (StorageHelpers) {
    function bindModelToLocalStorage(options) {
        var prefix = options.$scope.name + ':' || '::';
        var storageKey = prefix + options.modelName;
        var toParam = options.to || Core.doNothing;
        var fromParam = options.from || Core.doNothing;
        var toWrapper = function (value) {
            if (angular.isFunction(options.onChange)) {
                options.onChange(value);
            }
            var answer = toParam(value);
            options.localStorage[storageKey] = answer;
            return answer;
        };
        var fromWrapper = function (value) {
            if (value === undefined || value === null) {
                value = options.localStorage[storageKey];
            }
            return fromParam(value);
        };
        var storedValue = fromWrapper(undefined);
        ControllerHelpers.bindModelToSearchParam(options.$scope, options.$location, options.modelName, options.paramName, storedValue || options.initialValue, toWrapper, fromWrapper);
    }
    StorageHelpers.bindModelToLocalStorage = bindModelToLocalStorage;
})(StorageHelpers || (StorageHelpers = {}));
var UI;
(function (UI) {
    UI.scrollBarWidth = null;
    function findParentWith($scope, attribute) {
        if (attribute in $scope) {
            return $scope;
        }
        if (!$scope.$parent) {
            return null;
        }
        // let's go up the scope tree
        return findParentWith($scope.$parent, attribute);
    }
    UI.findParentWith = findParentWith;
    function getIfSet(attribute, $attr, def) {
        if (attribute in $attr) {
            var wantedAnswer = $attr[attribute];
            if (!Core.isBlank(wantedAnswer)) {
                return wantedAnswer;
            }
        }
        return def;
    }
    UI.getIfSet = getIfSet;
    /*
     * Helper function to ensure a directive attribute has some default value
     */
    function observe($scope, $attrs, key, defValue, callbackFunc) {
        if (callbackFunc === void 0) { callbackFunc = null; }
        $attrs.$observe(key, function (value) {
            if (!angular.isDefined(value)) {
                $scope[key] = defValue;
            }
            else {
                $scope[key] = value;
            }
            if (angular.isDefined(callbackFunc) && callbackFunc) {
                callbackFunc($scope[key]);
            }
        });
    }
    UI.observe = observe;
    function getScrollbarWidth() {
        if (!angular.isDefined(UI.scrollBarWidth)) {
            var div = document.createElement('div');
            div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
            div = div.firstChild;
            document.body.appendChild(div);
            UI.scrollBarWidth = div.offsetWidth - div.clientWidth;
            document.body.removeChild(div);
        }
        return UI.scrollBarWidth;
    }
    UI.getScrollbarWidth = getScrollbarWidth;
})(UI || (UI = {}));

angular.module('hawtio-core').run(['$templateCache', function($templateCache) {$templateCache.put('about/about.component.html','<div class="pf-c-backdrop" ng-if="$ctrl.open">\n  <div class="pf-l-bullseye">\n    <div class="pf-c-about-modal-box" role="dialog" aria-modal="true" aria-labelledby="about-modal-title">\n      <div class="pf-c-about-modal-box__brand">\n        <img class="pf-c-about-modal-box__brand-image" ng-src="{{$ctrl.imgSrc}}">\n      </div>\n      <div class="pf-c-about-modal-box__close">\n        <button aria-label="Close Dialog" class="pf-c-button pf-m-plain" type="button" ng-click="$ctrl.close()">\n          <i class="fa fa-times" aria-hidden="true"></i>\n        </button>\n      </div>\n      <div class="pf-c-about-modal-box__header">\n        <h1 class="pf-c-title pf-m-4xl">{{$ctrl.title}}</h1>\n      </div>\n      <div class="pf-c-about-modal-box__hero">\n      </div>\n      <div class="pf-c-about-modal-box__content">\n        <div class="pf-c-content">\n            <dl>\n              <dt ng-repeat-start="item in $ctrl.productInfo">{{item.name}}</dt>\n              <dd ng-repeat-end>{{item.value}}</dd>\n            </dl>\n        </div>\n        <div class="pf-c-about-modal-box__strapline">\n          <p class="pf-c-title pf-m-md">{{$ctrl.copyright}}</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n');
$templateCache.put('help/help.component.html','<div>\n  <h1>Help</h1>\n  <ul class="nav nav-tabs">\n    <li ng-repeat="topic in $ctrl.topics" ng-class="{active : topic === $ctrl.selectedTopic}">\n      <a href="#" ng-click="$ctrl.onSelectTopic(topic)">{{topic.label}}</a>\n    </li>\n  </ul>\n  <ul class="nav nav-tabs nav-tabs-pf help-secondary-tabs" ng-if="$ctrl.subTopics.length > 1">\n    <li ng-repeat="subTopic in $ctrl.subTopics" ng-class="{active : subTopic === $ctrl.selectedSubTopic}">\n      <a ng-href="#" ng-click="$ctrl.onSelectSubTopic(subTopic)">\n        {{subTopic.label === $ctrl.selectedTopic.label ? \'Home\' : subTopic.label}}\n      </a>\n    </li>\n  </ul>\n  <div ng-bind-html="$ctrl.html"></div>\n</div>\n');
$templateCache.put('preferences/logging-preferences/logging-preferences.html','<div ng-controller="PreferencesLoggingController">\n  <form class="form-horizontal logging-preferences-form">\n    <div class="form-group" ng-class="{\'has-error\': logBuffer === null || logBuffer === undefined}">\n      <label class="col-md-2 control-label" for="log-buffer">\n        Log buffer\n        <span class="pficon pficon-info" data-toggle="tooltip" data-placement="top" title="Number of log statements to keep in the console"></span>\n      </label>\n      <div class="col-md-6">\n        <input type="number" id="log-buffer" class="form-control" min="1" ng-model="logBuffer" ng-blur="onLogBufferChange(logBuffer)">\n        <span class="help-block" ng-show="logBuffer === null || logBuffer === undefined">Invalid value</span>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-level">Global log level</label>\n      <div class="col-md-6">\n        <select id="log-level" class="form-control" ng-model="logLevel"\n                ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                ng-change="onLogLevelChange(logLevel)">\n        </select>\n      </div>\n    </div>\n    <div class="form-group">\n      <label class="col-md-2 control-label" for="log-buffer">Child loggers</label>\n      <div class="col-md-6">\n        <div class="form-group" ng-repeat="childLogger in childLoggers track by childLogger.name">\n          <label class="col-md-4 control-label child-logger-label" for="log-level">\n            {{childLogger.name}}\n          </label>\n          <div class="col-md-8">\n            <select id="log-level" class="form-control child-logger-select" ng-model="childLogger.filterLevel"\n                    ng-options="logLevel.name for logLevel in availableLogLevels track by logLevel.name"\n                    ng-change="onChildLoggersChange(childLoggers)">\n            </select>\n            <button type="button" class="btn btn-default child-logger-delete-button" ng-click="removeChildLogger(childLogger)">\n              <span class="pficon pficon-delete"></span>\n            </button>\n          </div>\n        </div>\n        <div>\n          <div class="dropdown">\n            <button class="btn btn-default dropdown-toggle" type="button" id="addChildLogger" data-toggle="dropdown">\n              Add\n              <span class="caret"></span>\n            </button>\n            <ul class="dropdown-menu" role="menu" aria-labelledby="addChildLogger">\n              <li role="presentation" ng-repeat="availableChildLogger in availableChildLoggers track by availableChildLogger.name">\n                <a role="menuitem" tabindex="-1" href="#" ng-click="addChildLogger(availableChildLogger)">\n                  {{ availableChildLogger.name }}\n                </a>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  </form>\n</div>\n');
$templateCache.put('preferences/preferences-home/preferences-home.html','<div ng-controller="PreferencesHomeController">\n  <button class="btn btn-primary pull-right" ng-click="close()">Close</button>\n  <h1>\n    Preferences\n  </h1>\n  <hawtio-tabs tabs="tabs" active-tab="getTab(pref)" on-change="setPanel(tab)"></hawtio-tabs>\n  <div ng-include="getPrefs(pref)"></div>\n</div>\n');
$templateCache.put('preferences/reset-preferences/reset-preferences.html','<div ng-controller="ResetPreferencesController">\n  <div class="alert alert-success preferences-reset-alert" ng-if="showAlert">\n    <span class="pficon pficon-ok"></span>\n    Settings reset successfully!\n  </div>\n  <h3>Reset settings</h3>\n  <p>\n    Clear all custom settings stored in your browser\'s local storage and reset to defaults.\n  </p>\n  <p>\n    <button class="btn btn-danger" ng-click="doReset()">Reset settings</button>\n  </p>\n</div>');
$templateCache.put('help/help.md','## Plugin Help\n\nBrowse the available help topics for plugin specific documentation using the help navigation bar.\n\n### Further Reading\n\n- [Hawtio](https://hawt.io "Hawtio") website\n- Chat with the Hawtio team on IRC by joining **#hawtio** on **irc.freenode.net**\n- Help improve Hawtio by [contributing](https://hawt.io/docs/contributing/)\n- Hawtio on [GitHub](https://github.com/hawtio/hawtio)\n');
$templateCache.put('preferences/help.md','## Preferences\n\nThe preferences page is used to configure application preferences and individual plugin preferences.\n\nThe preferences page is accessible by clicking the user icon (<i class=\'fa pficon-user\'></i>) in the main navigation bar,\nand then by choosing the preferences sub menu option.\n');}]);