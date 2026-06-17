import DOMPurify from 'dompurify';

const MAX_TITLE_LENGTH = 200;

/**
 * Validate a todo title before sanitization.
 * Returns true if the title is non-empty and within the length limit.
 */
export function isValidTodoTitle(title) {
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= MAX_TITLE_LENGTH;
}

/**
 * Sanitize a todo title: strip all HTML tags and attributes.
 * Call this after isValidTodoTitle passes.
 */
export function sanitizeTodoTitle(title) {
    return DOMPurify.sanitize(title.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}
