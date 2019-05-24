const vscode = require("vscode");
const fs = require("fs-extra");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.deleteFolderContents",
    async function(uri) {
      const targetPath = uri.fsPath;
      const targetFolder = vscode.workspace.asRelativePath(uri);

      vscode.window
        .withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Deleting contents in ${targetFolder} folder`,
            cancellable: true
          },
          (progress, token) => {
            fs.emptyDirSync(targetPath);
            vscode.commands.executeCommand(
              "workbench.files.action.refreshFilesExplorer"
            );
            return Promise.resolve();
          }
        )
        .then(() => {
          setTimeout(() => {
            vscode.window.showInformationMessage(
              `Succesfully deleted contents in ${targetFolder} folder`
            );
          }, 1000);
        });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
