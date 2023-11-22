import { PrismaClient, ShoppingList } from "@prisma/client";
import { prompt, selectOption } from "../prompts";

// Initialize Prisma client
const prisma = new PrismaClient();

// Display available shopping lists
export async function viewLists(lists: ShoppingList[]) {
  if (lists.length === 0) {
    console.log(
      "You have no lists available. You must create a list before being able to view it."
    );
    return;
  }

  console.log("\nShopping Lists:");
  lists.forEach((list, index) => {
    console.log(`${index + 1}. ${list.name}`);
  });
}

// Prompt the user to select a shopping list from the provided array
export async function selectShoppingList(
  lists: ShoppingList[]
): Promise<ShoppingList> {
  const listIds: string[] = lists.map((list, index) => String(index + 1));

  const selectedOption = await selectOption(
    listIds,
    "Please select a shopping list: "
  );

  const selectedList = lists[parseInt(selectedOption) - 1];

  return selectedList;
}

// Prompt the user to confirm the deletion of a shopping list
export async function confirmListDeletion(
  list: ShoppingList
): Promise<boolean> {
  const confirm = await selectOption(
    ["y", "n"],
    `Are you sure you want to delete the ${list.name} list? (y/n): `
  );

  return confirm === "y";
}

// Get a unique list name from the user
export async function getUniqueListName(): Promise<string> {
  while (true) {
    const listName = await prompt(`Please enter a List Name: `);
    const listsWithName = await prisma.shoppingList.findMany({
      where: { name: listName! },
    });

    if (listsWithName.length === 0) {
      return listName!;
    } else {
      console.log(
        "A list with that name already exists. Please choose a different name."
      );
    }
  }
}

// Add a new shopping list and return the created list
export async function addList(): Promise<ShoppingList> {
  const listName = await getUniqueListName();

  const newList = await createList(listName);
  console.log(`Shopping list ${listName} created successfully`);

  return newList;
}

// Create a new shopping list
export async function createList(listName: string): Promise<ShoppingList> {
  try {
    const newList = await prisma.shoppingList.create({
      data: {
        name: listName,
      },
    });

    return newList;
  } catch (error: any) {
    throw error(`Error creating new shopping list: ${error.message}`);
  }
}

// Get all shopping lists
export async function getAllLists(): Promise<ShoppingList[]> {
  try {
    return await prisma.shoppingList.findMany();
  } catch (error: any) {
    throw error(`Error fetching lists: ${error.message}`);
  }
}

// Delete a shopping list by ID
export async function deleteList(listId: number): Promise<void> {
  try {
    await prisma.shoppingList.delete({
      where: { id: listId },
    });

    console.log(`\nShopping list deleted successfully`);
  } catch (error: any) {
    throw error(`Error deleting shopping list: ${error.message}`);
  }
}
