(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/router'), require('@angular/common'), require('rxjs'), require('@angular/core'), require('@angular/common/http'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular-token', ['exports', '@angular/router', '@angular/common', 'rxjs', '@angular/core', '@angular/common/http', 'rxjs/operators'], factory) :
    (factory((global['angular-token'] = {}),global.ng.router,global.ng.common,global.rxjs,global.ng.core,global.ng.common.http,global.rxjs.operators));
}(this, (function (exports,i3,common,rxjs,i0,i1,operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ANGULAR_TOKEN_OPTIONS = new i0.InjectionToken('ANGULAR_TOKEN_OPTIONS');

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularTokenService = /** @class */ (function () {
        function AngularTokenService(http, config, platformId, activatedRoute, router) {
            this.http = http;
            this.platformId = platformId;
            this.activatedRoute = activatedRoute;
            this.router = router;
            this.localStorage = {};
            this.global = (typeof window !== 'undefined') ? window : {};
            if (common.isPlatformServer(platformId)) {
                this.global = {
                    open: function () { return null; },
                    location: {
                        href: '/',
                        origin: '/'
                    }
                };
                this.localStorage.setItem = function () { return null; };
                this.localStorage.getItem = function () { return null; };
                this.localStorage.removeItem = function () { return null; };
            }
            else {
                this.localStorage = localStorage;
            }
            /** @type {?} */
            var defaultOptions = {
                apiPath: null,
                apiBase: null,
                signInPath: 'auth/sign_in',
                signInRedirect: null,
                signInStoredUrlStorageKey: null,
                signOutPath: 'auth/sign_out',
                validateTokenPath: 'auth/validate_token',
                signOutFailedValidate: false,
                registerAccountPath: 'auth',
                deleteAccountPath: 'auth',
                registerAccountCallback: this.global.location.href,
                updatePasswordPath: 'auth',
                resetPasswordPath: 'auth/password',
                resetPasswordCallback: this.global.location.href,
                userTypes: null,
                loginField: 'email',
                oAuthBase: this.global.location.origin,
                oAuthPaths: {
                    github: 'auth/github'
                },
                oAuthCallbackPath: 'oauth_callback',
                oAuthWindowType: 'newWindow',
                oAuthWindowOptions: null,
                oAuthBrowserCallbacks: {
                    github: 'auth/github/callback',
                },
            };
            /** @type {?} */
            var mergedOptions = (( /** @type {?} */(Object))).assign(defaultOptions, config);
            this.options = mergedOptions;
            if (this.options.apiBase === null) {
                console.warn("[angular-token] You have not configured 'apiBase', which may result in security issues. " +
                    "Please refer to the documentation at https://github.com/neroniaky/angular-token/wiki");
            }
            this.tryLoadAuthData();
        }
        Object.defineProperty(AngularTokenService.prototype, "currentUserType", {
            get: /**
             * @return {?}
             */ function () {
                if (this.userType != null) {
                    return this.userType.name;
                }
                else {
                    return undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularTokenService.prototype, "currentUserData", {
            get: /**
             * @return {?}
             */ function () {
                return this.userData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularTokenService.prototype, "currentAuthData", {
            get: /**
             * @return {?}
             */ function () {
                return this.authData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularTokenService.prototype, "apiBase", {
            get: /**
             * @return {?}
             */ function () {
                console.warn('[angular-token] The attribute .apiBase will be removed in the next major release, please use' +
                    '.tokenOptions.apiBase instead');
                return this.options.apiBase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularTokenService.prototype, "tokenOptions", {
            get: /**
             * @return {?}
             */ function () {
                return this.options;
            },
            set: /**
             * @param {?} options
             * @return {?}
             */ function (options) {
                this.options = (( /** @type {?} */(Object))).assign(this.options, options);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        AngularTokenService.prototype.userSignedIn = /**
         * @return {?}
         */
            function () {
                return !!this.authData;
            };
        /**
         * @param {?} route
         * @param {?} state
         * @return {?}
         */
        AngularTokenService.prototype.canActivate = /**
         * @param {?} route
         * @param {?} state
         * @return {?}
         */
            function (route, state) {
                if (this.userSignedIn()) {
                    return true;
                }
                else {
                    // Store current location in storage (usefull for redirection after signing in)
                    if (this.options.signInStoredUrlStorageKey) {
                        this.localStorage.setItem(this.options.signInStoredUrlStorageKey, state.url);
                    }
                    // Redirect user to sign in if signInRedirect is set
                    if (this.router && this.options.signInRedirect) {
                        this.router.navigate([this.options.signInRedirect]);
                    }
                    return false;
                }
            };
        /**
         *
         * Actions
         *
         */
        // Register request
        /**
         *
         * Actions
         *
         * @param {?} registerData
         * @return {?}
         */
        // Register request
        AngularTokenService.prototype.registerAccount = /**
         *
         * Actions
         *
         * @param {?} registerData
         * @return {?}
         */
            // Register request
            function (registerData) {
                registerData = Object.assign({}, registerData);
                if (registerData.userType == null) {
                    this.userType = null;
                }
                else {
                    this.userType = this.getUserTypeByName(registerData.userType);
                    delete registerData.userType;
                }
                if (registerData.password_confirmation == null &&
                    registerData.passwordConfirmation != null) {
                    registerData.password_confirmation = registerData.passwordConfirmation;
                    delete registerData.passwordConfirmation;
                }
                /** @type {?} */
                var login = registerData.login;
                delete registerData.login;
                registerData[this.options.loginField] = login;
                registerData.confirm_success_url = this.options.registerAccountCallback;
                return this.http.post(this.getServerPath() + this.options.registerAccountPath, registerData);
            };
        // Delete Account
        // Delete Account
        /**
         * @return {?}
         */
        AngularTokenService.prototype.deleteAccount =
            // Delete Account
            /**
             * @return {?}
             */
            function () {
                return this.http.delete(this.getServerPath() + this.options.deleteAccountPath);
            };
        // Sign in request and set storage
        // Sign in request and set storage
        /**
         * @param {?} signInData
         * @return {?}
         */
        AngularTokenService.prototype.signIn =
            // Sign in request and set storage
            /**
             * @param {?} signInData
             * @return {?}
             */
            function (signInData) {
                var _this = this;
                var _a;
                this.userType = (signInData.userType == null) ? null : this.getUserTypeByName(signInData.userType);
                /** @type {?} */
                var body = (_a = {},
                    _a[this.options.loginField] = signInData.login,
                    _a.password = signInData.password,
                    _a);
                /** @type {?} */
                var observ = this.http.post(this.getServerPath() + this.options.signInPath, body, { observe: 'response' }).pipe(operators.share());
                observ.subscribe(function (res) { return _this.userData = res.body['data']; });
                return observ;
            };
        /**
         * @param {?} oAuthType
         * @param {?=} inAppBrowser
         * @param {?=} platform
         * @return {?}
         */
        AngularTokenService.prototype.signInOAuth = /**
         * @param {?} oAuthType
         * @param {?=} inAppBrowser
         * @param {?=} platform
         * @return {?}
         */
            function (oAuthType, inAppBrowser, platform) {
                var _this = this;
                /** @type {?} */
                var oAuthPath = this.getOAuthPath(oAuthType);
                /** @type {?} */
                var callbackUrl = this.global.location.origin + "/" + this.options.oAuthCallbackPath;
                /** @type {?} */
                var oAuthWindowType = this.options.oAuthWindowType;
                /** @type {?} */
                var authUrl = this.getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);
                if (oAuthWindowType === 'newWindow' ||
                    (oAuthWindowType == 'inAppBrowser' && (!platform || !platform.is('cordova') || !(platform.is('ios') || platform.is('android'))))) {
                    /** @type {?} */
                    var oAuthWindowOptions = this.options.oAuthWindowOptions;
                    /** @type {?} */
                    var windowOptions = '';
                    if (oAuthWindowOptions) {
                        for (var key in oAuthWindowOptions) {
                            if (oAuthWindowOptions.hasOwnProperty(key)) {
                                windowOptions += "," + key + "=" + oAuthWindowOptions[key];
                            }
                        }
                    }
                    /** @type {?} */
                    var popup = window.open(authUrl, '_blank', "closebuttoncaption=Cancel" + windowOptions);
                    return this.requestCredentialsViaPostMessage(popup);
                }
                else if (oAuthWindowType == 'inAppBrowser') {
                    /** @type {?} */
                    var oAuthBrowserCallback_1 = this.options.oAuthBrowserCallbacks[oAuthType];
                    if (!oAuthBrowserCallback_1) {
                        throw new Error("To login with oAuth provider " + oAuthType + " using inAppBrowser the callback (in oAuthBrowserCallbacks) is required.");
                    }
                    // let oAuthWindowOptions = this.options.oAuthWindowOptions;
                    // let windowOptions = '';
                    //  if (oAuthWindowOptions) {
                    //     for (let key in oAuthWindowOptions) {
                    //         windowOptions += `,${key}=${oAuthWindowOptions[key]}`;
                    //     }
                    // }
                    /** @type {?} */
                    var browser_1 = inAppBrowser.create(authUrl, '_blank', 'location=no');
                    return new rxjs.Observable(function (observer) {
                        browser_1.on('loadstop').subscribe(function (ev) {
                            if (ev.url.indexOf(oAuthBrowserCallback_1) > -1) {
                                browser_1.executeScript({ code: "requestCredentials();" }).then(function (credentials) {
                                    _this.getAuthDataFromPostMessage(credentials[0]);
                                    /** @type {?} */
                                    var pollerObserv = rxjs.interval(400);
                                    /** @type {?} */
                                    var pollerSubscription = pollerObserv.subscribe(function () {
                                        if (_this.userSignedIn()) {
                                            observer.next(_this.authData);
                                            observer.complete();
                                            pollerSubscription.unsubscribe();
                                            browser_1.close();
                                        }
                                    }, function (error) {
                                        observer.error(error);
                                        observer.complete();
                                    });
                                }, function (error) {
                                    observer.error(error);
                                    observer.complete();
                                });
                            }
                        }, function (error) {
                            observer.error(error);
                            observer.complete();
                        });
                    });
                }
                else if (oAuthWindowType === 'sameWindow') {
                    this.global.location.href = authUrl;
                }
                else {
                    throw new Error("Unsupported oAuthWindowType \"" + oAuthWindowType + "\"");
                }
            };
        /**
         * @return {?}
         */
        AngularTokenService.prototype.processOAuthCallback = /**
         * @return {?}
         */
            function () {
                this.getAuthDataFromParams();
            };
        // Sign out request and delete storage
        // Sign out request and delete storage
        /**
         * @return {?}
         */
        AngularTokenService.prototype.signOut =
            // Sign out request and delete storage
            /**
             * @return {?}
             */
            function () {
                var _this = this;
                /** @type {?} */
                var observ = this.http.delete(this.getServerPath() + this.options.signOutPath)
                    // Only remove the localStorage and clear the data after the call
                    .pipe(operators.finalize(function () {
                    _this.localStorage.removeItem('accessToken');
                    _this.localStorage.removeItem('client');
                    _this.localStorage.removeItem('expiry');
                    _this.localStorage.removeItem('tokenType');
                    _this.localStorage.removeItem('uid');
                    _this.authData = null;
                    _this.userType = null;
                    _this.userData = null;
                }));
                return observ;
            };
        // Validate token request
        // Validate token request
        /**
         * @return {?}
         */
        AngularTokenService.prototype.validateToken =
            // Validate token request
            /**
             * @return {?}
             */
            function () {
                var _this = this;
                /** @type {?} */
                var observ = this.http.get(this.getServerPath() + this.options.validateTokenPath).pipe(operators.share());
                observ.subscribe(function (res) { return _this.userData = res['data']; }, function (error) {
                    if (error.status === 401 && _this.options.signOutFailedValidate) {
                        _this.signOut();
                    }
                });
                return observ;
            };
        // Update password request
        // Update password request
        /**
         * @param {?} updatePasswordData
         * @return {?}
         */
        AngularTokenService.prototype.updatePassword =
            // Update password request
            /**
             * @param {?} updatePasswordData
             * @return {?}
             */
            function (updatePasswordData) {
                if (updatePasswordData.userType != null) {
                    this.userType = this.getUserTypeByName(updatePasswordData.userType);
                }
                /** @type {?} */
                var args;
                if (updatePasswordData.passwordCurrent == null) {
                    args = {
                        password: updatePasswordData.password,
                        password_confirmation: updatePasswordData.passwordConfirmation
                    };
                }
                else {
                    args = {
                        current_password: updatePasswordData.passwordCurrent,
                        password: updatePasswordData.password,
                        password_confirmation: updatePasswordData.passwordConfirmation
                    };
                }
                if (updatePasswordData.resetPasswordToken) {
                    args.reset_password_token = updatePasswordData.resetPasswordToken;
                }
                /** @type {?} */
                var body = args;
                return this.http.put(this.getServerPath() + this.options.updatePasswordPath, body);
            };
        // Reset password request
        // Reset password request
        /**
         * @param {?} resetPasswordData
         * @return {?}
         */
        AngularTokenService.prototype.resetPassword =
            // Reset password request
            /**
             * @param {?} resetPasswordData
             * @return {?}
             */
            function (resetPasswordData) {
                var _a;
                this.userType = (resetPasswordData.userType == null) ? null : this.getUserTypeByName(resetPasswordData.userType);
                /** @type {?} */
                var body = (_a = {},
                    _a[this.options.loginField] = resetPasswordData.login,
                    _a.redirect_url = this.options.resetPasswordCallback,
                    _a);
                return this.http.post(this.getServerPath() + this.options.resetPasswordPath, body);
            };
        /**
         *
         * Construct Paths / Urls
         *
         */
        /**
         *
         * Construct Paths / Urls
         *
         * @private
         * @return {?}
         */
        AngularTokenService.prototype.getUserPath = /**
         *
         * Construct Paths / Urls
         *
         * @private
         * @return {?}
         */
            function () {
                return (this.userType == null) ? '' : this.userType.path + '/';
            };
        /**
         * @private
         * @return {?}
         */
        AngularTokenService.prototype.getApiPath = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var constructedPath = '';
                if (this.options.apiBase != null) {
                    constructedPath += this.options.apiBase + '/';
                }
                if (this.options.apiPath != null) {
                    constructedPath += this.options.apiPath + '/';
                }
                return constructedPath;
            };
        /**
         * @private
         * @return {?}
         */
        AngularTokenService.prototype.getServerPath = /**
         * @private
         * @return {?}
         */
            function () {
                return this.getApiPath() + this.getUserPath();
            };
        /**
         * @private
         * @param {?} oAuthType
         * @return {?}
         */
        AngularTokenService.prototype.getOAuthPath = /**
         * @private
         * @param {?} oAuthType
         * @return {?}
         */
            function (oAuthType) {
                /** @type {?} */
                var oAuthPath;
                oAuthPath = this.options.oAuthPaths[oAuthType];
                if (oAuthPath == null) {
                    oAuthPath = "/auth/" + oAuthType;
                }
                return oAuthPath;
            };
        /**
         * @private
         * @param {?} oAuthPath
         * @param {?} callbackUrl
         * @param {?} windowType
         * @return {?}
         */
        AngularTokenService.prototype.getOAuthUrl = /**
         * @private
         * @param {?} oAuthPath
         * @param {?} callbackUrl
         * @param {?} windowType
         * @return {?}
         */
            function (oAuthPath, callbackUrl, windowType) {
                /** @type {?} */
                var url;
                url = this.options.oAuthBase + "/" + oAuthPath;
                url += "?omniauth_window_type=" + windowType;
                url += "&auth_origin_url=" + encodeURIComponent(callbackUrl);
                if (this.userType != null) {
                    url += "&resource_class=" + this.userType.name;
                }
                return url;
            };
        /**
         *
         * Get Auth Data
         *
         */
        // Try to load auth data
        /**
         *
         * Get Auth Data
         *
         * @private
         * @return {?}
         */
        // Try to load auth data
        AngularTokenService.prototype.tryLoadAuthData = /**
         *
         * Get Auth Data
         *
         * @private
         * @return {?}
         */
            // Try to load auth data
            function () {
                /** @type {?} */
                var userType = this.getUserTypeByName(this.localStorage.getItem('userType'));
                if (userType) {
                    this.userType = userType;
                }
                this.getAuthDataFromStorage();
                if (this.activatedRoute) {
                    this.getAuthDataFromParams();
                }
                // if (this.authData) {
                //     this.validateToken();
                // }
            };
        // Parse Auth data from response
        // Parse Auth data from response
        /**
         * @param {?} data
         * @return {?}
         */
        AngularTokenService.prototype.getAuthHeadersFromResponse =
            // Parse Auth data from response
            /**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                /** @type {?} */
                var headers = data.headers;
                /** @type {?} */
                var authData = {
                    accessToken: headers.get('access-token'),
                    client: headers.get('client'),
                    expiry: headers.get('expiry'),
                    tokenType: headers.get('token-type'),
                    uid: headers.get('uid')
                };
                this.setAuthData(authData);
            };
        // Parse Auth data from post message
        // Parse Auth data from post message
        /**
         * @private
         * @param {?} data
         * @return {?}
         */
        AngularTokenService.prototype.getAuthDataFromPostMessage =
            // Parse Auth data from post message
            /**
             * @private
             * @param {?} data
             * @return {?}
             */
            function (data) {
                /** @type {?} */
                var authData = {
                    accessToken: data['auth_token'],
                    client: data['client_id'],
                    expiry: data['expiry'],
                    tokenType: 'Bearer',
                    uid: data['uid']
                };
                this.setAuthData(authData);
            };
        // Try to get auth data from storage.
        // Try to get auth data from storage.
        /**
         * @return {?}
         */
        AngularTokenService.prototype.getAuthDataFromStorage =
            // Try to get auth data from storage.
            /**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var authData = {
                    accessToken: this.localStorage.getItem('accessToken'),
                    client: this.localStorage.getItem('client'),
                    expiry: this.localStorage.getItem('expiry'),
                    tokenType: this.localStorage.getItem('tokenType'),
                    uid: this.localStorage.getItem('uid')
                };
                if (this.checkAuthData(authData)) {
                    this.authData = authData;
                }
            };
        // Try to get auth data from url parameters.
        // Try to get auth data from url parameters.
        /**
         * @private
         * @return {?}
         */
        AngularTokenService.prototype.getAuthDataFromParams =
            // Try to get auth data from url parameters.
            /**
             * @private
             * @return {?}
             */
            function () {
                var _this = this;
                this.activatedRoute.queryParams.subscribe(function (queryParams) {
                    /** @type {?} */
                    var authData = {
                        accessToken: queryParams['token'] || queryParams['auth_token'],
                        client: queryParams['client_id'],
                        expiry: queryParams['expiry'],
                        tokenType: 'Bearer',
                        uid: queryParams['uid']
                    };
                    if (_this.checkAuthData(authData)) {
                        _this.authData = authData;
                    }
                });
            };
        /**
         *
         * Set Auth Data
         *
         */
        // Write auth data to storage
        /**
         *
         * Set Auth Data
         *
         * @private
         * @param {?} authData
         * @return {?}
         */
        // Write auth data to storage
        AngularTokenService.prototype.setAuthData = /**
         *
         * Set Auth Data
         *
         * @private
         * @param {?} authData
         * @return {?}
         */
            // Write auth data to storage
            function (authData) {
                if (this.checkAuthData(authData)) {
                    this.authData = authData;
                    this.localStorage.setItem('accessToken', authData.accessToken);
                    this.localStorage.setItem('client', authData.client);
                    this.localStorage.setItem('expiry', authData.expiry);
                    this.localStorage.setItem('tokenType', authData.tokenType);
                    this.localStorage.setItem('uid', authData.uid);
                    if (this.userType != null) {
                        this.localStorage.setItem('userType', this.userType.name);
                    }
                }
            };
        /**
         *
         * Validate Auth Data
         *
         */
        // Check if auth data complete and if response token is newer
        /**
         *
         * Validate Auth Data
         *
         * @private
         * @param {?} authData
         * @return {?}
         */
        // Check if auth data complete and if response token is newer
        AngularTokenService.prototype.checkAuthData = /**
         *
         * Validate Auth Data
         *
         * @private
         * @param {?} authData
         * @return {?}
         */
            // Check if auth data complete and if response token is newer
            function (authData) {
                if (authData.accessToken != null &&
                    authData.client != null &&
                    authData.expiry != null &&
                    authData.tokenType != null &&
                    authData.uid != null) {
                    if (this.authData != null) {
                        return authData.expiry >= this.authData.expiry;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            };
        /**
         *
         * OAuth
         *
         */
        /**
         *
         * OAuth
         *
         * @private
         * @param {?} authWindow
         * @return {?}
         */
        AngularTokenService.prototype.requestCredentialsViaPostMessage = /**
         *
         * OAuth
         *
         * @private
         * @param {?} authWindow
         * @return {?}
         */
            function (authWindow) {
                /** @type {?} */
                var pollerObserv = rxjs.interval(500);
                /** @type {?} */
                var responseObserv = rxjs.fromEvent(this.global, 'message').pipe(operators.pluck('data'), operators.filter(this.oAuthWindowResponseFilter));
                /** @type {?} */
                var responseSubscription = responseObserv.subscribe(this.getAuthDataFromPostMessage.bind(this));
                /** @type {?} */
                var pollerSubscription = pollerObserv.subscribe(function () {
                    if (authWindow.closed) {
                        pollerSubscription.unsubscribe();
                    }
                    else {
                        authWindow.postMessage('requestCredentials', '*');
                    }
                });
                return responseObserv;
            };
        /**
         * @private
         * @param {?} data
         * @return {?}
         */
        AngularTokenService.prototype.oAuthWindowResponseFilter = /**
         * @private
         * @param {?} data
         * @return {?}
         */
            function (data) {
                if (data.message === 'deliverCredentials' || data.message === 'authFailure') {
                    return data;
                }
            };
        /**
         *
         * Utilities
         *
         */
        // Match user config by user config name
        /**
         *
         * Utilities
         *
         * @private
         * @param {?} name
         * @return {?}
         */
        // Match user config by user config name
        AngularTokenService.prototype.getUserTypeByName = /**
         *
         * Utilities
         *
         * @private
         * @param {?} name
         * @return {?}
         */
            // Match user config by user config name
            function (name) {
                if (name == null || this.options.userTypes == null) {
                    return null;
                }
                return this.options.userTypes.find(function (userType) { return userType.name === name; });
            };
        AngularTokenService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root',
                    },] }
        ];
        /** @nocollapse */
        AngularTokenService.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: undefined, decorators: [{ type: i0.Inject, args: [ANGULAR_TOKEN_OPTIONS,] }] },
                { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
                { type: i3.ActivatedRoute, decorators: [{ type: i0.Optional }] },
                { type: i3.Router, decorators: [{ type: i0.Optional }] }
            ];
        };
        /** @nocollapse */ AngularTokenService.ngInjectableDef = i0.defineInjectable({ factory: function AngularTokenService_Factory() { return new AngularTokenService(i0.inject(i1.HttpClient), i0.inject(ANGULAR_TOKEN_OPTIONS), i0.inject(i0.PLATFORM_ID), i0.inject(i3.ActivatedRoute, 8), i0.inject(i3.Router, 8)); }, token: AngularTokenService, providedIn: "root" });
        return AngularTokenService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularTokenInterceptor = /** @class */ (function () {
        function AngularTokenInterceptor(tokenService) {
            this.tokenService = tokenService;
        }
        /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
        AngularTokenInterceptor.prototype.intercept = /**
         * @param {?} req
         * @param {?} next
         * @return {?}
         */
            function (req, next) {
                var _this = this;
                // Get auth data from local storage
                this.tokenService.getAuthDataFromStorage();
                // Add the headers if the request is going to the configured server
                if (this.tokenService.currentAuthData &&
                    (this.tokenService.tokenOptions.apiBase === null || req.url.match(this.tokenService.tokenOptions.apiBase))) {
                    /** @type {?} */
                    var headers = {
                        'access-token': this.tokenService.currentAuthData.accessToken,
                        'client': this.tokenService.currentAuthData.client,
                        'expiry': this.tokenService.currentAuthData.expiry,
                        'token-type': this.tokenService.currentAuthData.tokenType,
                        'uid': this.tokenService.currentAuthData.uid
                    };
                    req = req.clone({
                        setHeaders: headers
                    });
                }
                return next.handle(req).pipe(operators.tap(function (res) { return _this.handleResponse(res); }, function (err) { return _this.handleResponse(err); }));
            };
        // Parse Auth data from response
        // Parse Auth data from response
        /**
         * @private
         * @param {?} res
         * @return {?}
         */
        AngularTokenInterceptor.prototype.handleResponse =
            // Parse Auth data from response
            /**
             * @private
             * @param {?} res
             * @return {?}
             */
            function (res) {
                if (res instanceof i1.HttpResponse || res instanceof i1.HttpErrorResponse) {
                    if (this.tokenService.tokenOptions.apiBase === null || (res.url && res.url.match(this.tokenService.tokenOptions.apiBase))) {
                        this.tokenService.getAuthHeadersFromResponse(( /** @type {?} */(res)));
                    }
                }
            };
        AngularTokenInterceptor.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        AngularTokenInterceptor.ctorParameters = function () {
            return [
                { type: AngularTokenService }
            ];
        };
        return AngularTokenInterceptor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularTokenModule = /** @class */ (function () {
        function AngularTokenModule(parentModule) {
            if (parentModule) {
                throw new Error('AngularToken is already loaded. It should only be imported in your application\'s main module.');
            }
        }
        /**
         * @param {?} options
         * @return {?}
         */
        AngularTokenModule.forRoot = /**
         * @param {?} options
         * @return {?}
         */
            function (options) {
                return {
                    ngModule: AngularTokenModule,
                    providers: [
                        {
                            provide: i1.HTTP_INTERCEPTORS,
                            useClass: AngularTokenInterceptor,
                            multi: true
                        },
                        options.angularTokenOptionsProvider ||
                            {
                                provide: ANGULAR_TOKEN_OPTIONS,
                                useValue: options
                            },
                        AngularTokenService
                    ]
                };
            };
        AngularTokenModule.decorators = [
            { type: i0.NgModule }
        ];
        /** @nocollapse */
        AngularTokenModule.ctorParameters = function () {
            return [
                { type: AngularTokenModule, decorators: [{ type: i0.Optional }, { type: i0.SkipSelf }] }
            ];
        };
        return AngularTokenModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.ANGULAR_TOKEN_OPTIONS = ANGULAR_TOKEN_OPTIONS;
    exports.AngularTokenService = AngularTokenService;
    exports.AngularTokenModule = AngularTokenModule;
    exports.ɵb = AngularTokenInterceptor;
    exports.ɵa = AngularTokenService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=angular-token.umd.js.map