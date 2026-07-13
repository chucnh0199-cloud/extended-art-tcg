export function requireFields(
  data: Record<string, unknown>,
  fields: string[]
) {

  for (const field of fields) {

    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {

      throw new Error(`Thiếu trường: ${field}`);

    }

  }

}