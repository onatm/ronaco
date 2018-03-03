/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference types="react" />
import * as React from 'react';
export declare type MonacoLanguage = 'typescript' | 'javascript';
export declare type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black';
export interface MonacoEditorProps {
    language?: MonacoLanguage;
    theme?: MonacoTheme;
    width?: string;
    height?: string;
    value?: string;
    onChange?: (newValue: string) => any;
}
export declare class MonacoEditor extends React.Component<MonacoEditorProps, {}> {
    _element: HTMLElement;
    _editor?: monaco.editor.IStandaloneCodeEditor;
    static defaultProps: MonacoEditorProps;
    private elementRef;
    private mountMonaco();
    private dispose();
    componentDidMount(): void;
    componentDidUpdate(prevProps: MonacoEditorProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
