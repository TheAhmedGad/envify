import chalk from "chalk";

function output() {
    let message = '';

    function text(msg) {
        message += msg;
        return methods;
    }

    function success(msg) {
        message += chalk.green(msg);
        return methods;
    }

    function error(msg) {
        message += chalk.red(msg);
        return methods;
    }

    function warning(msg) {
        message += chalk.yellowBright(msg);
        return methods;
    }

    function info(msg) {
        message += chalk.dim(msg);
        return methods;
    }

    function log() {
        console.log(message); //stop chaining with and log the current message
    }

    const methods = {text, success, error, warning, info, log};

    return methods;
}

export default output;