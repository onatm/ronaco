/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import * as React from 'react';

export type MonacoLanguage = 'typescript' | 'javascript';

export type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black';

export interface MonacoEditorProps {
  language?: MonacoLanguage;
  theme?: MonacoTheme;
  width?: string;
  height?: string;
  value?: string;
  onChange?: (newValue: string) => any;
}

export class MonacoEditor extends React.Component<MonacoEditorProps, {}> {
  _element!: HTMLElement;
  _editor?: monaco.editor.IStandaloneCodeEditor;

  static defaultProps: MonacoEditorProps = {
    language: 'javascript',
    theme: 'vs',
    width: '100%',
    height: '100%',
    value: undefined,
    onChange: (newValue: string) => { }
  };

  private elementRef = (element: HTMLDivElement) => {
    this._element = element;
  };

  private mountMonaco() {
    const w = window as any;

    const onGotAmdLoader = () => {
      // Monaco requires the AMD module loader to be present on the page. It is not yet
      // compatible with ES6 imports. Once that happens, we can get rid of this.
      // See https://github.com/Microsoft/monaco-editor/issues/18
      w.require(['vs/editor/editor.main'], () => {
        this._editor = monaco.editor.create(this._element, {
          value: this.props.value,
          language: this.props.language,
          theme: this.props.theme
        });

        this._editor.onDidChangeModelContent(event => {
          this.props.onChange!(this._editor!.getValue());
        });
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        const loaderCallbacks = w.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();
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
    } else {
      if (typeof w.require === 'undefined') {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'vs/loader.js';
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
        w.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
      } else {
        onGotAmdLoader();
      }
    }
  }

  private dispose() {
    if (this._editor) {
      this._editor.dispose();
    }

    this._editor = undefined;
  }

  componentDidMount() {
    this.mountMonaco();
  }

  componentDidUpdate(prevProps: MonacoEditorProps) {
    if (prevProps.value !== this.props.value) {
      const newValue = this.props.value ? this.props.value : '';
      this._editor && this._editor.setValue(newValue);
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  render(): JSX.Element {
    return (
      <div
        className="monaco-editor"
        ref={this.elementRef}
        style={{ width: this.props.width, height: this.props.height }}
      />
    );
  }
}
