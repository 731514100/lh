/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 校验用户名可以为中文，英文字母，数字及下划线组成，长度2~20 位
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /^[\u4E00-\u9FA5\uF900-\uFA2D|\w]{2,20}$/.test(str);
}
/**
 * @param {string | Number} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  return /^1[3456789]\d{9}$/.test(phone);
}
/**
 * 密码中必须包含字母（ 不区分大小写）、数字，且长度在6到20个数之间
 * @param {string} password
 * @returns {Boolean}
 */
export function validPassword(password) {
  return /(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}/.test(password);
}
/**
 * 验证纯数字
 * @param {string | Number} num
 * @returns {Boolean}
 */
export function validPureNum(num) {
  return /^[0-9]*$/.test(num);
}
