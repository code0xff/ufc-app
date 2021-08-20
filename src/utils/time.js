const convertToDate = (timestamp) => {
  return timestamp ? new Date(Number(timestamp) * 1000) : timestamp;
}

export {
  convertToDate
} 