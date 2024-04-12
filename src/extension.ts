// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { checkWithEslint } from './format-with-eslint';
const cp = require('child_process');
export const channel = vscode.window.createOutputChannel('format-manager');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let formatWithStylelint = vscode.commands.registerCommand(
		'format-manager.format-with-stylelint',
		() => {
			const currentDocument = vscode.window.activeTextEditor?.document;
	        const root = vscode.workspace.workspaceFolders?.[0].uri.path;
			const stylelintConfigFile = vscode.workspace
				.getConfiguration()
				.get('format-manager.stylelintConfigPath');
			if (!stylelintConfigFile) {
				vscode.window.showErrorMessage(
					'Please set stylelint config file path in settings',
				);
				return;
			}

			if (currentDocument) {
				const cmd = `npx stylelint ${currentDocument.fileName} --config ${stylelintConfigFile} --fix`;
				cp.exec(
					cmd,
					{ cwd: root || process.cwd() },
					(err, stdout, stderr) => {
						if (err) {
							channel.append('err: ' + err);
							return;
						}
						channel.append('stdout: ' + stdout);
					},
				);
			}
		},
	);

	let formatWithPrettier = vscode.commands.registerCommand(
		'format-manager.format-with-prettier',
		() => {
			const currentDocument = vscode.window.activeTextEditor?.document;
			const root = vscode.workspace.workspaceFolders?.[0].uri.path;
			const prettierConfigFile = vscode.workspace
				.getConfiguration()
				.get('format-manager.prettierConfigPath');
			if (!prettierConfigFile) {
				vscode.window.showErrorMessage(
					'Please set prettier config file path in settings',
				);
				return;
			}

			if (currentDocument) {
				const cmd = `prettier ${currentDocument.fileName} --config ${prettierConfigFile} --write`;
				cp.exec(
					cmd,
					{ cwd: root || process.cwd() },
					(err, stdout, stderr) => {
						if (err) {
							channel.append('err: ' + err);
							return;
						}
						channel.append('format--' + currentDocument.fileName);
					},
				);
			}
		},
	);

	context.subscriptions.push(formatWithStylelint, formatWithPrettier, checkWithEslint);
}

// This method is called when your extension is deactivated
export function deactivate() {}

