export const maskCPF = (value) => {
    if (!value) return "";
    let digits = value.replace(/\D/g, "");

    // limita a 11 dígitos
    digits = digits.substring(0, 11);

    // aplica a máscara progressivamente
    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 6) {
        return digits.replace(/(\d{3})(\d+)/, "$1.$2");
    }
    if (digits.length <= 9) {
        return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    }

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
};


export const maskPhone = (value) => {

    let digits = value.replace(/\D/g, '');
    digits = digits.substring(0, 11);
    let formattedValue = '';

    if (digits.length > 0) {
        formattedValue += '(' + digits.substring(0, 2);
    }

    if (digits.length >= 3) {
        formattedValue += ') ' + digits.substring(2, 7);
    }

    if (digits.length >= 8) {
        formattedValue += '-' + digits.substring(7, 11);
    }

    return formattedValue;
    //ex: (00) 00000-0000 -> 15 caracteres
};

export const validatePastDate = (value) => {
    if (!value) return true;

    const selectedDate = new Date(value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return true;
    }

    return 'A data de nascimento deve ser anterior ao dia atual.';
};

export const maskName = (value) => {
    if (!value || value.trim().length < 1) return '';
    return value.replace(/[^A-Za-záàâãéèêíïóôõöúçñ\s]/g, "");
};