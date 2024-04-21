import inquirer from "inquirer";

const composer = {
    async ask() {
        return this;
    },

    async handle() {
        console.log("installing Composer");
    },
};

export {composer};