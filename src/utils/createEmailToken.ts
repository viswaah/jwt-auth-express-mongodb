const createEmailToken = (count: number) => {
  var chars = "acdefhiklmnoqrstuvwxyz0123456789".split("");
  var result = "";
  for (var i = 0; i < count; i++) {
    var x = Math.floor(Math.random() * chars.length);
    result += chars[x];
  }
  return result;
};

export { createEmailToken };
