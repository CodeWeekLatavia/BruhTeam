module.exports = {
  generateUID,
};

function generateUID(length) {
  var ret_val = "";
  for (var i = 0; i < length; i++)
    ret_val += String.fromCharCode(48 + Math.floor(Math.random() * 74));
  return ret_val;
}
