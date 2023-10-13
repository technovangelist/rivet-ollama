// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

// This defines your new type of node.
export type RunOllama = ChartNode<
  "runOllama",
  RunOllamaData
>;

// This defines the data that your new node will store.
export type RunOllamaData = {

  modelName: string;

  /** Takes in the script path using an input if true/. */
  // useScriptPathInput?: boolean;
  useModelNameInput?: boolean;

  /** Arguments to pass to the python script. */
  // arguments: string;
  prompt: string;

  /** Take in the arguments to the script using an input if true. */
  // useArgumentsInput?: boolean;
  usePromptInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export default function (rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const nodeImpl: PluginNodeImpl<RunOllama> = {
    // This should create a new instance of your node type from scratch.
    create(): RunOllama {
      const node: RunOllama = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          modelName: "llama2",
          // arguments: "",
          prompt: "Why is the sky blue?",
        },

        // This is the default title of your node.
        title: "Run Ollama",

        // This must match the type of your node.
        type: "runOllama",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: RunOllamaData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      // if (data.useScriptPathInput) {
      if (data.useModelNameInput) {
        inputs.push({
          id: "modelName" as PortId,
          dataType: "string",
          title: "Model Name",
        });
      }

      // if (data.useArgumentsInput) {
      if (data.usePromptInput) {
        inputs.push({
          id: "prompt" as PortId,
          dataType: "string",
          title: "Prompt",
        });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: RunOllamaData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "output" as PortId,
          dataType: "string",
          title: "Output",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Run Ollama Generate",
        group: "Common",
        infoBoxBody:
          "This will run Ollama.",
        infoBoxTitle: "Run Ollama Generate",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: RunOllamaData
    ): EditorDefinition<RunOllama>[] {
      return [
        {
          type: "string",
          dataKey: "modelName",
          // useInputToggleDataKey: "useScriptPathInput",
          useInputToggleDataKey: "useModelNameInput",
          label: "Model Name",
        },
        {
          type: "string",
          // dataKey: "arguments",
          dataKey: "prompt",
          // useInputToggleDataKey: "useArgumentsInput",
          useInputToggleDataKey: "usePromptInput",
          label: "Prompt",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: RunOllamaData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        ${data.modelName} ${data.prompt}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: RunOllamaData,
      inputData: Inputs,
      context: InternalProcessContext
    ): Promise<Outputs> {
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }

      const modelName = rivet.getInputOrData(
        data,
        inputData,
        "modelName",
        "string"
      );
      const prompt = rivet.getInputOrData(
        data,
        inputData,
        "prompt",
        "string"
      );

      // let args: string[];
      // let prompt: string;

      // function splitArgs(args: string): string[] {
      //   const matcher = /(?:[^\s"]+|"[^"]*")+/g;
      //   return args.match(matcher) || [];
      // }

      // const inputModel = inputData["modelName" as PortId];
      // if (data.useModelNameInput && inputModel) {
      //   if (rivet.isArrayDataType(inputModel.type)) {
      //    modelName = rivet.coerceType(inputModel, "string");
      //   } else {
      //     const stringModel = 
      //  }
      // }

      // const inputArguments = inputData["arguments" as PortId];
      // if (data.useArgumentsInput && inputArguments) {
      //   if (rivet.isArrayDataType(inputArguments.type)) {
      //     args = rivet.coerceType(inputArguments, "string[]");
      //   } else {
      //     const stringArgs = rivet.coerceType(inputArguments, "string");
      //     args = splitArgs(stringArgs);
      //   }
      // } else {
      //   args = splitArgs(data.arguments);
      // }

      // IMPORTANT
      // It is important that you separate node-only plugins into two separately bundled parts:
      // 1. The isomorphic bundle, which contains the node definition and all the code here
      // 2. The node bundle, which contains the node entry point and any node-only code
      // You are allowed to dynamically import the node entry point from the isomorphic bundle (in the process function)
      const { runPythonScript, runOllamaGenerate } = await import("../nodeEntry");

      // const output = await runPythonScript(scriptPath, args);
      const output = await runOllamaGenerate(modelName, prompt);
      return {
        ["output" as PortId]: {
          type: "string",
          value: output,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const nodeDefinition = rivet.pluginNodeDefinition(
    nodeImpl,
    "Run Ollama"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return nodeDefinition;
}
