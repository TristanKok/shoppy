import { Item, PrismaClient, ShoppingList } from "@prisma/client";
import {
  deleteList,
  getAllLists,
  viewLists,
  selectShoppingList,
  confirmListDeletion,
  addList,
} from "./services/shoppingLists";
import {
  addItems,
  deleteItems,
  displayItems,
  getAllItemsInList,
} from "./services/items";
import { selectOption } from "./prompts";

// Initialize Prisma client
const prisma = new PrismaClient();

// Main function to start the application
async function main() {
  console.log("Welcome to the Shopping List App!");

  while (true) {
    try {
      // Display main menu and get user choice
      const choice = await mainMenu();

      switch (choice) {
        case 1:
          // View existing shopping lists
          const lists = await getAllLists();
          await viewLists(lists);

          // If there are lists, prompt user to select a list and display options
          if (lists.length > 0) {
            const selectedList = await selectShoppingList(lists);
            const items = await getAllItemsInList(selectedList.id);
            displayItems(items);
            await displayListOptionsAndProcess(selectedList);
          }
          break;
        case 2:
          try {
            // Add a new shopping list and display options
            const newList = await addList();
            await displayListOptionsAndProcess(newList);
          } catch (error: any) {
            console.error(`Error creating new shopping list: ${error.message}`);
          }
          break;
        case 3:
           // Exit the application
          process.exit();
        default:
          console.log("Invalid choice. Please try again.");
      }
    } catch (error: any) {
      console.error(`An error occurred in the main function: ${error.message}`);
    }
  }
}

async function mainMenu(): Promise<number> {
  console.log("\nMain Menu:");
  console.log("1. View Shopping Lists");
  console.log("2. Add New Shopping List");
  console.log("3. Exit");

  const option = await selectOption(["1", "2", "3"], "Select an option: ");

  return parseInt(option);
}

// Display available options for a selected shopping list and process user choice
async function displayListOptionsAndProcess(selectedList: ShoppingList) {
  console.log("\nList:");
  console.log(selectedList.name);
  console.log("\nOptions:");
  console.log("1. Delete List");
  console.log("2. Add items");
  console.log("3. Delete items");
  console.log("4. Back to Main Menu");

  const selectedOption = await selectOption(
    ["1", "2", "3", "4"],
    "Select an option: "
  );

  switch (parseInt(selectedOption)) {
    case 1:
      const shouldDelete = await confirmListDeletion(selectedList);

      try {
         // Delete the selected list or go back to the options
        if (shouldDelete) {
          await deleteList(selectedList.id);
        } else {
          console.log(
            `\nShopping list ${selectedList.name} has not been deleted\n`
          );
          const items = await getAllItemsInList(selectedList.id);
          displayItems(items);
          await displayListOptionsAndProcess(selectedList);
        }
      } catch (error: any) {
        console.error(`Error: ${error.message}`);
      }
      break;
    case 2:
      // Add new items to the selected list and display options again
      let newItems: Item[] = [];
      try {
        newItems = await addItems(selectedList);
      } catch (error: any) {
        console.error(`Error adding items: ${error.message}`);
      } finally {
        displayItems(newItems);
        await displayListOptionsAndProcess(selectedList);
      }
      break;
    case 3:
      // Delete items from the selected list and display options again
      let itemsAfterDeletion: Item[] = [];
      try {
        itemsAfterDeletion = await deleteItems(selectedList);
      } catch (error: any) {
        console.error(`Error deleting item: ${error.message}`);
      } finally {
        displayItems(itemsAfterDeletion);
        await displayListOptionsAndProcess(selectedList);
      }

      break;
    case 4:
      // Return to the main menu
      return;
    default:
      console.log("Invalid choice. Please try again.");
  }
}

// Start the main function, handle errors, and disconnect from the database
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
