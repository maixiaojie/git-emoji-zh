import * as vscode from 'vscode';
import { GitExtension, Repository } from './api/git';
import emojis from './api/git_emoji_zh';
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.gitEmoji', (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage('unable to load Git Extension');
			return;
		}
		// init pick items
		let items = [];
		for (let i = 0; i < emojis.length; i++) {
			items.push({ label: `${emojis[i].emoji} ${emojis[i].description}`, code: emojis[i].code, emoji: emojis[i].emoji + ' ', description: '[' + emojis[i].name + ']' });
		}
		// 显示选项列表，提示用户选择
		vscode.window.showQuickPick(items).then(function (selected) {
			if (selected) {
				console.log(uri);
				vscode.commands.executeCommand('workbench.view.scm');
				if (uri) {
					let selectedRepository = git.repositories.find(repository => {
						return repository.rootUri.path === uri._rootUri.path;
					});
					if (selectedRepository) {
						prefixCommit(selectedRepository, selected.emoji);
					}
				} else {
					for (let repo of git.repositories) {
						prefixCommit(repo, selected.emoji);
					}
				}
			}
		});
	});
	context.subscriptions.push(disposable);
}
function prefixCommit(repository: Repository, prefix: String) {
	repository.inputBox.value = `${prefix}${repository.inputBox.value}`;
}
function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
	const gitExtension = vscodeGit && vscodeGit.exports;
	return gitExtension && gitExtension.getAPI(1);
}
// this method is called when your extension is deactivated
export function deactivate() { }
