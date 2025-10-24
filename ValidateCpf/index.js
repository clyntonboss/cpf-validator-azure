module.exports = async function (context, req) {
    const cpf = req.query.cpf || (req.body && req.body.cpf);

    if (!cpf) {
        context.res = {
            status: 400,
            body: "Por favor, informe um CPF."
        };
        return;
    }

    const isValid = validateCPF(cpf);
    context.res = {
        status: 200,
        body: { cpf, valido: isValid }
    };
};

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}
