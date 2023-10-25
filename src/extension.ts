"use strict";

import * as fs from 'fs';
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.concatenate",
    function () {
      const selectedFiles = vscode.window.activeTextEditor?.selections;

      if (selectedFiles) {
          const concatenatedContent: string[] = [];
          selectedFiles.forEach(selection => {
              const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
              if (filePath) {
                  // console.error('selectedFiles', selectedFiles);

                  const fileContent = Buffer.from(fs.readFileSync(filePath, 'utf8')).toString();
                  concatenatedContent.push(fileContent);
              }
          });

          const concatenatedText = concatenatedContent.join('\n');
          vscode.workspace.openTextDocument({ content: concatenatedText }).then((document) => {
              vscode.window.showTextDocument(document);
          });
      }
      // const editor = vscode.window.activeTextEditor;

      // if (editor) {
      //   const document = editor.document;
      //   const selection = editor.selection;

      //   // Get the word within the selection
      //   const word = document.getText(selection);
      //   const reversed = word.split("").reverse().join("");
      //   editor.edit((editBuilder) => {
      //     editBuilder.replace(selection, reversed);
      //   });
      // }
    }
  );

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "concatenate" is now active!');
	
  // // The command has been defined in the package.json file
  // // Now provide the implementation of the command with registerCommand
  // // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('concatenate.helloWorld', () => {
		// 	// The code you place here will be executed every time your command is executed
		// 	// Display a message box to the user
		// 	vscode.window.showInformationMessage('Hello World from Concatenate!');
		// });
		
		context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
// export function deactivate() {}
