import generator from "generate-password";

const generatePassword = () => {
    const genPassword = generator.generate({
        length: 10,
        numbers: true
    });

    return genPassword;
}

export default generatePassword;