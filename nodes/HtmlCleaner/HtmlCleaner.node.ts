import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class HtmlCleaner implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'HTML Cleaner',
    name: 'htmlCleaner',
    group: ['transform'],
    version: 1,
    description: 'Cleans HTML content using regex or sanitization rules',
    defaults: { name: 'HTML Cleaner' },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Regex to Remove',
        name: 'regex',
        type: 'string',
        default: '<[^>]+>',
        description: 'Pattern to remove HTML tags or content',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const regexPattern = this.getNodeParameter('regex', 0) as string;
    const regex = new RegExp(regexPattern, 'g');

    const newItems = items.map((item) => {
      const data = { ...item.json };
      for (const key of Object.keys(data)) {
        if (typeof data[key] === 'string') {
          data[key] = (data[key] as string).replace(regex, '');
        }
      }
      return { json: data };
    });

    return [newItems];
  }
}
