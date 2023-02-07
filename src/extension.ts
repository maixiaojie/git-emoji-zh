import * as vscode from 'vscode'
import { GitExtension, Repository } from './api/git'
import emojis from './api/git_emoji_zh'
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.gitEmoji', (uri?) => {
    const git = getGitExtension()
    if (!git) {
      vscode.window.showErrorMessage('unable to load Git Extension')
      return
    }

    const config = vscode.workspace.getConfiguration('git-emoji-commit')
    const useEmoji = config.get("emojiOrCode") === "emoji" ? true : false

    // 加载默认的列表
    let items = []
    for (const emoji of emojis) {
      items.push({
        code: emoji.code,
        emoji: emoji.emoji,
        label: emoji.emoji + ' ' + emoji.description,
        description: emoji.name
      })
    }
    // 显示选项列表，提示用户选择
    vscode.window.showQuickPick(items).then(function (selected) {
      if (selected) {
        console.log(uri)
        vscode.commands.executeCommand('workbench.view.scm')
        if (uri) {
          let selectedRepository = git.repositories.find((repository) => {
            return repository.rootUri.path === uri.rootUri.path
          })
          if (selectedRepository) {
            const emoji = useEmoji ? selected.emoji : selected.code
            prefixCommit(selectedRepository, emoji)
          }
        } else {
          for (let repo of git.repositories) {
            const emoji = useEmoji ? selected.emoji : selected.code
            prefixCommit(repo, emoji)
          }
        }
      }
    })
  })

  context.subscriptions.push(disposable)
}
function prefixCommit(repository: Repository, prefix: string) {
  repository.inputBox.value = `${prefix}${repository.inputBox.value}`
}
function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git')
  const gitExtension = vscodeGit && vscodeGit.exports
  return gitExtension && gitExtension.getAPI(1)
}
// this method is called when your extension is deactivated
export function deactivate() { }
