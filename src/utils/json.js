const checkJson = (param) => {
  try {
    JSON.parse(param);
  } catch (e) {
    return false;
  }
  return true;
}

export {
  checkJson
}