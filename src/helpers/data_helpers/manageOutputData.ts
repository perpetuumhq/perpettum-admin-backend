/**
 * Outputs data, whether it's a single object or an array of objects.
 * Optionally removes specified keys from the output. By default, removes _key, _id, and _rev.
 * If _key exists, the id property is set to its value.
 * This function works recursively to clean nested objects and arrays as well.
 * 
 * @param {Object|Object[]} data - The input data, either an object or an array of objects.
 * @param {string[]} [keysToRemove=[]] - An optional array of keys to remove from the output.
 * @returns {Object|Object[]} The modified data without the specified keys.
 */
export default function manageOutput(data: any, keysToRemove = []) {
    const removeKeys = (obj: any, keys: any) => {
        if (obj._key) {
            obj.id = obj._key;
            delete obj._key;
        }
        // Delete default keys
        ["_id", "_rev"].forEach(key => delete obj[key]);
        // Delete additional specified keys
        keys.forEach((k: any) => delete obj[k]);

        // Recurse for nested objects
        for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                obj[key] = removeKeys(obj[key], keys);
            }
        }
        return obj;
    };

    if (Array.isArray(data)) {
        return data.map(item => removeKeys({ ...item }, keysToRemove));
    } else {
        return removeKeys({ ...data }, keysToRemove);
    }
}
