"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Welcome to the Shopping List App!');
        while (true) {
            const choice = yield showMainMenu();
            switch (choice) {
                case '1':
                    yield viewItems();
                    break;
                case '2':
                    yield addItems();
                    break;
                case '3':
                    process.exit();
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    });
}
function showMainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\nMain Menu:');
        console.log('1. View Items');
        console.log('2. Add Items');
        console.log('3. Exit');
        return new Promise((resolve) => {
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Select an option: ', (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    });
}
function viewItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const lists = yield prisma.shoppingList.findMany();
        if (lists.length === 0) {
            console.log('No lists available. Create a new list.');
            return;
        }
        console.log('\nShopping Lists:');
        for (const list of lists) {
            console.log(`${list.id}. ${list.name}`);
        }
        const selectedListId = yield promptListSelection();
        const items = yield prisma.item.findMany({
            where: { shoppingListId: selectedListId },
        });
        console.log('\nItems:');
        for (const item of items) {
            const status = item.complete ? '[X]' : '[ ]';
            console.log(`${status} ${item.description}`);
        }
    });
}
function addItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const listName = yield prompt('Enter the name of the shopping list: ');
        const list = yield prisma.shoppingList.create({
            data: { name: listName },
        });
        console.log(`Shopping list "${list.name}" created.`);
        while (true) {
            const description = yield prompt('Enter item description (empty to finish): ');
            if (!description)
                break;
            yield prisma.item.create({
                data: { description, shoppingListId: list.id },
            });
            console.log(`Item "${description}" added to the list.`);
        }
    });
}
function promptListSelection() {
    return __awaiter(this, void 0, void 0, function* () {
        const lists = yield prisma.shoppingList.findMany();
        console.log('\nSelect a shopping list:');
        for (const list of lists) {
            console.log(`${list.id}. ${list.name}`);
        }
        return yield prompt('Enter the ID of the list: ');
    });
}
function prompt(question) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
