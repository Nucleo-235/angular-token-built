/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, fromEvent, interval } from 'rxjs';
import { pluck, filter, share, finalize } from 'rxjs/operators';
import { ANGULAR_TOKEN_OPTIONS } from './angular-token.token';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./angular-token.token";
import * as i3 from "@angular/router";
var AngularTokenService = /** @class */ (function () {
    function AngularTokenService(http, config, platformId, activatedRoute, router) {
        this.http = http;
        this.platformId = platformId;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.localStorage = {};
        this.global = (typeof window !== 'undefined') ? window : {};
        if (isPlatformServer(platformId)) {
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
        var mergedOptions = ((/** @type {?} */ (Object))).assign(defaultOptions, config);
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
         */
        function () {
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
         */
        function () {
            return this.userData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularTokenService.prototype, "currentAuthData", {
        get: /**
         * @return {?}
         */
        function () {
            return this.authData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularTokenService.prototype, "apiBase", {
        get: /**
         * @return {?}
         */
        function () {
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
         */
        function () {
            return this.options;
        },
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.options = ((/** @type {?} */ (Object))).assign(this.options, options);
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
        var observ = this.http.post(this.getServerPath() + this.options.signInPath, body, { observe: 'response' }).pipe(share());
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
            return new Observable(function (observer) {
                browser_1.on('loadstop').subscribe(function (ev) {
                    if (ev.url.indexOf(oAuthBrowserCallback_1) > -1) {
                        browser_1.executeScript({ code: "requestCredentials();" }).then(function (credentials) {
                            _this.getAuthDataFromPostMessage(credentials[0]);
                            /** @type {?} */
                            var pollerObserv = interval(400);
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
            .pipe(finalize(function () {
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
        var observ = this.http.get(this.getServerPath() + this.options.validateTokenPath).pipe(share());
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
        var pollerObserv = interval(500);
        /** @type {?} */
        var responseObserv = fromEvent(this.global, 'message').pipe(pluck('data'), filter(this.oAuthWindowResponseFilter));
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
        { type: Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    /** @nocollapse */
    AngularTokenService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: undefined, decorators: [{ type: Inject, args: [ANGULAR_TOKEN_OPTIONS,] }] },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: ActivatedRoute, decorators: [{ type: Optional }] },
        { type: Router, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ AngularTokenService.ngInjectableDef = i0.defineInjectable({ factory: function AngularTokenService_Factory() { return new AngularTokenService(i0.inject(i1.HttpClient), i0.inject(i2.ANGULAR_TOKEN_OPTIONS), i0.inject(i0.PLATFORM_ID), i0.inject(i3.ActivatedRoute, 8), i0.inject(i3.Router, 8)); }, token: AngularTokenService, providedIn: "root" });
    return AngularTokenService;
}());
export { AngularTokenService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.options;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.userType;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.authData;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.userData;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.global;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.localStorage;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.platformId;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.activatedRoute;
    /**
     * @type {?}
     * @private
     */
    AngularTokenService.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci10b2tlbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10b2tlbi8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLXRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7QUFrQjlEO0lBMkNFLDZCQUNVLElBQWdCLEVBQ08sTUFBVyxFQUNiLFVBQWtCLEVBQzNCLGNBQThCLEVBQzlCLE1BQWM7UUFKMUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUVLLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFQNUIsaUJBQVksR0FBa0IsRUFBRSxDQUFDO1FBU3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFNUQsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNoQyxJQUFJLENB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OztJQUNoQywrQ0FBaUI7Ozs7Ozs7OztJQUF6QixVQUEwQixJQUFZO1FBQ3BDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDbEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUNoQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUF0QixDQUFzQixDQUNuQyxDQUFDO0lBQ0osQ0FBQzs7Z0JBcG1CRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQTFCUSxVQUFVO2dEQXFFZCxNQUFNLFNBQUMscUJBQXFCO2dCQUNZLE1BQU0sdUJBQTlDLE1BQU0sU0FBQyxXQUFXO2dCQXZFZCxjQUFjLHVCQXdFbEIsUUFBUTtnQkF4RVksTUFBTSx1QkF5RTFCLFFBQVE7Ozs4QkExRWI7Q0ErbkJDLEFBcm1CRCxJQXFtQkM7U0FsbUJZLG1CQUFtQjs7Ozs7O0lBZ0M5QixzQ0FBcUM7Ozs7O0lBQ3JDLHVDQUEyQjs7Ozs7SUFDM0IsdUNBQTJCOzs7OztJQUMzQix1Q0FBMkI7Ozs7O0lBQzNCLHFDQUE2Qjs7Ozs7SUFFN0IsMkNBQXlDOzs7OztJQUd2QyxtQ0FBd0I7Ozs7O0lBRXhCLHlDQUErQzs7Ozs7SUFDL0MsNkNBQWtEOzs7OztJQUNsRCxxQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCwgSW5qZWN0LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciwgQ2FuQWN0aXZhdGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tRXZlbnQsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBwbHVjaywgZmlsdGVyLCBzaGFyZSwgZmluYWxpemUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFOR1VMQVJfVE9LRU5fT1BUSU9OUyB9IGZyb20gJy4vYW5ndWxhci10b2tlbi50b2tlbic7XG5cbmltcG9ydCB7XG4gIFNpZ25JbkRhdGEsXG4gIFJlZ2lzdGVyRGF0YSxcbiAgVXBkYXRlUGFzc3dvcmREYXRhLFxuICBSZXNldFBhc3N3b3JkRGF0YSxcblxuICBVc2VyVHlwZSxcbiAgVXNlckRhdGEsXG4gIEF1dGhEYXRhLFxuXG4gIEFuZ3VsYXJUb2tlbk9wdGlvbnMsXG5cbiAgVG9rZW5QbGF0Zm9ybSxcbiAgVG9rZW5JbkFwcEJyb3dzZXIsXG59IGZyb20gJy4vYW5ndWxhci10b2tlbi5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyVG9rZW5TZXJ2aWNlIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuXG4gIGdldCBjdXJyZW50VXNlclR5cGUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy51c2VyVHlwZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy51c2VyVHlwZS5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50VXNlckRhdGEoKTogVXNlckRhdGEge1xuICAgIHJldHVybiB0aGlzLnVzZXJEYXRhO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRBdXRoRGF0YSgpOiBBdXRoRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aERhdGE7XG4gIH1cblxuICBnZXQgYXBpQmFzZSgpOiBzdHJpbmcge1xuICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXItdG9rZW5dIFRoZSBhdHRyaWJ1dGUgLmFwaUJhc2Ugd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UsIHBsZWFzZSB1c2UnICtcbiAgICAnLnRva2VuT3B0aW9ucy5hcGlCYXNlIGluc3RlYWQnKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFwaUJhc2U7XG4gIH1cblxuICBnZXQgdG9rZW5PcHRpb25zKCk6IEFuZ3VsYXJUb2tlbk9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICBzZXQgdG9rZW5PcHRpb25zKG9wdGlvbnM6IEFuZ3VsYXJUb2tlbk9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAoPGFueT5PYmplY3QpLmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcHRpb25zOiBBbmd1bGFyVG9rZW5PcHRpb25zO1xuICBwcml2YXRlIHVzZXJUeXBlOiBVc2VyVHlwZTtcbiAgcHJpdmF0ZSBhdXRoRGF0YTogQXV0aERhdGE7XG4gIHByaXZhdGUgdXNlckRhdGE6IFVzZXJEYXRhO1xuICBwcml2YXRlIGdsb2JhbDogV2luZG93IHwgYW55O1xuXG4gIHByaXZhdGUgbG9jYWxTdG9yYWdlOiBTdG9yYWdlIHwgYW55ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIEBJbmplY3QoQU5HVUxBUl9UT0tFTl9PUFRJT05TKSBjb25maWc6IGFueSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICkge1xuICAgIHRoaXMuZ2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuXG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuZ2xvYmFsID0ge1xuICAgICAgICBvcGVuOiAoKSA9PiBudWxsLFxuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgIGhyZWY6ICcvJyxcbiAgICAgICAgICBvcmlnaW46ICcvJ1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtID0gKCkgPT4gbnVsbDtcbiAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEl0ZW0gPSAoKSA9PiBudWxsO1xuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSA9ICgpID0+IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBBbmd1bGFyVG9rZW5PcHRpb25zID0ge1xuICAgICAgYXBpUGF0aDogICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICBhcGlCYXNlOiAgICAgICAgICAgICAgICAgICAgbnVsbCxcblxuICAgICAgc2lnbkluUGF0aDogICAgICAgICAgICAgICAgICdhdXRoL3NpZ25faW4nLFxuICAgICAgc2lnbkluUmVkaXJlY3Q6ICAgICAgICAgICAgIG51bGwsXG4gICAgICBzaWduSW5TdG9yZWRVcmxTdG9yYWdlS2V5OiAgbnVsbCxcblxuICAgICAgc2lnbk91dFBhdGg6ICAgICAgICAgICAgICAgICdhdXRoL3NpZ25fb3V0JyxcbiAgICAgIHZhbGlkYXRlVG9rZW5QYXRoOiAgICAgICAgICAnYXV0aC92YWxpZGF0ZV90b2tlbicsXG4gICAgICBzaWduT3V0RmFpbGVkVmFsaWRhdGU6ICAgICAgZmFsc2UsXG5cbiAgICAgIHJlZ2lzdGVyQWNjb3VudFBhdGg6ICAgICAgICAnYXV0aCcsXG4gICAgICBkZWxldGVBY2NvdW50UGF0aDogICAgICAgICAgJ2F1dGgnLFxuICAgICAgcmVnaXN0ZXJBY2NvdW50Q2FsbGJhY2s6ICAgIHRoaXMuZ2xvYmFsLmxvY2F0aW9uLmhyZWYsXG5cbiAgICAgIHVwZGF0ZVBhc3N3b3JkUGF0aDogICAgICAgICAnYXV0aCcsXG5cbiAgICAgIHJlc2V0UGFzc3dvcmRQYXRoOiAgICAgICAgICAnYXV0aC9wYXNzd29yZCcsXG4gICAgICByZXNldFBhc3N3b3JkQ2FsbGJhY2s6ICAgICAgdGhpcy5nbG9iYWwubG9jYXRpb24uaHJlZixcblxuICAgICAgdXNlclR5cGVzOiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICBsb2dpbkZpZWxkOiAgICAgICAgICAgICAgICAgJ2VtYWlsJyxcblxuICAgICAgb0F1dGhCYXNlOiAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsLmxvY2F0aW9uLm9yaWdpbixcbiAgICAgIG9BdXRoUGF0aHM6IHtcbiAgICAgICAgZ2l0aHViOiAgICAgICAgICAgICAgICAgICAnYXV0aC9naXRodWInXG4gICAgICB9LFxuICAgICAgb0F1dGhDYWxsYmFja1BhdGg6ICAgICAgICAgICdvYXV0aF9jYWxsYmFjaycsXG4gICAgICBvQXV0aFdpbmRvd1R5cGU6ICAgICAgICAgICAgJ25ld1dpbmRvdycsXG4gICAgICBvQXV0aFdpbmRvd09wdGlvbnM6ICAgICAgICAgbnVsbCxcblxuICAgICAgb0F1dGhCcm93c2VyQ2FsbGJhY2tzOiB7XG4gICAgICAgIGdpdGh1YjogICAgICAgICAgICAgICAgICAgJ2F1dGgvZ2l0aHViL2NhbGxiYWNrJyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSAoPGFueT5PYmplY3QpLmFzc2lnbihkZWZhdWx0T3B0aW9ucywgY29uZmlnKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZWRPcHRpb25zO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hcGlCYXNlID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFthbmd1bGFyLXRva2VuXSBZb3UgaGF2ZSBub3QgY29uZmlndXJlZCAnYXBpQmFzZScsIHdoaWNoIG1heSByZXN1bHQgaW4gc2VjdXJpdHkgaXNzdWVzLiBgICtcbiAgICAgICAgICAgICAgICAgICBgUGxlYXNlIHJlZmVyIHRvIHRoZSBkb2N1bWVudGF0aW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZXJvbmlha3kvYW5ndWxhci10b2tlbi93aWtpYCk7XG4gICAgfVxuXG4gICAgdGhpcy50cnlMb2FkQXV0aERhdGEoKTtcbiAgfVxuXG4gIHVzZXJTaWduZWRJbigpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhIXRoaXMuYXV0aERhdGE7XG4gIH1cblxuICBjYW5BY3RpdmF0ZShyb3V0ZSwgc3RhdGUpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy51c2VyU2lnbmVkSW4oKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0b3JlIGN1cnJlbnQgbG9jYXRpb24gaW4gc3RvcmFnZSAodXNlZnVsbCBmb3IgcmVkaXJlY3Rpb24gYWZ0ZXIgc2lnbmluZyBpbilcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lnbkluU3RvcmVkVXJsU3RvcmFnZUtleSkge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5zaWduSW5TdG9yZWRVcmxTdG9yYWdlS2V5LFxuICAgICAgICAgIHN0YXRlLnVybFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBSZWRpcmVjdCB1c2VyIHRvIHNpZ24gaW4gaWYgc2lnbkluUmVkaXJlY3QgaXMgc2V0XG4gICAgICBpZiAodGhpcy5yb3V0ZXIgJiYgdGhpcy5vcHRpb25zLnNpZ25JblJlZGlyZWN0KSB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLm9wdGlvbnMuc2lnbkluUmVkaXJlY3RdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqXG4gICAqIEFjdGlvbnNcbiAgICpcbiAgICovXG5cbiAgLy8gUmVnaXN0ZXIgcmVxdWVzdFxuICByZWdpc3RlckFjY291bnQocmVnaXN0ZXJEYXRhOiBSZWdpc3RlckRhdGEpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgcmVnaXN0ZXJEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgcmVnaXN0ZXJEYXRhKTtcblxuICAgIGlmIChyZWdpc3RlckRhdGEudXNlclR5cGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy51c2VyVHlwZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXNlclR5cGUgPSB0aGlzLmdldFVzZXJUeXBlQnlOYW1lKHJlZ2lzdGVyRGF0YS51c2VyVHlwZSk7XG4gICAgICBkZWxldGUgcmVnaXN0ZXJEYXRhLnVzZXJUeXBlO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHJlZ2lzdGVyRGF0YS5wYXNzd29yZF9jb25maXJtYXRpb24gPT0gbnVsbCAmJlxuICAgICAgcmVnaXN0ZXJEYXRhLnBhc3N3b3JkQ29uZmlybWF0aW9uICE9IG51bGxcbiAgICApIHtcbiAgICAgIHJlZ2lzdGVyRGF0YS5wYXNzd29yZF9jb25maXJtYXRpb24gPSByZWdpc3RlckRhdGEucGFzc3dvcmRDb25maXJtYXRpb247XG4gICAgICBkZWxldGUgcmVnaXN0ZXJEYXRhLnBhc3N3b3JkQ29uZmlybWF0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ2luID0gcmVnaXN0ZXJEYXRhLmxvZ2luO1xuICAgIGRlbGV0ZSByZWdpc3RlckRhdGEubG9naW47XG4gICAgcmVnaXN0ZXJEYXRhW3RoaXMub3B0aW9ucy5sb2dpbkZpZWxkXSA9IGxvZ2luO1xuXG4gICAgcmVnaXN0ZXJEYXRhLmNvbmZpcm1fc3VjY2Vzc191cmwgPSB0aGlzLm9wdGlvbnMucmVnaXN0ZXJBY2NvdW50Q2FsbGJhY2s7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5nZXRTZXJ2ZXJQYXRoKCkgKyB0aGlzLm9wdGlvbnMucmVnaXN0ZXJBY2NvdW50UGF0aCwgcmVnaXN0ZXJEYXRhKTtcbiAgfVxuXG4gIC8vIERlbGV0ZSBBY2NvdW50XG4gIGRlbGV0ZUFjY291bnQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh0aGlzLmdldFNlcnZlclBhdGgoKSArIHRoaXMub3B0aW9ucy5kZWxldGVBY2NvdW50UGF0aCk7XG4gIH1cblxuICAvLyBTaWduIGluIHJlcXVlc3QgYW5kIHNldCBzdG9yYWdlXG4gIHNpZ25JbihzaWduSW5EYXRhOiBTaWduSW5EYXRhKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICB0aGlzLnVzZXJUeXBlID0gKHNpZ25JbkRhdGEudXNlclR5cGUgPT0gbnVsbCkgPyBudWxsIDogdGhpcy5nZXRVc2VyVHlwZUJ5TmFtZShzaWduSW5EYXRhLnVzZXJUeXBlKTtcblxuICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICBbdGhpcy5vcHRpb25zLmxvZ2luRmllbGRdOiBzaWduSW5EYXRhLmxvZ2luLFxuICAgICAgcGFzc3dvcmQ6IHNpZ25JbkRhdGEucGFzc3dvcmRcbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ID0gdGhpcy5odHRwLnBvc3QodGhpcy5nZXRTZXJ2ZXJQYXRoKCkgKyB0aGlzLm9wdGlvbnMuc2lnbkluUGF0aCwgYm9keSwgeyBvYnNlcnZlOiAncmVzcG9uc2UnIH0pLnBpcGUoc2hhcmUoKSk7XG5cbiAgICBvYnNlcnYuc3Vic2NyaWJlKHJlcyA9PiB0aGlzLnVzZXJEYXRhID0gcmVzLmJvZHlbJ2RhdGEnXSk7XG5cbiAgICByZXR1cm4gb2JzZXJ2O1xuICB9XG5cbiAgc2lnbkluT0F1dGgob0F1dGhUeXBlOiBzdHJpbmcsIGluQXBwQnJvd3Nlcj86IFRva2VuSW5BcHBCcm93c2VyPGFueSwgYW55PiwgcGxhdGZvcm0/OiBUb2tlblBsYXRmb3JtKSB7XG5cbiAgICBjb25zdCBvQXV0aFBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0T0F1dGhQYXRoKG9BdXRoVHlwZSk7XG4gICAgY29uc3QgY2FsbGJhY2tVcmwgPSBgJHt0aGlzLmdsb2JhbC5sb2NhdGlvbi5vcmlnaW59LyR7dGhpcy5vcHRpb25zLm9BdXRoQ2FsbGJhY2tQYXRofWA7XG4gICAgY29uc3Qgb0F1dGhXaW5kb3dUeXBlOiBzdHJpbmcgPSB0aGlzLm9wdGlvbnMub0F1dGhXaW5kb3dUeXBlO1xuICAgIGNvbnN0IGF1dGhVcmw6IHN0cmluZyA9IHRoaXMuZ2V0T0F1dGhVcmwob0F1dGhQYXRoLCBjYWxsYmFja1VybCwgb0F1dGhXaW5kb3dUeXBlKTtcblxuICAgIGlmIChvQXV0aFdpbmRvd1R5cGUgPT09ICduZXdXaW5kb3cnIHx8IFxuICAgICAgKG9BdXRoV2luZG93VHlwZSA9PSAnaW5BcHBCcm93c2VyJyAmJiAoIXBsYXRmb3JtIHx8ICFwbGF0Zm9ybS5pcygnY29yZG92YScpIHx8ICEocGxhdGZvcm0uaXMoJ2lvcycpIHx8IHBsYXRmb3JtLmlzKCdhbmRyb2lkJykpKSkpIHtcbiAgICAgIGNvbnN0IG9BdXRoV2luZG93T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5vQXV0aFdpbmRvd09wdGlvbnM7XG4gICAgICBsZXQgd2luZG93T3B0aW9ucyA9ICcnO1xuXG4gICAgICBpZiAob0F1dGhXaW5kb3dPcHRpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG9BdXRoV2luZG93T3B0aW9ucykge1xuICAgICAgICAgIGlmIChvQXV0aFdpbmRvd09wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICB3aW5kb3dPcHRpb25zICs9IGAsJHtrZXl9PSR7b0F1dGhXaW5kb3dPcHRpb25zW2tleV19YDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcG9wdXAgPSB3aW5kb3cub3BlbihcbiAgICAgICAgICBhdXRoVXJsLFxuICAgICAgICAgICdfYmxhbmsnLFxuICAgICAgICAgIGBjbG9zZWJ1dHRvbmNhcHRpb249Q2FuY2VsJHt3aW5kb3dPcHRpb25zfWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0Q3JlZGVudGlhbHNWaWFQb3N0TWVzc2FnZShwb3B1cCk7XG4gICAgfSBlbHNlIGlmIChvQXV0aFdpbmRvd1R5cGUgPT0gJ2luQXBwQnJvd3NlcicpIHtcbiAgICAgIGxldCBvQXV0aEJyb3dzZXJDYWxsYmFjayA9IHRoaXMub3B0aW9ucy5vQXV0aEJyb3dzZXJDYWxsYmFja3Nbb0F1dGhUeXBlXTtcbiAgICAgIGlmICghb0F1dGhCcm93c2VyQ2FsbGJhY2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUbyBsb2dpbiB3aXRoIG9BdXRoIHByb3ZpZGVyICR7b0F1dGhUeXBlfSB1c2luZyBpbkFwcEJyb3dzZXIgdGhlIGNhbGxiYWNrIChpbiBvQXV0aEJyb3dzZXJDYWxsYmFja3MpIGlzIHJlcXVpcmVkLmApO1xuICAgICAgfVxuICAgICAgLy8gbGV0IG9BdXRoV2luZG93T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5vQXV0aFdpbmRvd09wdGlvbnM7XG4gICAgICAvLyBsZXQgd2luZG93T3B0aW9ucyA9ICcnO1xuXG4gICAgICAvLyAgaWYgKG9BdXRoV2luZG93T3B0aW9ucykge1xuICAgICAgLy8gICAgIGZvciAobGV0IGtleSBpbiBvQXV0aFdpbmRvd09wdGlvbnMpIHtcbiAgICAgIC8vICAgICAgICAgd2luZG93T3B0aW9ucyArPSBgLCR7a2V5fT0ke29BdXRoV2luZG93T3B0aW9uc1trZXldfWA7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gfVxuXG4gICAgICBsZXQgYnJvd3NlciA9IGluQXBwQnJvd3Nlci5jcmVhdGUoXG4gICAgICAgICAgYXV0aFVybCxcbiAgICAgICAgICAnX2JsYW5rJyxcbiAgICAgICAgICAnbG9jYXRpb249bm8nXG4gICAgICApO1xuICAgICAgXG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgIGJyb3dzZXIub24oJ2xvYWRzdG9wJykuc3Vic2NyaWJlKChldjogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGV2LnVybC5pbmRleE9mKG9BdXRoQnJvd3NlckNhbGxiYWNrKSA+IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyLmV4ZWN1dGVTY3JpcHQoe2NvZGU6IFwicmVxdWVzdENyZWRlbnRpYWxzKCk7XCJ9KS50aGVuKChjcmVkZW50aWFsczogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QXV0aERhdGFGcm9tUG9zdE1lc3NhZ2UoY3JlZGVudGlhbHNbMF0pO1xuXG4gICAgICAgICAgICAgIGxldCBwb2xsZXJPYnNlcnYgPSBpbnRlcnZhbCg0MDApO1xuXG4gICAgICAgICAgICAgIGxldCBwb2xsZXJTdWJzY3JpcHRpb24gPSBwb2xsZXJPYnNlcnYuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyU2lnbmVkSW4oKSkge1xuICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0aGlzLmF1dGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgIHBvbGxlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgYnJvd3Nlci5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChvQXV0aFdpbmRvd1R5cGUgPT09ICdzYW1lV2luZG93Jykge1xuICAgICAgdGhpcy5nbG9iYWwubG9jYXRpb24uaHJlZiA9IGF1dGhVcmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgb0F1dGhXaW5kb3dUeXBlIFwiJHtvQXV0aFdpbmRvd1R5cGV9XCJgKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT0F1dGhDYWxsYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLmdldEF1dGhEYXRhRnJvbVBhcmFtcygpO1xuICB9XG5cbiAgLy8gU2lnbiBvdXQgcmVxdWVzdCBhbmQgZGVsZXRlIHN0b3JhZ2VcbiAgc2lnbk91dCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG9ic2VydiA9IHRoaXMuaHR0cC5kZWxldGU8YW55Pih0aGlzLmdldFNlcnZlclBhdGgoKSArIHRoaXMub3B0aW9ucy5zaWduT3V0UGF0aClcbiAgICAvLyBPbmx5IHJlbW92ZSB0aGUgbG9jYWxTdG9yYWdlIGFuZCBjbGVhciB0aGUgZGF0YSBhZnRlciB0aGUgY2FsbFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY2Vzc1Rva2VuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2xpZW50Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJ5Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW5UeXBlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndWlkJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJUeXBlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG5cbiAgICByZXR1cm4gb2JzZXJ2O1xuICB9XG5cbiAgLy8gVmFsaWRhdGUgdG9rZW4gcmVxdWVzdFxuICB2YWxpZGF0ZVRva2VuKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3Qgb2JzZXJ2ID0gdGhpcy5odHRwLmdldCh0aGlzLmdldFNlcnZlclBhdGgoKSArIHRoaXMub3B0aW9ucy52YWxpZGF0ZVRva2VuUGF0aCkucGlwZShzaGFyZSgpKTtcblxuICAgIG9ic2Vydi5zdWJzY3JpYmUoXG4gICAgICAocmVzKSA9PiB0aGlzLnVzZXJEYXRhID0gcmVzWydkYXRhJ10sXG4gICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxICYmIHRoaXMub3B0aW9ucy5zaWduT3V0RmFpbGVkVmFsaWRhdGUpIHtcbiAgICAgICAgICB0aGlzLnNpZ25PdXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9ic2VydjtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBwYXNzd29yZCByZXF1ZXN0XG4gIHVwZGF0ZVBhc3N3b3JkKHVwZGF0ZVBhc3N3b3JkRGF0YTogVXBkYXRlUGFzc3dvcmREYXRhKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgIGlmICh1cGRhdGVQYXNzd29yZERhdGEudXNlclR5cGUgIT0gbnVsbCkge1xuICAgICAgdGhpcy51c2VyVHlwZSA9IHRoaXMuZ2V0VXNlclR5cGVCeU5hbWUodXBkYXRlUGFzc3dvcmREYXRhLnVzZXJUeXBlKTtcbiAgICB9XG5cbiAgICBsZXQgYXJnczogYW55O1xuXG4gICAgaWYgKHVwZGF0ZVBhc3N3b3JkRGF0YS5wYXNzd29yZEN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgYXJncyA9IHtcbiAgICAgICAgcGFzc3dvcmQ6ICAgICAgICAgICAgICAgdXBkYXRlUGFzc3dvcmREYXRhLnBhc3N3b3JkLFxuICAgICAgICBwYXNzd29yZF9jb25maXJtYXRpb246ICB1cGRhdGVQYXNzd29yZERhdGEucGFzc3dvcmRDb25maXJtYXRpb25cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MgPSB7XG4gICAgICAgIGN1cnJlbnRfcGFzc3dvcmQ6ICAgICAgIHVwZGF0ZVBhc3N3b3JkRGF0YS5wYXNzd29yZEN1cnJlbnQsXG4gICAgICAgIHBhc3N3b3JkOiAgICAgICAgICAgICAgIHVwZGF0ZVBhc3N3b3JkRGF0YS5wYXNzd29yZCxcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiAgdXBkYXRlUGFzc3dvcmREYXRhLnBhc3N3b3JkQ29uZmlybWF0aW9uXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh1cGRhdGVQYXNzd29yZERhdGEucmVzZXRQYXNzd29yZFRva2VuKSB7XG4gICAgICBhcmdzLnJlc2V0X3Bhc3N3b3JkX3Rva2VuID0gdXBkYXRlUGFzc3dvcmREYXRhLnJlc2V0UGFzc3dvcmRUb2tlbjtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gYXJncztcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh0aGlzLmdldFNlcnZlclBhdGgoKSArIHRoaXMub3B0aW9ucy51cGRhdGVQYXNzd29yZFBhdGgsIGJvZHkpO1xuICB9XG5cbiAgLy8gUmVzZXQgcGFzc3dvcmQgcmVxdWVzdFxuICByZXNldFBhc3N3b3JkKHJlc2V0UGFzc3dvcmREYXRhOiBSZXNldFBhc3N3b3JkRGF0YSk6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICB0aGlzLnVzZXJUeXBlID0gKHJlc2V0UGFzc3dvcmREYXRhLnVzZXJUeXBlID09IG51bGwpID8gbnVsbCA6IHRoaXMuZ2V0VXNlclR5cGVCeU5hbWUocmVzZXRQYXNzd29yZERhdGEudXNlclR5cGUpO1xuXG4gICAgY29uc3QgYm9keSA9IHtcbiAgICAgIFt0aGlzLm9wdGlvbnMubG9naW5GaWVsZF06IHJlc2V0UGFzc3dvcmREYXRhLmxvZ2luLFxuICAgICAgcmVkaXJlY3RfdXJsOiB0aGlzLm9wdGlvbnMucmVzZXRQYXNzd29yZENhbGxiYWNrXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLmdldFNlcnZlclBhdGgoKSArIHRoaXMub3B0aW9ucy5yZXNldFBhc3N3b3JkUGF0aCwgYm9keSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKlxuICAgKiBDb25zdHJ1Y3QgUGF0aHMgLyBVcmxzXG4gICAqXG4gICAqL1xuXG4gIHByaXZhdGUgZ2V0VXNlclBhdGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHRoaXMudXNlclR5cGUgPT0gbnVsbCkgPyAnJyA6IHRoaXMudXNlclR5cGUucGF0aCArICcvJztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXBpUGF0aCgpOiBzdHJpbmcge1xuICAgIGxldCBjb25zdHJ1Y3RlZFBhdGggPSAnJztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXBpQmFzZSAhPSBudWxsKSB7XG4gICAgICBjb25zdHJ1Y3RlZFBhdGggKz0gdGhpcy5vcHRpb25zLmFwaUJhc2UgKyAnLyc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hcGlQYXRoICE9IG51bGwpIHtcbiAgICAgIGNvbnN0cnVjdGVkUGF0aCArPSB0aGlzLm9wdGlvbnMuYXBpUGF0aCArICcvJztcbiAgICB9XG5cbiAgICByZXR1cm4gY29uc3RydWN0ZWRQYXRoO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTZXJ2ZXJQYXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXBpUGF0aCgpICsgdGhpcy5nZXRVc2VyUGF0aCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRPQXV0aFBhdGgob0F1dGhUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCBvQXV0aFBhdGg6IHN0cmluZztcblxuICAgIG9BdXRoUGF0aCA9IHRoaXMub3B0aW9ucy5vQXV0aFBhdGhzW29BdXRoVHlwZV07XG5cbiAgICBpZiAob0F1dGhQYXRoID09IG51bGwpIHtcbiAgICAgIG9BdXRoUGF0aCA9IGAvYXV0aC8ke29BdXRoVHlwZX1gO1xuICAgIH1cblxuICAgIHJldHVybiBvQXV0aFBhdGg7XG4gIH1cblxuICBwcml2YXRlIGdldE9BdXRoVXJsKG9BdXRoUGF0aDogc3RyaW5nLCBjYWxsYmFja1VybDogc3RyaW5nLCB3aW5kb3dUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCB1cmw6IHN0cmluZztcblxuICAgIHVybCA9ICAgYCR7dGhpcy5vcHRpb25zLm9BdXRoQmFzZX0vJHtvQXV0aFBhdGh9YDtcbiAgICB1cmwgKz0gIGA/b21uaWF1dGhfd2luZG93X3R5cGU9JHt3aW5kb3dUeXBlfWA7XG4gICAgdXJsICs9ICBgJmF1dGhfb3JpZ2luX3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChjYWxsYmFja1VybCl9YDtcblxuICAgIGlmICh0aGlzLnVzZXJUeXBlICE9IG51bGwpIHtcbiAgICAgIHVybCArPSBgJnJlc291cmNlX2NsYXNzPSR7dGhpcy51c2VyVHlwZS5uYW1lfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqXG4gICAqIEdldCBBdXRoIERhdGFcbiAgICpcbiAgICovXG5cbiAgLy8gVHJ5IHRvIGxvYWQgYXV0aCBkYXRhXG4gIHByaXZhdGUgdHJ5TG9hZEF1dGhEYXRhKCk6IHZvaWQge1xuXG4gICAgY29uc3QgdXNlclR5cGUgPSB0aGlzLmdldFVzZXJUeXBlQnlOYW1lKHRoaXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUeXBlJykpO1xuXG4gICAgaWYgKHVzZXJUeXBlKSB7XG4gICAgICB0aGlzLnVzZXJUeXBlID0gdXNlclR5cGU7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRBdXRoRGF0YUZyb21TdG9yYWdlKCk7XG5cbiAgICBpZiAodGhpcy5hY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgdGhpcy5nZXRBdXRoRGF0YUZyb21QYXJhbXMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiAodGhpcy5hdXRoRGF0YSkge1xuICAgIC8vICAgICB0aGlzLnZhbGlkYXRlVG9rZW4oKTtcbiAgICAvLyB9XG4gIH1cblxuICAvLyBQYXJzZSBBdXRoIGRhdGEgZnJvbSByZXNwb25zZVxuICBwdWJsaWMgZ2V0QXV0aEhlYWRlcnNGcm9tUmVzcG9uc2UoZGF0YTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEuaGVhZGVycztcblxuICAgIGNvbnN0IGF1dGhEYXRhOiBBdXRoRGF0YSA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAgICBoZWFkZXJzLmdldCgnYWNjZXNzLXRva2VuJyksXG4gICAgICBjbGllbnQ6ICAgICAgICAgaGVhZGVycy5nZXQoJ2NsaWVudCcpLFxuICAgICAgZXhwaXJ5OiAgICAgICAgIGhlYWRlcnMuZ2V0KCdleHBpcnknKSxcbiAgICAgIHRva2VuVHlwZTogICAgICBoZWFkZXJzLmdldCgndG9rZW4tdHlwZScpLFxuICAgICAgdWlkOiAgICAgICAgICAgIGhlYWRlcnMuZ2V0KCd1aWQnKVxuICAgIH07XG5cbiAgICB0aGlzLnNldEF1dGhEYXRhKGF1dGhEYXRhKTtcbiAgfVxuXG4gIC8vIFBhcnNlIEF1dGggZGF0YSBmcm9tIHBvc3QgbWVzc2FnZVxuICBwcml2YXRlIGdldEF1dGhEYXRhRnJvbVBvc3RNZXNzYWdlKGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGF1dGhEYXRhOiBBdXRoRGF0YSA9IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiAgICBkYXRhWydhdXRoX3Rva2VuJ10sXG4gICAgICBjbGllbnQ6ICAgICAgICAgZGF0YVsnY2xpZW50X2lkJ10sXG4gICAgICBleHBpcnk6ICAgICAgICAgZGF0YVsnZXhwaXJ5J10sXG4gICAgICB0b2tlblR5cGU6ICAgICAgJ0JlYXJlcicsXG4gICAgICB1aWQ6ICAgICAgICAgICAgZGF0YVsndWlkJ11cbiAgICB9O1xuXG4gICAgdGhpcy5zZXRBdXRoRGF0YShhdXRoRGF0YSk7XG4gIH1cblxuICAvLyBUcnkgdG8gZ2V0IGF1dGggZGF0YSBmcm9tIHN0b3JhZ2UuXG4gIHB1YmxpYyBnZXRBdXRoRGF0YUZyb21TdG9yYWdlKCk6IHZvaWQge1xuXG4gICAgY29uc3QgYXV0aERhdGE6IEF1dGhEYXRhID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY2Vzc1Rva2VuJyksXG4gICAgICBjbGllbnQ6ICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2xpZW50JyksXG4gICAgICBleHBpcnk6ICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZXhwaXJ5JyksXG4gICAgICB0b2tlblR5cGU6ICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW5UeXBlJyksXG4gICAgICB1aWQ6ICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndWlkJylcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuY2hlY2tBdXRoRGF0YShhdXRoRGF0YSkpIHtcbiAgICAgIHRoaXMuYXV0aERhdGEgPSBhdXRoRGF0YTtcbiAgICB9XG4gIH1cblxuICAvLyBUcnkgdG8gZ2V0IGF1dGggZGF0YSBmcm9tIHVybCBwYXJhbWV0ZXJzLlxuICBwcml2YXRlIGdldEF1dGhEYXRhRnJvbVBhcmFtcygpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShxdWVyeVBhcmFtcyA9PiB7XG4gICAgICBjb25zdCBhdXRoRGF0YTogQXV0aERhdGEgPSB7XG4gICAgICAgIGFjY2Vzc1Rva2VuOiAgICBxdWVyeVBhcmFtc1sndG9rZW4nXSB8fCBxdWVyeVBhcmFtc1snYXV0aF90b2tlbiddLFxuICAgICAgICBjbGllbnQ6ICAgICAgICAgcXVlcnlQYXJhbXNbJ2NsaWVudF9pZCddLFxuICAgICAgICBleHBpcnk6ICAgICAgICAgcXVlcnlQYXJhbXNbJ2V4cGlyeSddLFxuICAgICAgICB0b2tlblR5cGU6ICAgICAgJ0JlYXJlcicsXG4gICAgICAgIHVpZDogICAgICAgICAgICBxdWVyeVBhcmFtc1sndWlkJ11cbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmNoZWNrQXV0aERhdGEoYXV0aERhdGEpKSB7XG4gICAgICAgIHRoaXMuYXV0aERhdGEgPSBhdXRoRGF0YTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBTZXQgQXV0aCBEYXRhXG4gICAqXG4gICAqL1xuXG4gIC8vIFdyaXRlIGF1dGggZGF0YSB0byBzdG9yYWdlXG4gIHByaXZhdGUgc2V0QXV0aERhdGEoYXV0aERhdGE6IEF1dGhEYXRhKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2hlY2tBdXRoRGF0YShhdXRoRGF0YSkpIHtcblxuICAgICAgdGhpcy5hdXRoRGF0YSA9IGF1dGhEYXRhO1xuXG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2Nlc3NUb2tlbicsIGF1dGhEYXRhLmFjY2Vzc1Rva2VuKTtcbiAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NsaWVudCcsIGF1dGhEYXRhLmNsaWVudCk7XG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdleHBpcnknLCBhdXRoRGF0YS5leHBpcnkpO1xuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW5UeXBlJywgYXV0aERhdGEudG9rZW5UeXBlKTtcbiAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VpZCcsIGF1dGhEYXRhLnVpZCk7XG5cbiAgICAgIGlmICh0aGlzLnVzZXJUeXBlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclR5cGUnLCB0aGlzLnVzZXJUeXBlLm5hbWUpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICpcbiAgICogVmFsaWRhdGUgQXV0aCBEYXRhXG4gICAqXG4gICAqL1xuXG4gIC8vIENoZWNrIGlmIGF1dGggZGF0YSBjb21wbGV0ZSBhbmQgaWYgcmVzcG9uc2UgdG9rZW4gaXMgbmV3ZXJcbiAgcHJpdmF0ZSBjaGVja0F1dGhEYXRhKGF1dGhEYXRhOiBBdXRoRGF0YSk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKFxuICAgICAgYXV0aERhdGEuYWNjZXNzVG9rZW4gIT0gbnVsbCAmJlxuICAgICAgYXV0aERhdGEuY2xpZW50ICE9IG51bGwgJiZcbiAgICAgIGF1dGhEYXRhLmV4cGlyeSAhPSBudWxsICYmXG4gICAgICBhdXRoRGF0YS50b2tlblR5cGUgIT0gbnVsbCAmJlxuICAgICAgYXV0aERhdGEudWlkICE9IG51bGxcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLmF1dGhEYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGF1dGhEYXRhLmV4cGlyeSA+PSB0aGlzLmF1dGhEYXRhLmV4cGlyeTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICpcbiAgICogT0F1dGhcbiAgICpcbiAgICovXG5cbiAgcHJpdmF0ZSByZXF1ZXN0Q3JlZGVudGlhbHNWaWFQb3N0TWVzc2FnZShhdXRoV2luZG93OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHBvbGxlck9ic2VydiA9IGludGVydmFsKDUwMCk7XG5cbiAgICBjb25zdCByZXNwb25zZU9ic2VydiA9IGZyb21FdmVudCh0aGlzLmdsb2JhbCwgJ21lc3NhZ2UnKS5waXBlKFxuICAgICAgcGx1Y2soJ2RhdGEnKSxcbiAgICAgIGZpbHRlcih0aGlzLm9BdXRoV2luZG93UmVzcG9uc2VGaWx0ZXIpXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlU3Vic2NyaXB0aW9uID0gcmVzcG9uc2VPYnNlcnYuc3Vic2NyaWJlKFxuICAgICAgdGhpcy5nZXRBdXRoRGF0YUZyb21Qb3N0TWVzc2FnZS5iaW5kKHRoaXMpXG4gICAgKTtcblxuICAgIGNvbnN0IHBvbGxlclN1YnNjcmlwdGlvbiA9IHBvbGxlck9ic2Vydi5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKGF1dGhXaW5kb3cuY2xvc2VkKSB7XG4gICAgICAgIHBvbGxlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFdpbmRvdy5wb3N0TWVzc2FnZSgncmVxdWVzdENyZWRlbnRpYWxzJywgJyonKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXNwb25zZU9ic2VydjtcbiAgfVxuXG4gIHByaXZhdGUgb0F1dGhXaW5kb3dSZXNwb25zZUZpbHRlcihkYXRhOiBhbnkpOiBhbnkge1xuICAgIGlmIChkYXRhLm1lc3NhZ2UgPT09ICdkZWxpdmVyQ3JlZGVudGlhbHMnIHx8IGRhdGEubWVzc2FnZSA9PT0gJ2F1dGhGYWlsdXJlJykge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICpcbiAgICogVXRpbGl0aWVzXG4gICAqXG4gICAqL1xuXG4gIC8vIE1hdGNoIHVzZXIgY29uZmlnIGJ5IHVzZXIgY29uZmlnIG5hbWVcbiAgcHJpdmF0ZSBnZXRVc2VyVHlwZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBVc2VyVHlwZSB7XG4gICAgaWYgKG5hbWUgPT0gbnVsbCB8fCB0aGlzLm9wdGlvbnMudXNlclR5cGVzID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudXNlclR5cGVzLmZpbmQoXG4gICAgICB1c2VyVHlwZSA9PiB1c2VyVHlwZS5uYW1lID09PSBuYW1lXG4gICAgKTtcbiAgfVxufVxuIl19