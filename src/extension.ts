"use strict";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const concatenateFiles = (
    allSelections: vscode.Uri[]
  ) => {
    const selectedFiles = allSelections.map((value) => {
      return value.path;
    });

    const concatenatedContent: string[] = [];

    selectedFiles.forEach((selection) => {
      const fileContent = Buffer.from(fs.readFileSync(selection)).toString();
      concatenatedContent.push(`[ File: ${selection} ]`);
      concatenatedContent.push(fileContent);
    });

    return concatenatedContent.join("\n-----\n");
  };

  const concatenateExplorerFiles = (
    // ...cmdArgs: [contextSelection: vscode.Uri, allSelections: vscode.Uri[]]
    contextSelection: vscode.Uri,
    allSelections: vscode.Uri[]
  ) => {
    const concatenatedContent = concatenateFiles(
      allSelections
    );

    const vscodeWebViewOutputTab = vscode.window.createWebviewPanel(
      "text",
      `Concatenated File`,
      { viewColumn: vscode.ViewColumn.Active },
      { enableScripts: true }
    );

    const uri = vscode.Uri.parse(
      context.asAbsolutePath(path.join("out", "webview.html"))
    );
    const pathUri = uri.with({ scheme: "vscode-resource" });
    const finalHtml = fs
      .readFileSync(pathUri.fsPath, "utf8")
      .replace("###REPLACE_CONTENT###", concatenatedContent);
    vscodeWebViewOutputTab.webview.html = finalHtml;
    vscode.window.showInformationMessage(`Concatenation done!`);
  };

  const concatenateExplorerFilesAsNewDocument = (
    contextSelection: vscode.Uri,
    allSelections: vscode.Uri[]
  ) => {
    const concatenatedContent = concatenateFiles(
      allSelections
    );
    vscode.workspace
      .openTextDocument({ content: concatenatedContent })
      .then((document) => {
        vscode.window.showTextDocument(document);
      });
    vscode.window.showInformationMessage(`Concatenation done!`);
  };

  context.subscriptions.push(vscode.commands.registerCommand(
    "concatenate.explorerFiles",
    concatenateExplorerFiles
  ));
  context.subscriptions.push(vscode.commands.registerCommand(
    "concatenate.explorerFilesAsNewDocument",
    concatenateExplorerFilesAsNewDocument
  ));
}

export function deactivate() {}
