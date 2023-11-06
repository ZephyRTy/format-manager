// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const stylelint = require('stylelint');
const fs = require('fs');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context) {

	const currentDocument = vscode.window.activeTextEditor?.document;
    const stylelintConfigFile = '/Users/yangtianyuan/project/format-manager/config/.stylelintrc';
    const stylelintConfig = JSON.parse(fs.readFileSync(stylelintConfigFile, 'utf-8'));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('format-manager.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from format-manager!');
        if (currentDocument) {
            stylelint?.lint(
                {
                    config: stylelintConfig,
                    files: currentDocument.fileName,
                }
            ).then((data) => {
                console.log(data);
            });
        }
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
