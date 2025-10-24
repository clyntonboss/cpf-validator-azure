const sanitize = s => (s||"").toString().replace(/\D/g,'');

function calculaDigito(cpfArr, fator) {
  let total = 0;
  for (let i = 0; i < cpfArr.length; i++) {
    total += cpfArr[i] * (fator--);
  }
  const resto = total % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function validaCPF(cpf) {
  cpf = sanitize(cpf);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  const nums = cpf.split('').map(Number);
  const dig1 = calculaDigito(nums.slice(0,9), 10);
  const dig2 = calculaDigito(nums.slice(0,10), 11);
  return dig1 === nums[9] && dig2 === nums[10];
}

module.exports = async function (context, req) {
  try {
    const cpf = req.body?.cpf ?? req.query?.cpf;
    if (!cpf) {
      context.res = { status: 400, body: { ok:false, message: "Informe 'cpf' no body ou query" } };
      return;
    }
    const ok = validaCPF(cpf);
    context.res = { status: 200, body: { ok, normalized: sanitize(cpf) } };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { ok:false, error: "erro interno" } };
  }
};
