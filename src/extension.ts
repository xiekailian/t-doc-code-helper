// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { EOL } from "os";
import * as vscode from "vscode";
import { Position } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  //   console.log(
  //     'Congratulations, your extension "t-doc-code-helper" is now active!'
  //   );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "t-doc-code-helper.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from t-doc-code-helper!"
      );
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e) {
        const { document, contentChanges } = e;
        const editor = vscode.window.activeTextEditor;

        if (editor && document == editor.document) {
          const lastChange = contentChanges[contentChanges.length - 1];

          if (contentChanges.length && lastChange.text.startsWith(EOL)) {
            const prevLine = lastChange.range.start.line;
			const txtWithSpace = document.lineAt(prevLine).text;
            const txt = document.lineAt(prevLine).text.trim();
            const txtNext = document.lineAt(prevLine + 1).text.trim();
			const spaceBeforeTxt = getSpaceBeforeString(txtWithSpace);

            // if (hasACommentedLine(txt, document.languageId)) {
            // 回车之后，上一行开头是*，下一行没有*，才会自动补*，因为换行多次之后，vs code会自动帮你补*，如果自己再补会重复
            if (txt.startsWith("*") && !txtNext.startsWith("*")) {
              editor.edit((editBuilder) => {
                var index = new Position(prevLine + 1, 0);
                editBuilder.insert(index, `${spaceBeforeTxt}* `);
              });
            }
          }
        }
      }
    })
  );
}

function getSpaceBeforeString(str: string) {
  const arr = Array.from(str);
  let index = 0;
  arr.forEach((element, i) => {
    if (element !== " ") {
      index = i;
      return;
    }
  });
  const spaceBeforeString = str.slice(0, index);
  return spaceBeforeString;
}

// function hasACommentedLine(txt: string, lang: string) {
//   return charsList.some((item) => {
//     return (
//       txt.startsWith(item.char) &&
//       item.languages.some((langId) => langId == lang)
//     );
//   });
// }

// this method is called when your extension is deactivated
export function deactivate() {}
