const storage = {
    set: (key, value) => {
        const stringifiedValue = JSON.stringify(value);
        sessionStorage.setItem(key, stringifiedValue);
    },
    get:(key) => {
        const result = sessionStorage.getItem(key);
        return result ? JSON.parse(result) : null;
    },
    remove:(key) => {
        sessionStorage.removeItem(key);
    },
    clear:() => {
        sessionStorage.clear();
    }
};