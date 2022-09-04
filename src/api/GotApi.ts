interface Character {
  name: string,
}

export async function getCharacters(text: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/characters?name=${text}`);
    const data = await res.json();
    return data.map((item: Character) => item.name);
  } catch (e) {
    console.error(e);
  }
}
