import * as vscode from 'vscode';
const cp = require('child_process');

const isEslintErrorMessage = (line) => {
	const reg = /^\d+:\d /g;
	return reg.test(line);
};

export const parseDiagnostics = (stdout):vscode.Diagnostic[] => {
	const messages = JSON.parse(stdout)[0].messages;
	const diagnostics:vscode.Diagnostic[] = messages.map((e) => {
		const line = e.line - 1;
		const column = e.column - 1;
		const message = e.message;
		const severity = e.severity === 1 ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error;
		const range = new vscode.Range(line, column, e.endLine - 1, e.endColumn - 1);
		const diagnostic = new vscode.Diagnostic(range, message, severity);
		diagnostic.source = 'format-manager:eslint';
		return diagnostic;

	});
	return diagnostics;
};

export const checkWithEslint = vscode.commands.registerCommand('format-manager.check-with-eslint', () => {
	const currentDocument = vscode.window.activeTextEditor?.document;
	const root = vscode.workspace.workspaceFolders?.[0].uri.path;
	const eslintConfigFile = vscode.workspace
		    .getConfiguration()
		    .get('format-manager.eslintConfigPath');
	if (!eslintConfigFile) {
		vscode.window.showErrorMessage(
			'Please set eslint config file path in settings',
		);
		return;
	}
	if (currentDocument) {
		const cmd = `eslint -f json ${currentDocument.fileName} --config ${eslintConfigFile}`;
		cp.exec(
			cmd,
			{ cwd: root || process.cwd() },
			(err, stdout, stderr) => {
				if (err) {
					console.log(err);
				}
				const diagnostics = parseDiagnostics(stdout);
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const collection = vscode.languages.createDiagnosticCollection('format-manager:eslint');
					collection.set(editor.document.uri, diagnostics);
				}
			},
		);
	}
});