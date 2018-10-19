function leftTrim(parts) {
  let previousEmpty = true;
  return parts.filter((token) => {
    if (token.type === 'literal' && !token.value.trim()) {
      if (previousEmpty) return false;
      previousEmpty = true;
      return true;
    } else {
      previousEmpty = false;
    }
    return true;
  });
}

export default function(parts) {
  return leftTrim(leftTrim(parts).reverse()).reverse();
}
