export function loadSession(key) {
    const item = window.sessionStorage.getItem(key);
    return item != null ? JSON.parse(item) : {};
}