"use strict";
/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MonacoEditor = /** @class */ (function (_super) {
    __extends(MonacoEditor, _super);
    function MonacoEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.elementRef = function (element) {
            _this._element = element;
        };
        return _this;
    }
    MonacoEditor.prototype.mountMonaco = function () {
        var _this = this;
        var w = window;
        var onGotAmdLoader = function () {
            // Monaco requires the AMD module loader to be present on the page. It is not yet
            // compatible with ES6 imports. Once that happens, we can get rid of this.
            // See https://github.com/Microsoft/monaco-editor/issues/18
            w.require(['vs/editor/editor.main'], function () {
                _this._editor = monaco.editor.create(_this._element, {
                    value: _this.props.value,
                    language: _this.props.language,
                    theme: _this.props.theme
                });
                _this._editor.onDidChangeModelContent(function (event) {
                    _this.props.onChange(_this._editor.getValue());
                });
            });
            // Call the delayed callbacks when AMD loader has been loaded
            if (w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
                w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
                var loaderCallbacks = w.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
                if (loaderCallbacks && loaderCallbacks.length) {
                    var currentCallback = loaderCallbacks.shift();
                    while (currentCallback) {
                        currentCallback.fn.call(currentCallback.context);
                        currentCallback = loaderCallbacks.shift();
                    }
                }
            }
        };
        // Load AMD loader if necessary
        if (w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
            // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
            // delay to call callbacks except the first one
            w.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = w.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
            w.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
                context: this,
                fn: onGotAmdLoader
            });
        }
        else {
            if (typeof w.require === 'undefined') {
                var loaderScript = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = 'vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
                w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
            }
            else {
                onGotAmdLoader();
            }
        }
    };
    MonacoEditor.prototype.dispose = function () {
        if (this._editor) {
            this._editor.dispose();
        }
        this._editor = undefined;
    };
    MonacoEditor.prototype.componentDidMount = function () {
        this.mountMonaco();
    };
    MonacoEditor.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value) {
            var newValue = this.props.value ? this.props.value : '';
            this._editor && this._editor.setValue(newValue);
        }
    };
    MonacoEditor.prototype.componentWillUnmount = function () {
        this.dispose();
    };
    MonacoEditor.prototype.render = function () {
        return (React.createElement("div", { className: "monaco-editor", ref: this.elementRef, style: { width: this.props.width, height: this.props.height } }));
    };
    MonacoEditor.defaultProps = {
        language: 'javascript',
        theme: 'vs',
        width: '100%',
        height: '100%',
        value: undefined,
        onChange: function (newValue) { }
    };
    return MonacoEditor;
}(React.Component));
exports.MonacoEditor = MonacoEditor;
