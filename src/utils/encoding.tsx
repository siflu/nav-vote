const ENC_HEX = "hex";
const ENC_UTF8 = "utf8";

export function bufferToArray(buf: Buffer): Uint8Array {
    return new Uint8Array(buf);
}

export function bufferToHex(buf: Buffer, prefixed = false): string {
    const hex = buf.toString(ENC_HEX);
    return prefixed ? addHexPrefix(hex) : hex;
}

export function utf8ToBuffer(utf8: string): Buffer {
    return Buffer.from(utf8, ENC_UTF8);
}

export function utf8ToArray(utf8: string): Uint8Array {
    return bufferToArray(utf8ToBuffer(utf8));
}

export function utf8ToHex(utf8: string, prefixed = false): string {
    return bufferToHex(utf8ToBuffer(utf8), prefixed);
}

export function addHexPrefix(hex: string): string {
    return hex.startsWith("0x") ? hex : `0x${hex}`;
}
