export const wordThemes: Record<string, string[]> = {
  Nature: ["FOREST", "RIVER", "FLOWER", "MEADOW", "OCEAN", "BREEZE", "SUNSET", "ISLAND", "VALLEY", "CLOUD", "RAIN", "LEAF"],
  Kitchen: ["BAKING", "PEPPER", "BUTTER", "COOKIE", "LEMON", "CARROT", "COFFEE", "GINGER", "CHERRY", "BREAD", "HONEY", "OLIVE"],
  Adventure: ["TRAIL", "CAMPING", "COMPASS", "JOURNEY", "TICKET", "BRIDGE", "CABIN", "HIKING", "SUMMIT", "MAP", "SAILING", "EXPLORE"],
};

export function shuffleItems<Value>(items: Value[], random = Math.random): Value[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export type WordSearch = { cells: string[]; words: string[]; paths: Record<string, number[]>; size: number };

export function createWordSearch(theme: string, random = Math.random): WordSearch {
  const size = 8;
  const words = shuffleItems(wordThemes[theme] || wordThemes.Nature, random).slice(0, 6);
  const cells: string[] = Array(64).fill("");
  const paths: Record<string, number[]> = {};
  const directions = [-1, 0, 1].flatMap((row) => [-1, 0, 1].map((col) => [row, col])).filter(([row, col]) => row || col);
  let failed = false;
  for (const word of [...words].sort((left, right) => right.length - left.length)) {
    const candidates: number[][] = [];
    for (let start = 0; start < 64; start += 1) {
      for (const [rowStep, colStep] of directions) {
        const path = Array.from({ length: word.length }, (_, offset) => {
          const row = Math.floor(start / size) + offset * rowStep;
          const col = start % size + offset * colStep;
          return row >= 0 && row < size && col >= 0 && col < size ? row * size + col : -1;
        });
        if (path.every((index, offset) => index >= 0 && (!cells[index] || cells[index] === word[offset]))) candidates.push(path);
      }
    }
    if (!candidates.length) { failed = true; break; }
    const path = candidates[Math.floor(random() * candidates.length)];
    path.forEach((index, offset) => { cells[index] = word[offset]; });
    paths[word] = path;
  }
  if (failed) {
    cells.fill("");
    const rows = shuffleItems(Array.from({ length: 8 }, (_, index) => index), random);
    words.forEach((word, index) => {
      const reversed = random() < 0.5;
      const offset = Math.floor(random() * (size - word.length + 1));
      const path = Array.from({ length: word.length }, (_, letter) => rows[index] * size + offset + (reversed ? word.length - letter - 1 : letter));
      path.forEach((cell, letter) => { cells[cell] = word[letter]; });
      paths[word] = path;
    });
  }
  return { size, words, paths, cells: cells.map((letter) => letter || String.fromCharCode(65 + Math.floor(random() * 26))) };
}

export function findWordPath(puzzle: WordSearch, first: number, last: number): { word: string; path: number[] } | null {
  const rowDelta = Math.floor(last / puzzle.size) - Math.floor(first / puzzle.size);
  const colDelta = last % puzzle.size - first % puzzle.size;
  if ((!rowDelta && !colDelta) || (rowDelta && colDelta && Math.abs(rowDelta) !== Math.abs(colDelta))) return null;
  const distance = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
  const path = Array.from({ length: distance + 1 }, (_, offset) => first + offset * (Math.sign(rowDelta) * puzzle.size + Math.sign(colDelta)));
  const selected = path.map((index) => puzzle.cells[index]).join("");
  const word = puzzle.words.find((target) => target === selected || target === [...selected].reverse().join(""));
  if (!word) return null;
  return { word, path: word === selected ? path : [...path].reverse() };
}

export const hangmanBank: Record<string, { word: string; clue: string }[]> = {
  Nature: [
    { word: "FOREST", clue: "A large area covered in trees" }, { word: "DOLPHIN", clue: "A marine mammal known for its clicks and whistles" },
    { word: "RAINBOW", clue: "Colors in the sky after rain" }, { word: "GLACIER", clue: "A very slow-moving river of ice" },
    { word: "SPARROW", clue: "A small bird often seen in gardens" }, { word: "PENGUIN", clue: "A seabird that swims but cannot fly" },
    { word: "VOLCANO", clue: "A mountain that can release lava" }, { word: "MEADOW", clue: "An open field of grass and wildflowers" },
    { word: "THUNDER", clue: "The sound that follows lightning" }, { word: "WILLOW", clue: "A tree with long, drooping branches" },
    { word: "CORAL", clue: "Tiny sea animals that build reefs" }, { word: "DESERT", clue: "A region with very little rainfall" },
    { word: "OTTER", clue: "A playful mammal that swims in rivers" }, { word: "ECLIPSE", clue: "When one celestial body hides another" },
    { word: "BADGER", clue: "A burrowing mammal with a striped face" }, { word: "ORCHID", clue: "A flower with elaborate, symmetrical petals" },
    { word: "ISLAND", clue: "Land surrounded by water" }, { word: "BREEZE", clue: "A light, gentle wind" },
    { word: "CANYON", clue: "A deep valley with steep sides" }, { word: "ACORN", clue: "The seed of an oak tree" },
  ],
  Kitchen: [
    { word: "PEPPER", clue: "A seasoning that often sits next to salt" }, { word: "WAFFLE", clue: "A breakfast food with a square-patterned surface" },
    { word: "SPATULA", clue: "A flat kitchen tool for flipping food" }, { word: "CINNAMON", clue: "A warm spice made from tree bark" },
    { word: "AVOCADO", clue: "The green fruit used to make guacamole" }, { word: "BISCUIT", clue: "A flaky baked side often served with gravy" },
    { word: "APRICOT", clue: "A small orange stone fruit" }, { word: "SKILLET", clue: "A frying pan, often made of cast iron" },
    { word: "VANILLA", clue: "A flavoring made from orchid seed pods" }, { word: "MUSTARD", clue: "A tangy condiment made from seeds" },
    { word: "PRETZEL", clue: "A salty baked snack twisted into a knot" }, { word: "CHERRY", clue: "A small red fruit with a pit" },
    { word: "NOODLE", clue: "A long strip of dough cooked in liquid" }, { word: "GINGER", clue: "A spicy root used in cooking and tea" },
    { word: "PANCAKE", clue: "A breakfast cake cooked on a griddle" }, { word: "LEMON", clue: "A sour yellow citrus fruit" },
    { word: "HONEY", clue: "A sweet food made by bees" }, { word: "LENTIL", clue: "A small lens-shaped legume" },
    { word: "RADISH", clue: "A crisp root vegetable with a peppery bite" }, { word: "PUMPKIN", clue: "An orange squash used in fall pies" },
  ],
  Adventure: [
    { word: "COMPASS", clue: "An instrument whose needle points north" }, { word: "BACKPACK", clue: "A bag carried on your shoulders" },
    { word: "LANTERN", clue: "A portable light for a campsite" }, { word: "PASSPORT", clue: "A document used for international travel" },
    { word: "KAYAK", clue: "A narrow boat moved with a double-bladed paddle" }, { word: "SUMMIT", clue: "The highest point of a mountain" },
    { word: "BRIDGE", clue: "A structure that crosses a gap" }, { word: "TUNNEL", clue: "A passage through a hill or beneath the ground" },
    { word: "ANCHOR", clue: "A heavy object used to hold a boat in place" }, { word: "JOURNEY", clue: "Travel from one place to another" },
    { word: "CABIN", clue: "A small wooden shelter in the woods" }, { word: "TRAIL", clue: "A path used for walking or hiking" },
    { word: "CAMPFIRE", clue: "An outdoor fire for warmth and cooking" }, { word: "BICYCLE", clue: "A two-wheeled vehicle powered by pedals" },
    { word: "TICKET", clue: "Proof that you paid for a ride or admission" }, { word: "HARBOR", clue: "A sheltered place where ships can dock" },
    { word: "SAILBOAT", clue: "A boat that uses the wind to move" }, { word: "SUITCASE", clue: "A case for carrying clothes while traveling" },
    { word: "HORIZON", clue: "The line where earth and sky seem to meet" }, { word: "LOOKOUT", clue: "A high place used to watch the surroundings" },
  ],
};

export function chooseHangmanWord(theme: string, previous = "", random = Math.random) {
  const choices = (hangmanBank[theme] || hangmanBank.Nature).filter((entry) => entry.word !== previous);
  return choices[Math.floor(random() * choices.length)];
}

export function hangmanRound(word: string, guesses: string[], limit: number) {
  const unique = [...new Set(guesses)];
  const misses = unique.filter((letter) => !word.includes(letter)).length;
  return { misses, won: [...word].every((letter) => unique.includes(letter)), lost: misses >= limit };
}
