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

module.exports = function(parts) {
  return leftTrim(leftTrim(parts).reverse()).reverse();
}
