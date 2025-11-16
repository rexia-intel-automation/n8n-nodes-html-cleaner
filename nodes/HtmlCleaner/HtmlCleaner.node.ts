import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class HtmlCleaner implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML Cleaner',
		name: 'htmlCleaner',
		icon: 'file:htmlCleaner.svg',
		group: ['transform'],
		version: 1,
		description: 'Clean and sanitize HTML content for LLM processing and web scraping workflows',
		defaults: {
			name: 'HTML Cleaner',
			color: '#4A90E2',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Remove HTML Tags',
						value: 'removeTags',
						description: 'Remove all HTML tags from content',
						action: 'Remove HTML tags from content',
					},
					{
						name: 'Clean with Regex',
						value: 'cleanRegex',
						description: 'Clean content using custom regex pattern',
						action: 'Clean content with custom regex',
					},
					{
						name: 'Strip Scripts and Styles',
						value: 'stripScriptsStyles',
						description: 'Remove script and style tags with their content',
						action: 'Strip scripts and styles from HTML',
					},
					{
						name: 'Remove Attributes',
						value: 'removeAttributes',
						description: 'Remove HTML attributes while keeping tags',
						action: 'Remove HTML attributes',
					},
					{
						name: 'Normalize Whitespace',
						value: 'normalizeWhitespace',
						description: 'Normalize and clean up whitespace',
						action: 'Normalize whitespace in content',
					},
				],
				default: 'removeTags',
			},
			{
				displayName: 'Field to Clean',
				name: 'fieldToClean',
				type: 'string',
				default: '',
				placeholder: 'e.g., html, content, body',
				description: 'Specific field to clean. Leave empty to clean all string fields.',
			},
			{
				displayName: 'Regex Pattern',
				name: 'regexPattern',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['cleanRegex'],
					},
				},
				default: '<[^>]+>',
				description: 'Regular expression pattern to match and remove',
				placeholder: 'e.g., <[^>]+> to remove all HTML tags',
			},
			{
				displayName: 'Regex Flags',
				name: 'regexFlags',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['cleanRegex'],
					},
				},
				default: 'g',
				description: 'Regex flags (g=global, i=case-insensitive, m=multiline)',
				placeholder: 'e.g., gi',
			},
			{
				displayName: 'Replacement',
				name: 'replacement',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['cleanRegex', 'removeTags'],
					},
				},
				default: '',
				description: 'Text to replace matched patterns with',
				placeholder: 'Leave empty to remove matched content',
			},
			{
				displayName: 'Preserve Line Breaks',
				name: 'preserveLineBreaks',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['removeTags'],
					},
				},
				default: true,
				description: 'Whether to preserve line breaks when removing tags (converts &lt;br&gt; to \\n)',
			},
			{
				displayName: 'Decode HTML Entities',
				name: 'decodeEntities',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['removeTags', 'normalizeWhitespace'],
					},
				},
				default: true,
				description: 'Whether to decode HTML entities like &amp;nbsp;, &amp;lt;, &amp;gt;',
			},
			{
				displayName: 'Trim Result',
				name: 'trimResult',
				type: 'boolean',
				default: true,
				description: 'Whether to trim whitespace from start and end of result',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const fieldToClean = this.getNodeParameter('fieldToClean', itemIndex) as string;
				const trimResult = this.getNodeParameter('trimResult', itemIndex) as boolean;

				const item = items[itemIndex];
				const newItem: INodeExecutionData = {
					json: { ...item.json },
					pairedItem: { item: itemIndex },
				};

				// Determine which fields to process
				const fieldsToProcess = fieldToClean
					? [fieldToClean]
					: Object.keys(newItem.json).filter(key => typeof newItem.json[key] === 'string');

				// Process each field
				for (const fieldName of fieldsToProcess) {
					let content = newItem.json[fieldName];

					// Skip if field doesn't exist or isn't a string
					if (content === undefined || content === null || typeof content !== 'string') {
						continue;
					}

					// Apply the selected operation
					switch (operation) {
						case 'removeTags':
							content = HtmlCleaner.removeHtmlTags(
								content,
								this.getNodeParameter('preserveLineBreaks', itemIndex) as boolean,
								this.getNodeParameter('decodeEntities', itemIndex) as boolean,
								this.getNodeParameter('replacement', itemIndex) as string,
							);
							break;

						case 'cleanRegex':
							content = HtmlCleaner.cleanWithRegex(
								content,
								this.getNodeParameter('regexPattern', itemIndex) as string,
								this.getNodeParameter('regexFlags', itemIndex) as string,
								this.getNodeParameter('replacement', itemIndex) as string,
							);
							break;

						case 'stripScriptsStyles':
							content = HtmlCleaner.stripScriptsAndStyles(content);
							break;

						case 'removeAttributes':
							content = HtmlCleaner.removeAttributes(content);
							break;

						case 'normalizeWhitespace':
							content = HtmlCleaner.normalizeWhitespace(
								content,
								this.getNodeParameter('decodeEntities', itemIndex) as boolean,
							);
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown operation: ${operation}`,
								{ itemIndex },
							);
					}

					// Trim if requested
					if (trimResult && typeof content === 'string') {
						content = content.trim();
					}

					newItem.json[fieldName] = content;
				}

				returnData.push(newItem);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	private static removeHtmlTags(
		content: string,
		preserveLineBreaks: boolean,
		decodeEntities: boolean,
		replacement: string,
	): string {
		let result = content;

		// Convert <br> tags to newlines if preserving line breaks
		if (preserveLineBreaks) {
			result = result.replace(/<br\s*\/?>/gi, '\n');
			result = result.replace(/<\/p>/gi, '\n\n');
			result = result.replace(/<\/div>/gi, '\n');
			result = result.replace(/<\/li>/gi, '\n');
		}

		// Remove all HTML tags
		result = result.replace(/<[^>]+>/g, replacement);

		// Decode HTML entities if requested
		if (decodeEntities) {
			result = HtmlCleaner.decodeHtmlEntities(result);
		}

		return result;
	}

	private static cleanWithRegex(
		content: string,
		pattern: string,
		flags: string,
		replacement: string,
	): string {
		try {
			const regex = new RegExp(pattern, flags);
			return content.replace(regex, replacement);
		} catch (error) {
			throw new Error(`Invalid regex pattern: ${(error as Error).message}`);
		}
	}

	private static stripScriptsAndStyles(content: string): string {
		let result = content;

		// Remove script tags and their content
		result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

		// Remove style tags and their content
		result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

		// Remove inline style attributes
		result = result.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');

		// Remove event handler attributes
		result = result.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

		return result;
	}

	private static removeAttributes(content: string): string {
		// Remove all attributes from HTML tags, keeping only the tag names
		return content.replace(/<(\w+)\s+[^>]*>/g, '<$1>');
	}

	private static normalizeWhitespace(content: string, decodeEntities: boolean): string {
		let result = content;

		// Decode HTML entities first if requested
		if (decodeEntities) {
			result = HtmlCleaner.decodeHtmlEntities(result);
		}

		// Replace multiple spaces with single space
		result = result.replace(/[ \t]+/g, ' ');

		// Replace multiple newlines with double newline
		result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

		// Remove spaces at the beginning of lines
		result = result.replace(/^[ \t]+/gm, '');

		// Remove spaces at the end of lines
		result = result.replace(/[ \t]+$/gm, '');

		return result;
	}

	private static decodeHtmlEntities(content: string): string {
		const entities: IDataObject = {
			'&nbsp;': ' ',
			'&lt;': '<',
			'&gt;': '>',
			'&amp;': '&',
			'&quot;': '"',
			'&#39;': "'",
			'&apos;': "'",
			'&cent;': '¢',
			'&pound;': '£',
			'&yen;': '¥',
			'&euro;': '€',
			'&copy;': '©',
			'&reg;': '®',
			'&trade;': '™',
			'&hellip;': '…',
			'&mdash;': '—',
			'&ndash;': '–',
			'&bull;': '•',
		};

		let result = content;

		// Replace named entities
		for (const [entity, replacement] of Object.entries(entities)) {
			result = result.replace(new RegExp(entity, 'g'), replacement as string);
		}

		// Replace numeric entities (decimal)
		result = result.replace(/&#(\d+);/g, (match, dec) => {
			return String.fromCharCode(parseInt(dec, 10));
		});

		// Replace numeric entities (hexadecimal)
		result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
			return String.fromCharCode(parseInt(hex, 16));
		});

		return result;
	}
}
