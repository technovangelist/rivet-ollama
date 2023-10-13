import { execa } from "execa";
import { join } from "node:path";
import { Ollama } from "ollama-node";

export async function runPythonScript(
  path: string,
  args: string[]
): Promise<string> {
  if (path === "") {
    path = join(__dirname, "..", "scripts", "python-script.py");
  }

  const { stdout } = await execa("python3", [path, ...args]);

  return stdout;
}

export async function runOllamaGenerate(modelName: string, prompt: string): Promise<string> {

  const ollama = new Ollama();
  await ollama.setModel(modelName);
  const result = await ollama.generate(prompt);

  return result.output;
}
