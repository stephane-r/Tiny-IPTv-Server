const toPascalCase = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "$")
    .toLowerCase()
    .replace(/(\$)(\w?)/g, (m, a, b) => b.toUpperCase());
};

module.exports = toPascalCase;
