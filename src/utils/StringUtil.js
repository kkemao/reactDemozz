export default class StringUtil {
  static getStringBytes(str) {
    let bytes = 0,
      len = str.length,
      codePoint,
      next;
    for (let i = 0; i < len; i++) {
      codePoint = str.charCodeAt(i);

      // Lone surrogates cannot be passed to encodeURI
      if (codePoint >= 0xd800 && codePoint < 0xe000) {
        if (codePoint < 0xdc00 && i + 1 < len) {
          next = str.charCodeAt(i + 1);

          if (next >= 0xdc00 && next < 0xe000) {
            bytes += 4;
            i++;
            continue;
          }
        }
      }

      bytes += codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : 3;
    }
    return bytes;
  }
}
