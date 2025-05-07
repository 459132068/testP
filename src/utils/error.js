
const errorHelper = ({ message, key, type, data, ...params }) => {
    const error = new Error(message);
    error.key = key || message;
    error.type = type;
    error.data = data;
    Object.assign(error, params);
    return error;
}

export default errorHelper;
