export interface Accents {
    letter: string;
    accent: RegExp;
}

export const accents: Accents[] = [
    { letter: 'A', accent: /\u00C1/g },
    { letter: 'E', accent: /\u00C9/g },
    { letter: 'I', accent: /\u00CD/g },
    { letter: 'O', accent: /\u00D3/g },
    { letter: 'U', accent: /\u00DA/g },
    { letter: 'a', accent: /\u00E1/g },
    { letter: 'e', accent: /\u00E9/g },
    { letter: 'i', accent: /\u00ED/g },
    { letter: 'o', accent: /\u00F3/g },
    { letter: 'u', accent: /\u00FA/g },
];

export const removeAccents = (input?: string | null) => {
    if ('string' !== typeof (input)) {
        return new TypeError(`Expected 'input' to be of type string, but received '${input}'`);
    }

    return !input.length ?
        input :
        input.replace(/(\S)/g, (_, s: string) => {
            const normalized = accents.find(n => new RegExp(n.accent).test(s));
            return null == normalized ? s : normalized.letter;
        });
}

export default removeAccents;