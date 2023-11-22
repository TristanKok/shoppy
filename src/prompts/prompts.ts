import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const prompt = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

export async function selectOption(
  options: any[],
  question: string
): Promise<any> {
  let selectedOption;
  while (true) {
    selectedOption = await prompt(`\n${question}`);
    if (selectedOption && !options.includes(selectedOption)) {
      console.log("Invalid choice. Please try again.");
    } else {
      break;
    }
  }

  return selectedOption;
}
