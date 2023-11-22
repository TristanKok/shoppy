import { Item, PrismaClient, ShoppingList } from "@prisma/client";
import { prompt, selectOption } from "../prompts";

// Initialize Prisma client
const prisma = new PrismaClient();

// Display the items in a shopping list.
export function displayItems(items: Item[]) {
  if (items.length > 0) {
    console.log("\nItems:");
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.description}`);
    });
  } else {
    console.log("\nThis list has no items");
  }
}

// Add items to a selected shopping list.
export async function addItems(selectedList: ShoppingList): Promise<Item[]> {
  let items: Item[] = [];
  while (true) {
    const description = await prompt(
      `Please enter item description (leave blank to finish): `
    );
    if (!description) break;

    await createItemInList(selectedList.id, description);

    console.log(`${description} added successfully`);
    items = await getAllItemsInList(selectedList.id);
    displayItems(items);
    console.log("\n");
  }
  return items;
}

// Delete items from a selected shopping list.
export async function deleteItems(selectedList: ShoppingList): Promise<Item[]> {
  let items = await getAllItemsInList(selectedList.id);

  while (true) {
    if (items.length === 0) {
      console.log(
        "There are no items to delete. Please select another option."
      );
      break;
    } else {
      displayItems(items);
    }
    const itemIds: string[] = items.map((item, index) => String(index + 1));
    const selectedOption = await selectOption(
      itemIds,
      `Please enter item id to delete (leave blank to finish): `
    );
    if (!selectedOption) break;
    const selectedItem = items[parseInt(selectedOption) - 1];
    await deleteItemInList(selectedList.id, selectedItem.id);
    items = await getAllItemsInList(selectedList.id);
  }

  return items;
}

//  Create a new item in a shopping list
export async function createItemInList(
  listId: number,
  description: string
): Promise<void> {
  try {
    await prisma.item.create({
      data: {
        description,
        shoppingListId: listId,
      },
    });
  } catch (error: any) {
    throw error(`Error creating item: ${error.message}`);
  }
}

// Get all items in a shopping list
export async function getAllItemsInList(listId: number): Promise<Item[]> {
  try {
    return await prisma.item.findMany({
      where: { shoppingListId: listId },
    });
  } catch (error: any) {
    throw error(`Error fetching items: ${error.message}`);
  }
}

// Delete an item from a shopping list.
export async function deleteItemInList(
  listId: number,
  itemId: number
): Promise<void> {
  try {
    await prisma.item.delete({
      where: { id: itemId, shoppingListId: listId },
    });

    console.log(`\nItem deleted successfully`);
  } catch (error: any) {
    throw error(`Error deleting item: ${error.message}`);
  }
}
