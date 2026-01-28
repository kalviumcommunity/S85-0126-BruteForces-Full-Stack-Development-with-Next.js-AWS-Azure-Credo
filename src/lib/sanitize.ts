import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [], // Allow NO HTML tags (strips <b>, <script>, etc.)
    allowedAttributes: {}, // Allow NO attributes (strips onclick, href, etc.)
  });
};