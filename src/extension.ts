import * as vscode from 'vscode';
import { GitExtension, Repository } from './api/git';
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.gitEmoji', (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage('unable to load Git Extension');
			return;
		}
		// 初始化选项列表清单
		let items = [];
		items.push({ label: "🎉", code: ':tada:', description: "庆祝 (初次提交)"});
		items.push({ label: "✨", code: ':sparkles:', description: "火花 (引入新功能)"});
		items.push({ label: "🔖", code: ':bookmark:', description: "书签 (发行/版本标签)"});
		items.push({ label: "🐛", code: ':bug:', description: "bug (修复 bug)"});
		items.push({ label: "🚑", code: ':ambulance:', description: "急救车 (重要补丁)"});
		items.push({ label: "🌐", code: ':globe_with_meridians:', description: "地球 (国际化与本地化)"});
		items.push({ label: "💄", code: ':lipstick:', description: "口红 (更新 UI 和样式文件)"});
		items.push({ label: "🎬", code: ':clapper:', description: "场记板 (更新演示/示例)"});
		items.push({ label: "🚨", code: ':rotating_light:', description: "警车灯 (移除 linter 警告)"});
		items.push({ label: "🔧", code: ':wrench:', description: "扳手 (修改配置文件)"});
		items.push({ label: "➕", code: ':heavy_plus_sign:', description: "加号 (增加一个依赖)"});
		items.push({ label: "➖", code: ':heavy_minus_sign:', description: "减号 (减少一个依赖)"});
		items.push({ label: "⬆️", code: ':arrow_up:', description: "上升箭头 (升级依赖)"});
		items.push({ label: "⬇️", code: ':arrow_down:', description: "下降箭头 (降级依赖)"});
		items.push({ label: "⚡️", code: ':zap:', description: "闪电 (提升性能)"});
		items.push({ label: "🐎", code: ':racehorse:', description: "赛马 (提升性能)"});
		items.push({ label: "📈", code: ':chart_with_upwards_trend:', description: "上升趋势图 (添加分析或跟踪代码)"});
		items.push({ label: "🚀", code: ':rocket:', description: "火箭 (部署功能)"});
		items.push({ label: "✅", code: ':white_check_mark:', description: "白色复选框 (增加测试)"});
		items.push({ label: "🔨", code: ':hammer:', description: "锤子 (重大重构)"});
		items.push({ label: "📝", code: ':memo:', description: "备忘录 (撰写文档)"});
		items.push({ label: "🎨", code: ':art:', description: "调色板 (改进代码结构/代码格式)"});
		items.push({ label: "🔥", code: ':fire:', description: "火焰 (移除代码或文件)"});
		items.push({ label: "✏️", code: ':pencil2:', description: "铅笔 (修复 typo)"});
		items.push({ label: "🚧", code: ':construction:', description: "施工 (工作进行中)"});
		items.push({ label: "👷", code: ':construction_worker:', description: "工人 (添加 CI 构建系统)"});
		items.push({ label: "💚", code: ':green_heart:', description: "绿心 (修复 CI 构建问题)"});
		items.push({ label: "🔒", code: ':lock:', description: "锁 (修复安全问题)"});
		items.push({ label: "🐳", code: ':whale:', description: "鲸鱼 (Docker 相关工作)"});
		items.push({ label: "🍎", code: ':apple:', description: "苹果 (修复 macOS 下的问题)"});
		items.push({ label: "🐧", code: ':penguin:', description: "企鹅 (修复 Linux 下的问题)"});
		items.push({ label: "🏁", code: ':checked_flag:', description: "旗帜 (修复 Windows 下的问题)"});
		items=items.map(item=>({...item,code:item.code+" "}));
		// 显示选项列表，提示用户选择
		vscode.window.showQuickPick(items).then(function (selected) {
			if (selected) {
				console.log(uri);
				vscode.commands.executeCommand('workbench.view.scm');
				if(uri) {
					let selectedRepository = git.repositories.find(repository => {
						return repository.rootUri.path === uri._rootUri.path;
					});
					if (selectedRepository) {
						prefixCommit(selectedRepository, selected.code);
					}
				}else {
					for(let repo of git.repositories) {
						prefixCommit(repo, selected.code);
					}
				}
			}
		});
	});
	context.subscriptions.push(disposable);
}
function prefixCommit(repository:Repository, prefix:String) {
	repository.inputBox.value = `${prefix}${repository.inputBox.value}`;
}
function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
	const gitExtension = vscodeGit && vscodeGit.exports;
	return gitExtension && gitExtension.getAPI(1);
}
// this method is called when your extension is deactivated
export function deactivate() { }
